"use client";
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFounContent() {
  const t = useTranslations('notFound');
  return (
    <div suppressHydrationWarning>
           <main className="flex flex-col items-center justify-center p-10 h-auto">
                 <DotLottieReact
      src="/404.json"
      loop
      autoplay 
      width={100}
      height={100}
      className="w-70 h-70 mb-6"
    /> 
    <div className="flex flex-col items-center justify-center space-y-4 mt-4">
                <h1 className="text-3xl font-bold text-center">{t('title')}</h1>
                <p className="text-center text-gray-600 ">{t('description')}</p>
                <Link href="/" className='bg-[var(--primary)] text-white p-2 text-center font-bold rounded-md duration-400 hover:opacity-80'>{t('backToHome')}</Link>
    </div>
              </main>
    </div>
  );
};