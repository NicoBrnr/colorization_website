'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Settings2, Loader2, AlertCircle } from 'lucide-react';
import { ImageUploader } from '@/components/colorize/ImageUploader';
import { ColorizeResult } from '@/components/colorize/ColorizeResult';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RateLimitBanner } from '@/components/ui/RateLimitBanner';
import { colorizeImage, type ColorizeOptions } from '@/lib/api';

type ProcessingState = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

interface ColorizePageClientProps {
  initialRateLimit: {
    remaining: number;
    total: number;
    allowed: boolean;
  };
}

export default function ColorizePageClient({ initialRateLimit }: ColorizePageClientProps) {
  const t = useTranslations('colorize');

  // Image state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [colorizedImage, setColorizedImage] = useState<string | null>(null);

  // Processing state
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [error, setError] = useState<string | null>(null);

  // Rate limit state
  const [rateLimit, setRateLimit] = useState(initialRateLimit);

  // Options state
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<ColorizeOptions>({
    model: 'artistic',
    renderFactor: 35,
  });

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedFile(file);
    setPreviewImage(preview);
    setColorizedImage(null);
    setProcessingState('idle');
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setPreviewImage(null);
    setColorizedImage(null);
    setProcessingState('idle');
    setError(null);
  }, []);

  const handleColorize = async () => {
    if (!selectedFile) return;

    setProcessingState('processing');
    setError(null);

    const result = await colorizeImage(selectedFile, options);

    if (result.success && result.imageUrl) {
      setColorizedImage(result.imageUrl);
      setProcessingState('done');
      
      // Update rate limit from response if available
      if (result.remaining !== undefined && result.total !== undefined) {
        setRateLimit({
          remaining: result.remaining,
          total: result.total,
          allowed: result.remaining > 0,
        });
      }
    } else {
      setError(result.error || 'Une erreur est survenue');
      setProcessingState('error');
    }
  };

  const handleNewImage = useCallback(() => {
    handleClear();
  }, [handleClear]);

  const isProcessing = processingState === 'processing';

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Rate Limit Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <RateLimitBanner remaining={rateLimit.remaining} total={rateLimit.total} />
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {processingState === 'done' && previewImage && colorizedImage ? (
            <ColorizeResult
              key="result"
              originalImage={previewImage}
              colorizedImage={colorizedImage}
              onNewImage={handleNewImage}
            />
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Upload Zone */}
              <ImageUploader
                onImageSelect={handleImageSelect}
                selectedImage={previewImage}
                onClear={handleClear}
                disabled={isProcessing || !rateLimit.allowed}
              />

              {/* Options Toggle */}
              {previewImage && rateLimit.allowed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mx-auto"
                    disabled={isProcessing}
                  >
                    <Settings2 className="w-5 h-5" />
                    <span className="text-sm">{t('options.title')}</span>
                  </button>

                  <AnimatePresence>
                    {showOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">{t('options.title')}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Model Selection */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                {t('options.model')}
                              </label>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="model"
                                    value="artistic"
                                    checked={options.model === 'artistic'}
                                    onChange={() => setOptions({ ...options, model: 'artistic' })}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-600 bg-gray-700"
                                    disabled={isProcessing}
                                  />
                                  <span className="text-gray-300 text-sm">{t('options.modelArtistic')}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="model"
                                    value="stable"
                                    checked={options.model === 'stable'}
                                    onChange={() => setOptions({ ...options, model: 'stable' })}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-600 bg-gray-700"
                                    disabled={isProcessing}
                                  />
                                  <span className="text-gray-300 text-sm">{t('options.modelStable')}</span>
                                </label>
                              </div>
                            </div>

                            {/* Render Factor */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                {t('options.quality')}: {options.renderFactor}
                              </label>
                              <input
                                type="range"
                                min="10"
                                max="50"
                                value={options.renderFactor}
                                onChange={(e) => setOptions({ ...options, renderFactor: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                disabled={isProcessing}
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Rapide</span>
                                <span>Haute qualité</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-rose-400 text-sm">{t('error.title')}: {error}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setError(null)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      {t('error.retry')}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Colorize Button */}
              {previewImage && rateLimit.allowed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <Button
                    size="lg"
                    onClick={handleColorize}
                    disabled={isProcessing}
                    className="min-w-[200px]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('process.processing')}
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        {t('process.button')}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Processing Info */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <p className="text-gray-400 text-sm">{t('process.processingSubtitle')}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
