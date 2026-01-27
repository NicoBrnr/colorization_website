'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { isValidImageType, isValidFileSize, formatFileSize } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageSelect, selectedImage, onClear, disabled }: ImageUploaderProps) {
  const t = useTranslations('colorize.upload');
  const tError = useTranslations('colorize.error');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    if (!isValidImageType(file.type)) {
      setError(tError('fileType'));
      return;
    }

    if (!isValidFileSize(file.size, 10)) {
      setError(tError('fileSize'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageSelect(file, preview);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, tError]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFile]);

  if (selectedImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden border-2 border-gray-700 bg-gray-800"
      >
        <img
          src={selectedImage}
          alt="Selected image"
          className="w-full h-auto max-h-[500px] object-contain"
        />
        {!disabled && (
          <button
            onClick={onClear}
            className="absolute top-4 right-4 p-2 bg-gray-900/80 hover:bg-gray-900 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />

        <div className="flex flex-col items-center">
          <motion.div
            animate={{ y: isDragging ? -10 : 0 }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
              isDragging ? 'bg-primary/20' : 'bg-gray-700'
            }`}
          >
            {isDragging ? (
              <ImageIcon className="w-10 h-10 text-primary" />
            ) : (
              <Upload className="w-10 h-10 text-gray-400" />
            )}
          </motion.div>

          <h3 className="text-xl font-semibold text-white mb-2">
            {t('title')}
          </h3>
          <p className="text-gray-400 mb-6">
            {t('subtitle')}
          </p>

          <Button variant="outline" disabled={disabled}>
            {t('button')}
          </Button>

          <p className="text-gray-500 text-sm mt-4">
            {t('formats')}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <p className="text-rose-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
