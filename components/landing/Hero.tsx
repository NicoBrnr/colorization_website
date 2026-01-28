'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const ref = useRef(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  // Slider state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-12 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900/95" />
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* 1) Title + Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto mb-8 lg:mb-12"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            {t('title')}{' '}
            <span className="gradient-text">{t('titleHighlight')}</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* 2) Interactive Image Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Image Comparison Container */}
          <div 
            ref={sliderRef}
            className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl shadow-primary/20 cursor-ew-resize select-none"
            style={{ aspectRatio: '16/9' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Colored image (background) */}
            <div className="absolute inset-0">
              <Image
                src="/landing/french_riviera_colored.jpg"
                alt="Photo colorisée"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* B&W image (clipped) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <Image
                src="/landing/french_riviera_bw.jpg"
                alt="Photo originale"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg z-20">
              <span className="text-white text-sm font-medium">Avant</span>
            </div>
            <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-lg z-20">
              <span className="text-white text-sm font-medium">Après</span>
            </div>

            {/* Slider line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white z-30 shadow-lg"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl cursor-ew-resize hover:scale-110 transition-transform">
                <div className="flex items-center gap-1">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-gray-800 border-b-[6px] border-b-transparent" />
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-gray-800 border-b-[6px] border-b-transparent" />
                </div>
              </div>
            </div>

            {/* Drag hint (visible on first load) */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isDragging ? 0 : 0.8 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full z-20 pointer-events-none"
            >
              <span className="text-white text-sm">← Glissez pour comparer →</span>
            </motion.div>
          </div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, type: 'spring' }}
            className="absolute -left-4 top-1/4 hidden lg:block"
          >
            <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Rapide</p>
                  <p className="text-gray-400 text-xs">~20 secondes</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 3) CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8 lg:mt-12"
        >
          <Link href={`/${locale}/coloriser`}>
            <Button size="lg" className="w-full sm:w-auto group text-lg px-10 py-4">
              {t('cta')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href={`/${locale}#gallery`}>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-4">
              {t('ctaSecondary')}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
