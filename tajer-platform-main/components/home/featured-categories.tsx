"use client";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Custom hook for one-time animation
function useOneTimeAnimation<T extends HTMLElement = HTMLElement>(opts?: {
  threshold?: number;
}) {
  const ref = useRef<T | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    let ticking = false;
    const threshold = opts?.threshold ?? 0.18;

    function handleScroll() {
      if (ticking || hasAnimated) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const visible =
          rect.top + rect.height * threshold < windowHeight && rect.bottom > 0;

        if (visible && !hasAnimated) {
          setInView(true);
          setHasAnimated(true);
        }
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
  }, [opts?.threshold, hasAnimated]);

  return [ref, inView] as const;
}

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  count: number;
  name_ar: string;
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
  const [cardRef, inView] = useOneTimeAnimation<HTMLDivElement>({
    threshold: 0.16,
  });

  return (
    <div
      ref={cardRef}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(60px)",
        transition: inView
          ? "opacity 0.75s cubic-bezier(.4,.2,0,1), transform 0.75s cubic-bezier(.4,.2,0,1)"
          : "none",
        transitionDelay: inView ? `${idx * 0.09}s` : "0s",
        willChange: inView ? "opacity, transform" : "auto",
      }}
      className="w-full flex-shrink-0"
    >
      <Link href={`/categories/${category.id}`} className="block w-full">
        <div className="relative w-full h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-500">
          <Image
            src={category.imageUrl || "/coffee.jpg"}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div className="transform group-hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg mb-2">
                {language === "en" ? category.name : category.name_ar}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function FeaturedCategories() {
  const t = useTranslations("home");
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0];
    setLanguage(lang);
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://tajer-backend.tajerplatform.workers.dev/api/public/categories?limit=&page="
        );
        const res: { data: Category[] } = await response.json();
        setData(res.data);
        setLoading(!response.ok);
      } catch {
        setLoading(true);
      }
    };
    fetchData();
  }, []);

  const cardsPerSlide = 1;
  const totalSlides = Math.ceil(data.length / cardsPerSlide);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleManualNavigation = (navigationFunction: () => void) => {
    setAutoPlay(false);
    navigationFunction();

    setTimeout(() => {
      setAutoPlay(true);
    }, 10000);
  };

  useEffect(() => {
    if (!autoPlay || data.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, data.length, nextSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 1,
    }),
  };

  const dotVariants = {
    inactive: {
      scale: 1,
    },
    active: {
      scale: 1.2,
    },
  };

  const slideGroups = [];
  for (let i = 0; i < data.length; i += cardsPerSlide) {
    slideGroups.push(data.slice(i, i + cardsPerSlide));
  }

  return (
    <section
      dir="ltr"
      className="py-12 bg-gradient-to-b from-background to-muted/20 overflow-hidden"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold ">
          {t("featuredCategories")}
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("featuredCategoriesDesc")}
        </p>
      </div>

      <div className="relative w-full">
        {data.length > cardsPerSlide && (
          <>
            <button
              onClick={() => handleManualNavigation(prevSlide)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 border rounded-full p-3 shadow-lg transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => handleManualNavigation(nextSlide)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 border rounded-full p-3 shadow-lg transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div className="overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: {
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.4,
                },
              }}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                slideGroups[currentSlide]?.map((category, idx) => (
                  <AnimatedCategoryCard
                    key={category.id}
                    category={category}
                    language={language}
                    idx={idx}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 gap-3">
            {Array.from({ length: totalSlides }, (_, index) => (
              <motion.button
                key={index}
                variants={dotVariants}
                initial="inactive"
                animate={index === currentSlide ? "active" : "inactive"}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary scale-110"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                onClick={() => {
                  setAutoPlay(false);
                  setDirection(index > currentSlide ? 1 : -1);
                  setCurrentSlide(index);

                  setTimeout(() => {
                    setAutoPlay(true);
                  }, 10000);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
