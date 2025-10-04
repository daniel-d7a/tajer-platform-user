'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTranslations } from 'next-intl';
export default function LoadingAnimation() {
    const t = useTranslations('common')
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="text-center">
        <DotLottieReact
          src="/loading.json"
          autoplay
          loop
          style={{ height: '400px', width: '400px' }}
        />
        <p className="mt-4 text-lg text-muted-foreground font-cairo">
          {t('loading')}
        </p>
      </div>
    </div>
  );
}