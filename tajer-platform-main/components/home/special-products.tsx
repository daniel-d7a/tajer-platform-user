"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface ProductType {
  id: string;
  name: string;
  isOnSale: boolean;
  packPrice: number;
  piecePrice: number;
  minOrderQuantity: number;
  unitType: string;
  product: {
    name: string;
    name_ar: string;
    imageUrl: string;
    category: string;
    manufacturer: string;
    piecePrice: number;
    piecesPerPack: number;
    discountType: string;
    unitType: string;
    id: number;
    discountAmount: number;
    packPrice: number;
    minOrderQuantity: number;
  };
}

interface ProductBase {
  name: string;
  name_ar: string;
  imageUrl: string;
  category: string;
  manufacturer: string;
  piecePrice: number;
  piecesPerPack: number;
  discountType: string;
  unitType: string;
  id: number;
  discountAmount: number;
  packPrice: number;
  minOrderQuantity: number;
}

// Custom hook for one-time animation
function useOneTimeAnimation<T extends HTMLElement = HTMLElement>(opts?: { threshold?: number }) {
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
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const visible = rect.top + rect.height * threshold < windowHeight && rect.bottom > 0;
        
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

function ProductCard({
  product,
  idx,
  language,
  t,
  tb,
  tc,
  router,
}: {
  product: ProductType;
  idx: number;
  language: string;
  t: (key: string) => string;
  tb: (key: string) => string;
  tc: (key: string) => string;
  router: ReturnType<typeof useRouter>;
}) {
  const [cardRef, inView] = useOneTimeAnimation<HTMLDivElement>({ threshold: 0.18 });

  const calculateDiscountedPrice = (offer: ProductBase, isPack: boolean = false) => {
    const originalPrice = isPack ? offer.packPrice : offer.piecePrice;
    if (offer.discountAmount <= 0) return originalPrice;
    if (offer.discountType === 'percentage') {
      return originalPrice * (1 - offer.discountAmount / 100);
    } else {
      return Math.max(0, originalPrice - offer.discountAmount);
    }
  };

  return (
    <div

      ref={cardRef}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(60px)",
        transition: inView 
          ? "opacity 0.7s cubic-bezier(.4,.2,0,1), transform 0.7s cubic-bezier(.4,.2,0,1)" 
          : "none",
        transitionDelay: inView ? `${idx * 0.08}s` : "0s",
        willChange: inView ? "opacity, transform" : "auto",
      }}
      className="w-full h-full flex-shrink-0"
    >
      <Link className="w-full h-full block" href={`/products/${product.product.id}`}>
        <Card className="overflow-hidden flex flex-col h-full rounded-2xl duration-300 transition-transform border-2 hover:border-primary/30">
          <div className="relative pt-[100%]">
            {product.product.discountAmount > 0 && (
              <Badge className="absolute top-2 right-2 bg-primary z-10">
                {product.product.discountType === 'percentage' 
                  ? `${product.product.discountAmount}% ${t('offer')}` 
                  : `${product.product.discountAmount} ${tc('coins')} ${t('offer')}`}
              </Badge> 
            )}
            <Image
              src={product.product.imageUrl || "/placeholder.svg"}
              alt={product.product.name}
              fill
              className="object-cover absolute top-0 left-0"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <CardContent className="p-4 flex-grow">
            <div className="text-sm text-muted-foreground mb-1"></div>
            <h3 className="font-semibold mb-1 line-clamp-2 text-lg truncate w-full">
              {language === 'en' ? product.product.name : product.product.name_ar}
            </h3>
            <div className="flex items-baseline mt-2">
              {product.product.unitType === "pack_only" || product.product.unitType === "piece_or_pack" ? (
                <div className="flex gap-2 flex-col w-full">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 w-full">
                      {product.product.discountAmount > 0 ? (
                        <div className="flex gap-2">
                          <span className="text-lg font-bold text-primary">
                            {calculateDiscountedPrice(product.product, false).toFixed(2)} {tc('coins')}
                          </span>
                          <span className="line-through text-muted-foreground text-sm">
                            {product.product.piecePrice.toFixed(2)} {tc('coins')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {product.product.piecePrice.toFixed(2)} {tc('coins')}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        / {language === 'en' ? "piece" : "قطعة"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-md w-[100%] mr-2 font-medium">
                      {t('PackPrice')}: {calculateDiscountedPrice(product.product, true).toFixed(2)} {tc('coins')}
                      {product.product.discountAmount > 0 && (
                        <span className="line-through text-muted-foreground text-sm ml-2">
                          {product.product.packPrice.toFixed(2)} {tc('coins')}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t('piecesPerPack')}: {product.product.piecesPerPack} / {language === 'en' ? "pieces" : "قطع في الحزمه"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  {product.product.discountAmount > 0 ? (
                    <div className="flex gap-2 w-full">
                      <span className="text-lg font-bold text-primary">
                        {calculateDiscountedPrice(product.product).toFixed(2)} {tc('coins')}
                      </span>
                      <span className="line-through text-muted-foreground text-sm">
                        {product.product.piecePrice.toFixed(2)} {tc('coins')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {product.product.piecePrice.toFixed(2)} {tc('coins')}
                    </span>
                  )}
                </div>
              )}
            </div>
            
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              variant="outline"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/products/${product.product.id}`);
              }}
            >
              <ShoppingCart className="h-4 w-4 ml-2" />
              {tb('viewProducts')}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}

function SkeletonCard({ idx }: { idx: number }) {
  return (
    <Card key={idx} className="animate-pulse h-full flex-shrink-0">
      <div className="relative pt-[100%]">
        <Skeleton className="absolute top-0 left-0 w-full h-full" />
      </div>
      <CardContent className="p-4 flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function SpecialProducts() {
  const t = useTranslations("specialProducts");
  const tb = useTranslations("buttons");
  const tc = useTranslations("common");
  const router = useRouter();
  const [Products, setProducts] = useState<ProductType[] | null>(null);
  const [loading, SetLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const pathname = usePathname();

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

  const cardsPerSlide = 4;
  const totalSlides = Products ? Math.ceil(Products.length / cardsPerSlide) : 0;
  
  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const slideGroups = [];
  if (Products) {
    for (let i = 0; i < Products.length; i += cardsPerSlide) {
      slideGroups.push(Products.slice(i, i + cardsPerSlide));
    }
  }

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
          {Products && Products.length > cardsPerSlide && (
            <>
              <button
                onClick={prevSlide}
                disabled={!canGoPrev}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 border rounded-full p-2 shadow-lg transition-all duration-300 ${
                  canGoPrev 
                    ? "bg-background/80 hover:bg-background hover:scale-110 cursor-pointer" 
                    : "bg-muted/50 cursor-not-allowed opacity-50"
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                disabled={!canGoNext}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 border rounded-full p-2 shadow-lg transition-all duration-300 ${
                  canGoNext 
                    ? "bg-background/80 hover:bg-background hover:scale-110 cursor-pointer" 
                    : "bg-muted/50 cursor-not-allowed opacity-50"
                }`}
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slideGroups.map((slideGroup, groupIndex) => (
                <div
                  key={groupIndex}
                  className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2"
                >
                  {loading ? (
                    Array.from({ length: 4 }, (_, idx) => (
                      <SkeletonCard key={idx} idx={idx} />
                    ))
                  ) : slideGroup.length > 0 ? (
                    slideGroup.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        idx={idx}
                        language={language}
                        t={t}
                        tb={tb}
                        tc={tc}
                        router={router}
                      />
                    ))
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? "bg-primary scale-105" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
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
};