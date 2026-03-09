'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function ImageComparison({ beforeImage, afterImage, className = '' }: ImageComparisonProps) {
  const t = useTranslations('colorize.result');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  }, [updateSliderPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  }, [isDragging, updateSliderPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.touches[0].clientX);
  }, [updateSliderPosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  }, [isDragging, updateSliderPosition]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl border border-gray-700 select-none ${className}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* After Image (Full width, bottom layer) */}
      <div className="relative w-full">
        <img
          src={afterImage}
          alt="Colorized"
          className="w-full h-auto max-h-[600px] object-contain"
          draggable={false}
        />
        <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <span className="text-white text-sm font-medium">{t('colorized')}</span>
        </div>
      </div>

      {/* Before Image (Clipped, top layer) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img
          src={beforeImage}
          alt="Original"
          className="w-full h-full object-contain"
          draggable={false}
        />
        <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <span className="text-white text-sm font-medium">{t('original')}</span>
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize hover:scale-110 transition-transform">
          <div className="flex items-center gap-1">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-gray-800 border-b-[6px] border-b-transparent" />
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-gray-800 border-b-[6px] border-b-transparent" />
          </div>
        </div>
      </div>

      {/* Interaction hint overlay */}
      {!isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <span className="text-white text-sm">{t('dragToCompare')}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
