"use client"

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('factories')
  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const response = await fetch(
          'https://tajer-backend.tajerplatform.workers.dev/api/admin/factories/all_factories'
        );
        const data = await response.json();
        setFactories(data || []);
      } catch (error) {
        console.error('Error fetching factories:', error);
      } finally {
        setLoading(false);
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
        scrollContainer.scrollLeft += scrollSpeed;
        
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
          scrollContainer.scrollLeft = 0;
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
  }, [factories.length]);

  return (
    <section className="py-12">
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
                    className="flex-shrink-0  opacity-70 hover:opacity-100 hover:border-primary border-1 rounded-lg  shadow-lg  flex items-center justify-center p-2 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3 }}
                  >

                    {factory.imageUrl ? (
                      <div className="relative w-20 h-20">

                       <Image
                          src={factory.imageUrl}
                          alt={factory.name_ar || factory.name}
                          fill
                          sizes="80px"
                          className="object-contain"
                          onError={(e) => {
                            // Fallback في حالة وجود خطأ في تحميل الصورة
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
};