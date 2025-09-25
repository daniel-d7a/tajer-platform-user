'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Custom hook for scroll in-view animation
function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const visible = rect.top + rect.height * threshold < windowHeight && rect.bottom > 0;
        setInView(visible);
        ticking = false;
      });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [threshold]);

  return [ref, inView] as const;
}

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

  const [sectionRef, sectionInView] = useInView<HTMLDivElement>(0.18);

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
      <div className="col-span-5 flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative rounded-lg m-5 overflow-hidden max-w-5xl mx-auto shadow-2xl"
      style={{
        opacity: sectionInView ? 1 : 0,
        transform: sectionInView ? "translateY(0px)" : "translateY(80px)",
        transition: "opacity 1s cubic-bezier(.4,.2,0,1), transform 1s cubic-bezier(.4,.2,0,1)",
        willChange: "opacity, transform",
      }}
    >
      <div className="relative w-full h-[380px] md:h-[480px]">
        <Image
          src={callAction.appImageUrl || '/placeholder-image.jpg'}
          alt='تطبيق تاجر على الهاتف'
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-0 right-0 left-0 flex flex-col items-end md:items-end p-8 md:p-12">
          <div className="max-w-lg w-full bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg flex flex-col items-end">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 text-right drop-shadow">
              {language === 'ar' ? callAction.callToActionAr : callAction.callToAction}
            </h2>
            <p className="text-md md:text-lg text-muted-foreground mb-6 text-right">
              {t('joinTajerDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-end">
              <Link href={callAction.androidAppLink || '#'} className="w-full sm:w-auto flex justify-end">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
                >
                  <Image
                    src="/googleplay.png"
                    alt="google play"
                    width={24}
                    height={24}
                    className="brightness-0 invert"
                  />
                  <span className="font-semibold">{t('DownloadTajer')}</span>
                </Button>
              </Link>
              <Link href={callAction.iosAppLink || '#'} className="w-full sm:w-auto flex justify-end">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-primary text-primary bg-background/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center gap-2"
                >
                  <Image
                    src="/apple.png"
                    alt="app store"
                    width={24}
                    height={24}
                  />
                  <span className="font-semibold">{t('DownloadTajer')}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}