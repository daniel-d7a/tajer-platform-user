'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CallToAction() {
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
      const data = await fetch(
        'https://tajer-backend.tajerplatform.workers.dev/api/admin/settings',
        { credentials: 'include' }
      );
      const res = await data.json();
      setCallAction(res);
      if (data.ok) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error('Error fetching call to action data:', error);
    }
  };

  useEffect(() => {
    fetchCallAction();
  }, []);

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const lang = segments[0] || 'en';
    setLanguage(lang);
  }, [pathname]);

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="w-full py-12 lg:py-16 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        
      <motion.div
  className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2"
  initial={{ opacity: 0, x: -30 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  viewport={{ once: true }}
>
  <motion.h2
    className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4 leading-snug"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    viewport={{ once: true }}
  >
    {language === 'ar'
      ? callAction.callToActionAr
      : callAction.callToAction}
  </motion.h2>

  <motion.p
    className="text-lg md:text-xl text-gray-600 mb-4 lg:mb-6 max-w-md leading-relaxed"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    viewport={{ once: true }}
  >
    {language === 'ar' 
      ? 'انضم إلى منصة تاجر اليوم' 
      : 'Join to the Tajer platform today'
    }
  </motion.p>

  <motion.div
    className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start w-full max-w-sm"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    viewport={{ once: true }}
  >
    <Link
      href={callAction.androidAppLink}
      className="flex justify-center"
    >
      <Image
        src="/google.png"
        alt="google play"
        width={130}
        height={40}
        quality={100}
        className="cursor-pointer object-contain hover:scale-105 transition-transform duration-200"
      />
    </Link>

    <Link
      href={callAction.iosAppLink}
      className="flex justify-center"
    >
      <Image
        src="/app.png"
        alt="app store"
        width={130}
        height={40}
        quality={100}
        className="cursor-pointer hover:scale-105 transition-transform duration-200"
      />
    </Link>
  </motion.div>
</motion.div>

        <motion.div
          className="relative w-full lg:w-1/2 flex items-center justify-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full h-[300px] lg:h-[400px] xl:h-[450px]">
            <Image
              src={callAction.appImageUrl || '/placeholder-image.jpg'}
              alt="تطبيق تاجر"
              fill
              className="object-contain object-center"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}