'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Gallery items - update this array when adding new images
// Images should be placed in /public/gallery/ with naming: {name}_bw.{ext} and {name}_colored.{ext}
// aspect: width/height ratio (e.g., 16/9 for landscape, 3/4 for portrait)
const galleryItems = [
  { id: 1, name: 'people_at_cafe_france', ext: 'jpg', label: 'People at cafe in France', aspect: 16/9 },
  { id: 2, name: 'nice', ext: 'jpg', label: 'Nice', aspect: 16/9 },
];

export function Gallery() {
  const t = useTranslations('gallery');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
    setSliderPosition(50); // Reset slider on slide change
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    setSliderPosition(50); // Reset slider on slide change
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  const updateSliderPosition = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const currentItem = galleryItems[activeIndex];

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
          <div 
            ref={sliderRef}
            className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl select-none cursor-ew-resize bg-gray-800 max-h-[70vh] mx-auto transition-all duration-300"
            style={{ aspectRatio: currentItem.aspect }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Colored image (full background) */}
            <div className="absolute inset-0">
              <Image
                src={`/gallery/${currentItem.name}_colored.${currentItem.ext}`}
                alt={`${currentItem.label} - Colorisé`}
                fill
                className="object-cover"
                priority={activeIndex === 0}
              />
              <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-lg z-20">
                <span className="text-white text-sm font-medium">{t('after')}</span>
              </div>
            </div>

            {/* B&W image (clipped) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <Image
                src={`/gallery/${currentItem.name}_bw.${currentItem.ext}`}
                alt={`${currentItem.label} - Original`}
                fill
                className="object-cover"
                priority={activeIndex === 0}
              />
              <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg z-20">
                <span className="text-white text-sm font-medium">{t('before')}</span>
              </div>
            </div>

            {/* Slider line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white z-30"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="flex gap-0.5">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-gray-800 border-b-[6px] border-b-transparent" />
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-gray-800 border-b-[6px] border-b-transparent" />
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg z-20">
              <span className="text-white font-medium">{currentItem.label}</span>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-40"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-40"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-3 mt-8">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveIndex(index);
                setSliderPosition(50);
              }}
              className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? 'border-primary scale-110'
                  : 'border-gray-700 opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={`/gallery/${item.name}_colored.${item.ext}`}
                alt={item.label}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
