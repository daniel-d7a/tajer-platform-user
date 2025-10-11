'use client';
import Link from 'next/link';
import Image from 'next/image';
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
      if (data.ok) setLoading(false);
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
    <section className="relative w-full overflow-visible bg-[#C9F4DE] mt-30">
      <div
        className="
          max-w-6xl mx-auto flex flex-col lg:flex-row
          items-center justify-between gap-8  lg:px-10 relative
        "
      >
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-2/5 min-h-[60%]">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {language === 'ar'
              ? callAction.callToActionAr || 'نفتح آفاق جديدة لتجارتك'
              : callAction.callToAction || 'Opening new horizons for your business'}
          </h2>
          <p className="text-gray-700 mb-6 max-w-md">
            {language === 'ar'
              ? 'نفتح آفاق جديدة لتجارتك'
              : 'Opening new horizons for your business'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link
              href={callAction.iosAppLink || '#'}
              className="flex hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/app-store.svg"
                alt="App Store"
                width={140}
                height={42}
                quality={100}
              />
            </Link>
            <Link
              href={callAction.androidAppLink || '#'}
              className="flex scale-110 hover:scale-115 transition-transform duration-300"
            >
              <Image
                src="/google-play.svg"
                alt="Google Play"
                width={140}
                height={170}
                className="object-cover"
                quality={100}
              />
            </Link>
          </div>
        </div>

        <div className="relative w-full lg:w-3/5 flex justify-start lg:justify-end overflow-visible lg:mb-0">
          <div className="relative w-72 h-[400px] lg:w-[420px] lg:h-[400px]  lg:-mt-24">
            <Image
              src={callAction.appImageUrl || '/placeholder-phone.png'}
              alt={language === 'ar' ? 'تطبيق تاجر' : 'Tajer App'}
              fill
              className="object-cover lg:object-contain object-center drop-shadow-2xl"
              priority
              quality={100}
              sizes="(max-width: 768px) 70vw, (max-width: 1200px) 40vw, 35vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
