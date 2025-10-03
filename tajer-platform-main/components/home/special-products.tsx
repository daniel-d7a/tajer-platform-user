"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import {  ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import ProductCard from "../common/CommonCard";
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

  const getCardsPerSlide = () => {
    if (typeof window === 'undefined') return 4;
    return window.innerWidth < 768 ? 1 : 4;
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

  const totalSlides = Products ? Math.ceil(Products.length / cardsPerSlide) : 0;
  
  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentSlide(prev => prev + 1);
    };
  };
  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentSlide(prev => prev - 1);
    };
  };
  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };
  const slideGroups = [];
  if (Products) {
    for (let i = 0; i < Products.length; i += cardsPerSlide) {
      slideGroups.push(Products.slice(i, i + cardsPerSlide));
    };
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
                    Array.from({ length: cardsPerSlide }, (_, idx) => (
                      <SkeletonCard key={idx} idx={idx} />
                    ))
                  ) : slideGroup.length > 0 ? (
                    slideGroup.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        idx={idx}
                        language={language}
                        type="product"
                        t={t}
                        tb={tb}
                        tc={tc}
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