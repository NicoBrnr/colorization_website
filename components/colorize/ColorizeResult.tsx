'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ImageComparison } from './ImageComparison';
import { downloadImage } from '@/lib/utils';

interface ColorizeResultProps {
  originalImage: string;
  colorizedImage: string;
  onNewImage: () => void;
}

export function ColorizeResult({ originalImage, colorizedImage, onNewImage }: ColorizeResultProps) {
  const t = useTranslations('colorize.result');

  const handleDownload = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadImage(colorizedImage, `colorized-${timestamp}.jpg`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(colorizedImage);
        const blob = await response.blob();
        const file = new File([blob], 'colorized-image.jpg', { type: 'image/jpeg' });

        await navigator.share({
          title: 'Photo colorisée',
          text: 'Découvrez ma photo colorisée par IA !',
          files: [file],
        });
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
        <p className="text-gray-400">{t('compare')}</p>
      </div>

      {/* Comparison Slider */}
      <ImageComparison
        beforeImage={originalImage}
        afterImage={colorizedImage}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownload} className="group">
          <Download className="w-5 h-5 mr-2" />
          {t('download')}
        </Button>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button variant="secondary" onClick={handleShare}>
            <Share2 className="w-5 h-5 mr-2" />
            Partager
          </Button>
        )}

        <Button variant="outline" onClick={onNewImage}>
          <RefreshCw className="w-5 h-5 mr-2" />
          {t('newImage')}
        </Button>
      </div>
    </motion.div>
  );
}
