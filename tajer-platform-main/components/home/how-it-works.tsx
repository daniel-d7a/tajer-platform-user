'use client';

import { CheckCircle, ShoppingCart, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Factory {
  id: number;
  name: string;
  name_ar: string;
  discountAmount: number;
  discountType: string | null;
  imageUrl: string | null;
  image_public_id: string | null;
}

export default function HowItWorks() {
  const t = useTranslations('home');
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const response = await fetch(
          'https://tajer-backend.tajerplatform.workers.dev/api/admin/factories?page=1&limit=20&search='
        );
        const data = await response.json();
        setFactories(data.data || []);
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

  const steps = [
    {
      id: 1,
      title: t('step1Title'),
      description: t('step1Desc'),
      icon: CheckCircle,
    },
    {
      id: 2,
      title: t('step2Title'),
      description: t('step2Desc'),
      icon: ShoppingCart,
    },
    {
      id: 3,
      title: t('step3Title'),
      description: t('step3Desc'),
      icon: Truck,
    },
  ];

  return (
    <section className="py-12">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold">{t('howItWorks')}</h2>
        <p className="mt-2 text-muted-foreground">{t('howItWorksDesc')}</p>
      </motion.div>

      <motion.div 
        className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        {steps.map(step => (
          <motion.div 
            key={step.id} 
            className="text-center mx-auto w-[70%]"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5 }}
          >
            <motion.div 
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 3 }}
            >
              <step.icon className="h-8 w-8 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 3 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">شعارات المصانع</h2>
          <p className="mt-2 text-muted-foreground">شعارات شركائنا من المصانع</p>
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
                <Link key={`${factory.id}-${index}`} href={`/companies/${factory.id}`}>
                <motion.div
                  
                  className="flex-shrink-0 w-32 h-32 bg-card rounded-xl shadow-lg border flex items-center justify-center p-4"
                  whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  {factory.imageUrl ? (
                    <Image
                      src={factory.imageUrl}
                      alt={factory.name_ar || factory.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
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
        
        @keyframes infiniteScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}