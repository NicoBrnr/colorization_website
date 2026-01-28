'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RateLimitBannerProps {
  remaining: number;
  total: number;
}

export function RateLimitBanner({ remaining, total }: RateLimitBannerProps) {
  const t = useTranslations('auth');

  const percentage = (remaining / total) * 100;
  const isLow = remaining <= 1;
  const isExhausted = remaining === 0;

  return (
    <div
      className={`rounded-lg p-4 flex items-start gap-3 ${
        isExhausted
          ? 'bg-red-950/50 border border-red-800'
          : isLow
          ? 'bg-amber-950/50 border border-amber-800'
          : 'bg-blue-950/50 border border-blue-800'
      }`}
    >
      {isExhausted ? (
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
      )}
      
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            isExhausted ? 'text-red-200' : isLow ? 'text-amber-200' : 'text-blue-200'
          }`}
        >
          {isExhausted
            ? t('limitReached')
            : t('rateLimitInfo', { remaining, total })}
        </p>
        
        {/* Progress bar */}
        <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isExhausted
                ? 'bg-red-500'
                : isLow
                ? 'bg-amber-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {isExhausted && (
          <p className="text-xs text-red-300 mt-2">
            Your daily limit will reset at midnight (00:00).
          </p>
        )}
      </div>
    </div>
  );
}
