"use client"
import Image from 'next/image';
import HowItWorks from '@/components/home/how-it-works';
import {useTranslations} from 'next-intl';
import { usePathname } from "next/navigation";
import { useState,useEffect } from 'react';
export default function About() {
  const t = useTranslations('about')
    const [language,setLanguage] = useState('en')
      const pathname = usePathname();
          useEffect(() => {
          const segments = pathname.split("/").filter(Boolean);
          const lang = segments[0]; 
          setLanguage(lang)
        }, [pathname]);
  return (
    <div dir= {language === 'ar' ? 'rtl' :'ltr'} className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-12">
        <div className="flex justify-center w-full ">
          <div className="relative w-full h-64  md:h-80  lg:h-96 rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="/tajer.webp" 
              alt="Tajer Platform" 
              className="object-cover"
              fill
              priority
            />
          </div>
        </div>
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              <strong className='text-primary'>{t('strongs.tajer')}</strong>  {t('subtitle')}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('mission')} <strong className='text-primary'>{t('strongs.B2B')}</strong> {t('byconnect')}
            </p>
          </div>
          <div className='space-y-4 text-left'>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('focus')} <strong className='text-primary'>{t('strongs.innovation')}</strong>, <strong className='text-primary'>{t('strongs.tajer')} </strong> {t('provides')}
              </p>
            <ul className="list-disc list-inside space-y-2">
              <li className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t('li1')}</li>
              <li className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t('li2')}</li>
              <li className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t('li3')}</li>
              <li className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t('li4')}</li>
            </ul>
          </div>
          <HowItWorks/>
          <div className='space-y-4 text-center'>
              <p  className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('found')} <strong className='text-primary'>{t('strongs.leading')}</strong>  {t('stand')}
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};