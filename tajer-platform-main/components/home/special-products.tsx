"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import ProductCard from "../common/CommonCard";
import { AnimatePresence, motion } from "framer-motion";

interface ProductBase {
  id: number;
  barcode: string | null;
  name: string;
  name_ar: string;
  description: string | null;
  description_ar: string | null;
  unitType: "piece_only" | "pack_only" | "piece_and_pack" | string;
  piecePrice: number | null;
  packPrice: number | null;
  piecesPerPack: number | null;
  factoryId: number;
  imageUrl: string | null;
  image_public_id: string | null;
  minOrderQuantity: number | null;
  discountAmount: number | null;
  discountType: "percentage" | "fixed_amount" | string | null;
}

export default function SpecialProducts() {
  const t = useTranslations("specialProducts");
  const tb = useTranslations("buttons");
  const tc = useTranslations("common");
  const [Products, setProducts] = useState<ProductBase[] | null>(null); 
  const [loading, SetLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const pathname = usePathname();
  console.log(autoPlay)
  
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0]; 
    setLanguage(lang)
  }, [pathname]);

  const fetchSpecialProducts = async () => {
    try {
      const data = await fetch(
        "https://tajer-backend.tajerplatform.workers.dev/api/featured/featured-products"
      );
      const res = await data.json();
      setProducts(res);
      if(!data.ok){
        SetLoading(true)
      }else{
        SetLoading(false)
      }
    } catch {
      setProducts(null);
      SetLoading(false);
    };
  };

  useEffect(() => {
    fetchSpecialProducts();
  }, []);

  const getCardsPerSlide = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 4;
  };

  const [cardsPerSlide, setCardsPerSlide] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerSlide(getCardsPerSlide());
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // إنشاء الشرائح بنظام أبسط
  const createSlideGroups = () => {
    if (!Products || Products.length === 0) return [];
    if (Products.length <= cardsPerSlide) return [Products];

    const groups = [];
    const step = 3; 
    
    for (let i = 0; i < Products.length; i += step) {
      const group = [];
      
      for (let j = 0; j < cardsPerSlide; j++) {
        const index = (i + j) % Products.length;
        group.push(Products[index]);
      }
      
      groups.push(group);
      
      if (groups.length * step >= Products.length + step) {
        break;
      }
    }
    
    return groups;
  };

  const slideGroups = createSlideGroups();
  const totalSlides = slideGroups.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleManualNavigation = (navigationFunction: () => void) => {
    setAutoPlay(false);
    navigationFunction();
    setTimeout(() => setAutoPlay(true), 10000);
  };


  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1,
    })
  };

  const dotVariants = {
    inactive: {
      scale: 1,
      opacity: 0.5,
    },
    active: {
      scale: 1.2,
      opacity: 1,
    }
  };

  const goToSlide = (slideIndex: number) => {
    setAutoPlay(false);
    setDirection(slideIndex > currentSlide ? 1 : -1);
    setCurrentSlide(slideIndex);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <section dir='ltr' className="py-12 bg-muted/30 rounded-lg">
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">{t('title')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('subTitle')}
          </p>
        </div>
        <div className="relative w-[95%] mx-auto">
          {slideGroups.length > 1 && (
            <>
              <button
                onClick={() => handleManualNavigation(prevSlide)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-30 border rounded-full p-2 shadow-lg transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleManualNavigation(nextSlide)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-30 border rounded-full p-2 shadow-lg transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          
          <div className="overflow-hidden rounded-xl relative h-[550px] md:h-[550px] lg:h-[550px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                {slideGroups.map((slideGroup, groupIndex) => (
                  groupIndex === currentSlide && (
                    <motion.div
                      key={groupIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { 
                          type: "tween", 
                          ease: "easeInOut",
                          duration: 0.4 
                        }
                      }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <div className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                        {slideGroup.map((product, idx) => (
                          <ProductCard
                            key={`${product.id}-${groupIndex}-${idx}`}
                            product={product} 
                            idx={idx}
                            language={language}
                            type="product"
                            t={t}
                            tb={tb}
                            tc={tc}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            )}
          </div>

          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <motion.button
                  key={index}
                  variants={dotVariants}
                  initial="inactive"
                  animate={index === currentSlide ? "active" : "inactive"}
                  className={`h-3 w-3 rounded-full ${
                    index === currentSlide
                      ? "bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="text-center mt-8">
          <Link href="/special-products">
            <Badge
              variant="outline"
              className="text-base py-2 px-6 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors border-primary"
            >
              {tb('featuredProducts')}
            </Badge>
          </Link>
        </div>
      </div>
    </section>
  );
}