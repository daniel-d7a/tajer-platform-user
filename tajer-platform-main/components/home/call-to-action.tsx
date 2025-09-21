'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CallToAction() {
  const t = useTranslations('home');
  const [language, setLanguage] = useState('en');
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [callAction, setCallAction] = useState({
    appImageUrl: '',
    callToActionAr: '',
    callToAction: '',
    androidAppLink: '',
    iosAppLink: '',
  });

  const fetchCallAction = async () => {
    try {
      const data = await fetch('https://tajer-backend.tajerplatform.workers.dev/api/admin/settings', { credentials: 'include' });
      const res = await data.json();
      setCallAction(res);
    } catch (error) {
      console.error('Error fetching call to action data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallAction();
  }, []);

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || 'en';
    setLanguage(lang);
  }, [pathname]);

  if (loading) {
    return (
   <div className="col-span-5 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
    );
  }

  return (
    <section className="py-16 bg-secondary/10 rounded-lg text-center m-5 flex flex-col md:flex-row items-center gap-8 md:gap-12 p-6">
      <motion.div 
        className='relative w-full md:w-1/2 h-80 md:h-96 rounded-md overflow-hidden'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image 
          src={callAction.appImageUrl || '/placeholder-image.jpg'}
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
          {language === 'ar' ? callAction.callToActionAr : callAction.callToAction}
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
          <Link href={callAction.androidAppLink}className="w-full sm:w-auto flex justify-center">
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 transform flex items-center gap-2"
            >
              <Image 
                src="/googleplay.png"
                alt="google play"
                width={20}
                height={20}
              />
              حمل تطبيق تاجر   
            </Button>
          </Link>
          
          <Link href={callAction.iosAppLink} className="w-full sm:w-auto flex justify-center">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center gap-2"
            >
              <Image 
                src="/apple.png"
                alt="app store"
                width={40}
                height={40}
              />
              حمل تطبيق تاجر   
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}