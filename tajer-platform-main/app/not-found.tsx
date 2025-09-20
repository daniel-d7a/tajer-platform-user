"use client"
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <DotLottieReact
        src="/404.json"
        loop
        autoplay
        className="w-80 h-80"
      />
      <h2 className="text-3xl font-bold text-foreground mt-6">الصفحة غير موجودة</h2>
      <p className="text-muted-foreground mb-8 text-center mt-2">
        لم نتمكن من العثور على الصفحة التي تبحث عنها
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
};