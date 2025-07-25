'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('home');
  const tc = useTranslations('header');

  const slides = [
    {
      id: 1,
      title: t('heroTitle1'),
      description: t('heroDesc1'),
      image: '/hero.png',
    },
    {
      id: 2,
      title: t('heroTitle2'),
      description: t('heroDesc2'),
      image: '/hero.png',
    },
    {
      id: 3,
      title: t('heroTitle3'),
      description: t('heroDesc3'),
      image: '/hero.png',
    },
    {
      id: 4,
      title: t('heroTitle4'),
      description: t('heroDesc4'),
      image: '/hero.png',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative overflow-hidden rounded-lg w-[95%] mx-auto ">
      <div className="relative h-[400px] md:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <Image
              src={slide.image || '/placeholder.svg'}
              alt={slide.title}
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
              quality={90}
              className="object-cover object-center"
              priority={index === 0}
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/90">
                {slide.description}
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-lg"
                  >
                    {tc('register')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">السابق</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">التالي</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">شريحة {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
