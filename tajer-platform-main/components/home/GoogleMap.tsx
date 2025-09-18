"use client"
import { useTranslations } from 'next-intl';
import { useEffect, useState } from "react";

export default function GoogleMap() {
  const t = useTranslations('home');
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className='w-full flex flex-col bg-muted/30 gap-4 justify-center p-6 rounded-md items-center'>
      <h2 className="text-3xl font-bold">{t('GoogleMapTitle')}</h2>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        {t('GoogleSupTitle')}
      </p>

      <div className='w-full flex items-center border-dark border-3'>
        <iframe
          className='rounded-md'
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3382.7887386321154!2d36.05271527563161!3d32.020835873988744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDAxJzE1LjAiTiAzNsKwMDMnMTkuMCJF!5e0!3m2!1sen!2seg!4v1758183537849!5m2!1sen!2seg"
          width="100%"
          height="400"
          style={{
            border: 0,
            filter: theme === "dark" ? "invert(90%) hue-rotate(180deg)" : "none"
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
