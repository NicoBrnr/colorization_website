import { NextRequest, NextResponse } from 'next/server';

const DEOLDIFY_API_URL = process.env.DEOLDIFY_API_URL 
const DEOLDIFY_API_KEY = process.env.DEOLDIFY_API_KEY

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: JPG, PNG, WEBP' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      );
    }

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

    // Debug: Log API configuration (remove in production)
    console.log('DeOldify API URL:', DEOLDIFY_API_URL);
    console.log('API Key exists:', !!DEOLDIFY_API_KEY);
    console.log('API Key length:', DEOLDIFY_API_KEY?.length);
    console.log('API Key first 4 chars:', DEOLDIFY_API_KEY?.substring(0, 4));

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
      return NextResponse.json(
        { error: 'Colorization service error' },
        { status: apiResponse.status }
      );
    }

    // Get the colorized image
    const contentType = apiResponse.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // API returns JSON with image URL or base64
      const data = await apiResponse.json();
      return NextResponse.json({ imageUrl: data.image || data.imageUrl || data.result });
    } else {
      // API returns image directly
      const imageBuffer = await apiResponse.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');
      const imageType = contentType || 'image/jpeg';
      const dataUrl = `data:${imageType};base64,${base64}`;
      return NextResponse.json({ imageUrl: dataUrl });
    }
  } catch (error) {
    console.error('Colorization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
