'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface BannersType {
  id: number;
  imageUrl: string;
  link: string;
  headline: string;
}

export default function Hero() {
  const [banners, setBanners] = useState<BannersType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const fetchBanners = async () => {
    try {
      const data = await fetch('https://tajer-backend.tajerplatform.workers.dev/api/admin/banners');
      const res = await data.json();
      setBanners(res || []);
      if(data.ok) {
        setLoading(false)
      }else{
        setLoading(true)
      }
    } catch (error) {
      console.error(error);
    } 
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide(prev => (prev === banners?.length - 1 ? 0 : prev + 1));
  }, [banners?.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(prev => (prev === 0 ? banners?.length - 1 : prev - 1));
  }, [banners?.length]);

  const handleManualNavigation = (navigationFunction: () => void) => {
    setAutoPlay(false);
    navigationFunction();
    
    setTimeout(() => {
      setAutoPlay(true);
    }, 10000);
  };

  useEffect(() => {
    if (!autoPlay || banners?.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, banners?.length, nextSlide]);

  return (
    <motion.div 
      dir='ltr' 
      className="relative overflow-hidden h-[50vh] lg:h-[70vh] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative h-full w-full">
        {loading ? (
          <div className="flex items-center h-full justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {banners?.map((slide, index) => (
              index === currentSlide && (
                <motion.div
                  key={slide.id}
                  custom={direction}
                  initial={{ 
                    x: direction > 0 ? '100%' : '-100%',
                    opacity: 1 
                  }}
                  animate={{ 
                    x: 0,
                    opacity: 1 
                  }}
                  exit={{ 
                    x: direction < 0 ? '100%' : '-100%',
                    opacity: 1 
                  }}
                  transition={{
                    x: { 
                      type: "tween" as const, 
                      ease: "easeInOut" as const,
                      duration: 0.4
                    },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Link href={slide.link}>
                    <div className="absolute inset-0 z-10" />
                    <Image
                      src={slide.imageUrl || '/placeholder.svg'}
                      alt={slide.headline || 'Banner image'}
                      fill
                      quality={100}
                      className="object-cover object-center"
                      priority={index === 0}
                    />
                  </Link>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        )}
      </div>
 
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 border rounded-full p-3 shadow-lg transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 cursor-pointer"
        onClick={() => handleManualNavigation(prevSlide)}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">السابق</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 border rounded-full p-3 shadow-lg transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 cursor-pointer"
        onClick={() => handleManualNavigation(nextSlide)}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">التالي</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 space-x-2">
        {banners?.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
            }`}
            onClick={() => {
              setAutoPlay(false);
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
              
              setTimeout(() => {
                setAutoPlay(true);
              }, 10000);
            }}
          >
            <span className="sr-only">شريحة {index + 1}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}