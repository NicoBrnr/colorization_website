'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              IA de colorisation avancée
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t('title')}{' '}
              <span className="gradient-text">{t('titleHighlight')}</span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={`/${locale}/coloriser`}>
                <Button size="lg" className="w-full sm:w-auto group">
                  {t('cta')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={`/${locale}#gallery`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('ctaSecondary')}
                </Button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center gap-2 text-gray-500 justify-center lg:justify-start"
            >
              <Users className="w-5 h-5" />
              <span className="text-sm">{t('trusted')}</span>
            </motion.div>
          </motion.div>

          {/* Right: Demo Image Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl shadow-primary/10">
              {/* Demo image placeholder - before/after effect */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {/* Simulated before (grayscale) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Grayscale side */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700"
                      style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-500/50 flex items-center justify-center">
                            <span className="text-gray-400 text-4xl">👴</span>
                          </div>
                          <p className="text-gray-400 font-medium">Avant</p>
                        </div>
                      </div>
                    </div>
                    {/* Colorized side */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-rose-500/30 to-violet-600/30"
                      style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/50 to-rose-500/50 flex items-center justify-center">
                            <span className="text-4xl">👴</span>
                          </div>
                          <p className="text-white font-medium">Après</p>
                        </div>
                      </div>
                    </div>
                    {/* Center divider */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary transform -translate-x-1/2 z-10">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-4 bg-white rounded" />
                          <div className="w-0.5 h-4 bg-white rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, type: 'spring' }}
              className="absolute -bottom-4 -left-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">IA DeOldify</p>
                  <p className="text-gray-400 text-xs">Colorisation automatique</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
