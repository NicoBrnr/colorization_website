import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import ColorizePageClient from '@/components/colorize/ColorizePageClient';

export default async function ColorizePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  // Get rate limit info
  const rateLimit = await checkRateLimit(session.user.id);

  return (
    <ColorizePageClient initialRateLimit={rateLimit} />
  );
}
