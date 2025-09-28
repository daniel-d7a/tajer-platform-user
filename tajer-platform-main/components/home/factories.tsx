"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

interface Factory {
  id: number;
  name: string;
  name_ar: string;
  discountAmount: number;
  discountType: string | null;
  imageUrl: string | null;
  image_public_id: string | null;
}

export default function Factories() {
  const [loading, setLoading] = useState(true);
  const [factories, setFactories] = useState<Factory[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('factories');
  const pathname = usePathname();

  const locale = pathname.split("/")[1] || "en";
  const isRTL = locale === "ar";

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const response = await fetch(
          'https://tajer-backend.tajerplatform.workers.dev/api/admin/factories/all_factories'
        );
        const data = await response.json();
        setFactories(data || []);
        if(response.ok){
          setLoading(false)
        }else{
          setLoading(true)
        }
      } catch (error) {
        console.error('Error fetching factories:', error);
        toast.error('something went wron please try again')
      }
    };
    fetchFactories();
  }, []);

  const duplicatedFactories = [...factories, ...factories, ...factories];

  useEffect(() => {
    if (!scrollRef.current || factories.length === 0) return;

    const scrollContainer = scrollRef.current;
    let animationFrameId: number;
    const scrollSpeed = 1;

    const animateScroll = () => {
      if (scrollContainer) {
        if (isRTL) {
          scrollContainer.scrollLeft -= scrollSpeed;
          if (scrollContainer.scrollLeft <= 0) {
            scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
          }
        } else {
          scrollContainer.scrollLeft += scrollSpeed;
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
            scrollContainer.scrollLeft = 0;
          }
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animateScroll();

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleMouseLeave = () => {
      animateScroll();
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [factories.length, isRTL, pathname]);

  return (
    <section className="py-12" dir='ltr'>
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">{t('title')}</h2>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto hide-scrollbar gap-6 px-4 py-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {duplicatedFactories.map((factory, index) => (
                <Link 
                  key={`${factory.id}-${index}`} 
                  href={`/companies/${factory.id}`}
                  passHref
                >
                  <motion.div
                    className="flex-shrink-0 opacity-70 hover:opacity-100 hover:border-primary hover:border-1 rounded-lg  flex items-center justify-center p-2 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3 }}
                  >
                    {factory.imageUrl ? (
                      <div className="relative w-32 min-w-20 h-20">
                        <Image
                          src={factory.imageUrl}
                          alt={factory.name_ar || factory.name}
                          fill
                          quality={100}
                          sizes="80px"
                          className="object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <Truck size={48} className="text-muted-foreground opacity-50" />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
        )}
      </motion.div>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}