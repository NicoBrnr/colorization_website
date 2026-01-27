import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Gallery } from '@/components/landing/Gallery';
import { CTA } from '@/components/landing/CTA';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Gallery />
      <CTA />
    </>
  );
}
