'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Brain, Zap, ImageIcon, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const features = [
  { icon: Brain, key: 'ai', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { icon: Zap, key: 'fast', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: ImageIcon, key: 'quality', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Gift, key: 'free', color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export function Features() {
  const t = useTranslations('features');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-24 bg-gray-900" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:border-gray-600 transition-colors group">
                <CardContent>
                  <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {t(`${feature.key}.description`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
