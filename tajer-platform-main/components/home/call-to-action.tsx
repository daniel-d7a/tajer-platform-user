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
      const data = await fetch(
        'https://tajer-backend.tajerplatform.workers.dev/api/admin/settings',
        { credentials: 'include' }
      );
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
    const segments = pathname.split('/').filter(Boolean);
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
    <section className="relative w-full h-screen flex items-start justify-center mb-5 rounded-lg p-4 overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Image
          src={callAction.appImageUrl || '/placeholder-image.jpg'}
          alt="خلفية التطبيق"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0"></div>
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center text-background px-6 mt-20"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          {language === 'ar'
            ? callAction.callToActionAr
            : callAction.callToAction}
        </h2>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link href={callAction.androidAppLink} className="flex justify-start">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Image
                src="/googleplay.png"
                alt="google play"
                className="rounded-md"
                width={20}
                height={20}
              />
              {t('DownloadTajer')}
            </Button>
          </Link>

          <Link href={callAction.iosAppLink} className="flex justify-start">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary bg-gray/90 hover:bg-primary hover:text-primary-foreground flex items-center gap-2"
            >
              <Image src="/apple.png" alt="app store" width={30} height={30} />
              {t('DownloadTajer')}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}