'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Boxes } from 'lucide-react';
import { useTranslations } from 'next-intl';
interface BannersType {
  id: number;
  imageUrl: string;
  link: string;
  headline: string;
}

export default function Hero() {
  const tc = useTranslations('header');
  const [banners,setBanners] = useState<BannersType[]>([])
  const [loading,setLoading] = useState<boolean>(true)
  const fetchBanners =  async () =>{
    try{
      const data = await fetch('https://tajer-backend.tajerplatform.workers.dev/api/admin/banners');
      const res = await data.json();
      setBanners(res || []);
    }catch (error) {
      console.error(error);
    }finally{
      setLoading(false);
    };
  }
  useEffect(() => {
      fetchBanners();
  },[])

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === banners?.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners?.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === banners?.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? banners?.length - 1 : prev - 1));
  };

  return (
    <div className="relative overflow-hidden rounded-lg w-[95%] mx-auto ">
      <div className="relative h-[400px] md:h-[500px]">
        {loading ? (
             <div className="col-span-5 flex items-center h-full justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
        banners?.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity  duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0   z-10" />
            <Image
              src={slide.imageUrl || '/placeholder.svg'}
              alt={slide.headline}
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
              quality={80}
              className="object-cover object-center"
              priority={index === 0}
            />
           
          </div>
        ))
        )}
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
        {banners?.map((_, index) => (
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
};