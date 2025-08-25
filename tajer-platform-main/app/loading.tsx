"use client"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-pirmary" suppressHydrationWarning>
        <DotLottieReact
           src="/loading.json"
           loop
           autoplay
           width={200}
           height={200}
         /> 
    </div>
  );
};