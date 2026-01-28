import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import ColorizePageClient from '@/components/colorize/ColorizePageClient';

export default async function ColorizePage() {
  const session = await auth();

  // Redirect to sign in if not authenticated
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  // Get rate limit info
  const rateLimit = await checkRateLimit(session.user.id);

  return (
    <ColorizePageClient initialRateLimit={rateLimit} />
  );
}
