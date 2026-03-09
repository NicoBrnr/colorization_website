import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { reserveColorization, releaseColorization } from '@/lib/rate-limit';

const DEOLDIFY_API_URL = process.env.DEOLDIFY_API_URL;
const DEOLDIFY_API_KEY = process.env.DEOLDIFY_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to colorize images.' },
        { status: 401 }
      );
    }

    if (!DEOLDIFY_API_URL) {
      console.error('DEOLDIFY_API_URL environment variable is not set');
      return NextResponse.json(
        { error: 'Colorization service is not configured' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: JPG, PNG, WEBP' },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      );
    }

    // Atomically check rate limit and reserve a slot (prevents concurrent
    // requests from exceeding the daily limit)
    const reservation = await reserveColorization(session.user.id);

    if (!reservation.allowed) {
      return NextResponse.json(
        { 
          error: `Daily limit reached. You have used all ${reservation.total} free colorizations today. Please try again tomorrow.`,
          remaining: reservation.remaining,
          total: reservation.total
        },
        { status: 429 }
      );
    }

    try {
      // Get optional parameters
      const model = formData.get('model') as string || 'artistic';
      const renderFactor = formData.get('render_factor') as string || '35';
      const postProcess = formData.get('post_process') as string || 'true';

      // Create FormData for the DeOldify API
      const apiFormData = new FormData();
      apiFormData.append('file', file);
      apiFormData.append('model', model);
      apiFormData.append('render_factor', renderFactor);
      apiFormData.append('post_process', postProcess);

      // Call the DeOldify API
      const apiResponse = await fetch(`${DEOLDIFY_API_URL}/colorize`, {
        method: 'POST',
        headers: {
          ...(DEOLDIFY_API_KEY && { 'X-API-Key': DEOLDIFY_API_KEY }),
        },
        body: apiFormData,
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('DeOldify API error:', errorText);
        console.error('Response status:', apiResponse.status);
        console.error('Response headers:', Object.fromEntries(apiResponse.headers.entries()));

        // Release the reserved slot so the user can retry
        if (reservation.reservationId) {
          await releaseColorization(reservation.reservationId);
        }

        return NextResponse.json(
          { error: 'Colorization service error' },
          { status: apiResponse.status }
        );
      }

      // Get the colorized image
      const contentType = apiResponse.headers.get('content-type');
      let imageUrl: string | undefined;
      
      if (contentType?.includes('application/json')) {
        const data = await apiResponse.json();
        imageUrl = data.image || data.imageUrl || data.result;
      } else {
        const imageBuffer = await apiResponse.arrayBuffer();
        if (imageBuffer.byteLength > 0) {
          const base64 = Buffer.from(imageBuffer).toString('base64');
          const imageType = contentType || 'image/jpeg';
          imageUrl = `data:${imageType};base64,${base64}`;
        }
      }

      if (!imageUrl) {
        console.error('DeOldify API returned 200 but no usable image data');
        if (reservation.reservationId) {
          await releaseColorization(reservation.reservationId);
        }
        return NextResponse.json(
          { error: 'Colorization service returned no image' },
          { status: 502 }
        );
      }

      return NextResponse.json({ 
        imageUrl,
        remaining: reservation.remaining,
        total: reservation.total
      });
    } catch (apiError) {
      // Release the reserved slot on any failure after reservation
      if (reservation.reservationId) {
        await releaseColorization(reservation.reservationId);
      }
      throw apiError;
    }
  } catch (error) {
    console.error('Colorization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
