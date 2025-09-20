'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CallToAction() {
  const t = useTranslations('home');
  
  return (
    <section className="py-16 bg-secondary/10 rounded-lg text-center m-5 flex flex-col md:flex-row items-center gap-8 md:gap-12 p-6">
      {/* صورة الهاتف */}
      <motion.div 
        className='relative w-full md:w-1/2 h-80 md:h-96 rounded-md overflow-hidden'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image 
          src='/tajerMobile.jpeg'
          alt='تطبيق تاجر على الهاتف'
          fill
          className='object-cover rounded-lg'
          priority
        />
      </motion.div>

      <motion.div 
        className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          {t('joinTajer')}
        </h2>
        
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          {t('joinTajerDesc')}
        </p>
        
        <motion.div 
          className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              {t('joinAsTajer')}
            </Button>
          </Link>
          
          <Link href="/about" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full border-primary text-primary bg- hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {t('getToKnowUs')}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}