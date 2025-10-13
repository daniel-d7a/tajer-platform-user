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
          style={{ height: '500px', width: '500px' }}
        />
        <p className=" text-lg text-muted-foreground font-cairo">
          {t('loading')}
        </p>
      </div>
    </div>
  );
}