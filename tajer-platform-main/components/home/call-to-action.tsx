'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Smartphone } from 'lucide-react';

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
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="w-full py-12 lg:py-20 px-4 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-white/50"></div>
      <div className="absolute top-0 right-0 w-56 h-56 bg-blue-200 rounded-full -translate-y-28 translate-x-28 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200 rounded-full translate-y-24 -translate-x-24 opacity-30"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6">
          
          {/* Text Content */}
          <motion.div
            className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Smartphone className="w-3 h-3" />
              {language === 'ar' ? 'تطبيق تاجر' : 'Tajer App'}
            </motion.div>

            <motion.h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-snug"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {language === 'ar'
                ? callAction.callToActionAr || 'تطبيق تاجر بين يديك'
                : callAction.callToAction || 'Tajer App in Your Hands'}
            </motion.h2>

            <motion.p
              className="text-base md:text-lg text-gray-600 mb-6 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {language === 'ar' 
                ? 'حمّل تطبيق تاجر الآن وتمتع بتجربة تسوق فريدة مع أفضل العروض والمنتجات' 
                : 'Download the Tajer app now and enjoy a unique shopping experience with the best offers and products'
              }
            </motion.p>

            {/* App Store Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start w-full max-w-sm"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                href={callAction.androidAppLink || '#'}
                className="flex justify-center transition-transform hover:scale-105 duration-200"
              >
                <Image
                  src="/google.png"
                  alt="Google Play"
                  width={140}
                  height={45}
                  quality={100}
                  className="cursor-pointer object-contain hover:scale-105 transition-transform duration-200"
                />
              </Link>

              <Link
                href={callAction.iosAppLink || '#'}
                className="flex justify-center transition-transform hover:scale-105 duration-200"
              >
                <Image
                  src="/app.png"
                  alt="App Store"
                  width={140}
                  height={170}
                  quality={100}
                  className="cursor-pointer object-cover hover:scale-105 transition-transform duration-200"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Phone Image */}
          <motion.div
            className="relative w-full lg:w-1/2 flex items-center justify-center"
            initial={{ opacity: 0, x: 50, rotate: -5 }}
            whileInView={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full h-[350px] lg:h-[450px] max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-[50px] transform rotate-3 shadow-xl"></div>
              <Image
                src={callAction.appImageUrl || '/placeholder-phone.png'}
                alt={language === 'ar' ? 'تطبيق تاجر' : 'Tajer App'}
                fill
                className="object-cover object-center rounded-[40px] transform -rotate-3 shadow-lg"
                priority
                quality={100}
                sizes="(max-width: 768px) 70vw, (max-width: 1200px) 35vw, 30vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}