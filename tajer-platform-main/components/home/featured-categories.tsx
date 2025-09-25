"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from "next/navigation";

// hook inView زي ما هو

function useInView<T extends HTMLElement = HTMLElement>(opts?: { threshold?: number }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let ticking = false;
    const threshold = opts?.threshold ?? 0.18;

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
  }, [opts?.threshold]);

  return [ref, inView] as const;
}

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  count: number;
  name_ar: string ;
}

function AnimatedCategoryCard({
  category,
  language,
  idx,
}: {
  category: Category;
  language: string;
  idx: number;
}) {
  const [cardRef, inView] = useInView<HTMLDivElement>({ threshold: 0.16 });

  return (
    <Link key={category.id} href={`/categories/${category.id}`} className="block">
      <div
        ref={cardRef}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0px)" : "translateY(60px)",
          transition: "opacity 0.75s cubic-bezier(.4,.2,0,1), transform 0.75s cubic-bezier(.4,.2,0,1)",
          transitionDelay: inView ? `${idx * 0.09}s` : "0s",
          willChange: "opacity, transform",
        }}
        className="w-full"
      >
        <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-2xl shadow-lg group">
          <Image
            src={category.imageUrl || '/coffee.jpg'}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md group-hover:scale-105 transition-transform duration-300">
              {language === 'en' ? category.name : category.name_ar}
            </h3>
          </div>
        </div>
      </div>
    </Link> 
  );
}

export default function FeaturedCategories() {
  const t = useTranslations('home');
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const pathname = usePathname();
  
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0]; 
    setLanguage(lang)
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://tajer-backend.tajerplatform.workers.dev/api/public/categories?limit=&page='
        );
        const res: { data: Category[] } = await response.json();
        setData(res.data);
        setLoading(!response.ok)
      } catch {
        setLoading(true)
      } 
    };
    fetchData();
  }, []);

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t('featuredCategories')}</h2>
        <p className="mt-2 text-muted-foreground">
          {t('featuredCategoriesDesc')}
        </p>
      </div>
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto px-2">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          data.slice(0, 5).map((category, idx) => (
            <AnimatedCategoryCard
              key={category.id}
              category={category}
              language={language}
              idx={idx}
            />
          ))
        )}
      </div>
    </section>
  );
};