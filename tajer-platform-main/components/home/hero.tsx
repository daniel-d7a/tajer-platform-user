'use client';
import { useState, useEffect } from 'react';
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide(prev => (prev === banners?.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners?.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide(prev => (prev === banners?.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide(prev => (prev === 0 ? banners?.length - 1 : prev - 1));
  };

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: () => ({
    x:  0,
    opacity: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 }
    }
  }),
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 }
    }
  })
};
  const dotVariants = {
    inactive: {
      scale: 1,
      opacity: 0.5,
      transition: { duration: 0.2 }
    },
    active: {
      scale: 1.2,
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="relative overflow-hidden  w-full">
      <div className="relative h-[400px] md:h-[550px]">
        {loading ? (
          <div className="flex items-center  h-full justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {banners?.map((slide, index) => (
              index === currentSlide && (
                <motion.div
                  key={slide.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
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

      <motion.div
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">السابق</span>
        </Button>
      </motion.div>
      <motion.div
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">التالي</span>
        </Button>
      </motion.div>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 space-x-2">
        {banners?.map((_, index) => (
          <motion.button
            key={index}
            variants={dotVariants}
            initial="inactive"
            animate={index === currentSlide ? "active" : "inactive"}
            className={`h-2 w-2 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
          >
            <span className="sr-only">شريحة {index + 1}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};