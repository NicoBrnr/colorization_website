'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Demo gallery items with placeholder gradients
const galleryItems = [
  { id: 1, before: 'from-gray-500 to-gray-600', after: 'from-amber-600 to-rose-500', label: 'Portrait vintage' },
  { id: 2, before: 'from-gray-400 to-gray-500', after: 'from-emerald-500 to-cyan-500', label: 'Paysage nature' },
  { id: 3, before: 'from-gray-600 to-gray-700', after: 'from-violet-500 to-pink-500', label: 'Photo de famille' },
  { id: 4, before: 'from-gray-500 to-gray-600', after: 'from-orange-500 to-red-500', label: 'Architecture' },
];

export function Gallery() {
  const t = useTranslations('gallery');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <section id="gallery" className="py-24 bg-gray-900" ref={ref}>
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

        {/* Main Gallery Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Before/After comparison */}
                <div className="relative w-full h-full">
                  {/* Before (grayscale) */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${item.before}`}
                    style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
                  >
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <span className="text-white text-sm font-medium">{t('before')}</span>
                    </div>
                  </div>
                  
                  {/* After (colorized) */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${item.after}`}
                    style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
                  >
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <span className="text-white text-sm font-medium">{t('after')}</span>
                    </div>
                  </div>

                  {/* Center divider */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white transform -translate-x-1/2 z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-5 bg-gray-800 rounded" />
                        <div className="w-0.5 h-5 bg-gray-800 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-3 mt-8">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? 'border-primary scale-110'
                  : 'border-gray-700 opacity-60 hover:opacity-100'
              }`}
            >
              <div className={`w-full h-full bg-gradient-to-br ${item.after}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
