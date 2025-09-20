'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <DotLottieReact
        src='/loading.json'
        loop
        autoplay
        className="w-64 h-64"
      />
      <p className="text-lg  mt-4">جاري التحميل...</p>
    </div>
  );
};