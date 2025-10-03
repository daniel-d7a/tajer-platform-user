"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import ProductCard from "../common/CommonCard";
import ImageUpScale from "../ImageUpScale";
type Offer = { 
  id: number;
  name: string;
  name_ar: string;
  description: string;
  imageUrl: string;
  expiresAt: string;
  discountType: string;
  discountAmount: number;
  piecePrice: number;
  packPrice: number;
  piecesPerPack: number;
  unitType: string;
  minOrderQuantity: number;
  factory: {
    name: string;
    name_ar: string;
  };
};


interface ProductType  {
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
    </Card>
  );
}

export default function SpecialOffers() {
   const t = useTranslations("specialProducts");
  const tb = useTranslations("buttons");
  const tc = useTranslations("common");
  const th = useTranslations('home')
  const [offersData, setOffersData] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [language, setLanguage] = useState<string>('en');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showImageUpScale, setShowImageUpScale] = useState(false);
  
  console.log(errorMessage)
  const pathname = usePathname();
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    setLanguage(segments[0] || 'en');
  }, [pathname]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(
          "https://tajer-backend.tajerplatform.workers.dev/api/public/offers"
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setOffersData(json.data || []); 
      } catch {
        setErrorMessage(t("errorMessage") || "Failed to load offers");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [t]);

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



  const handleCloseImageUpScale = () => {
    setShowImageUpScale(false);
    setSelectedOffer(null);
  };

  const totalSlides = Math.ceil(offersData.length / cardsPerSlide);
  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentSlide((prev) => prev - 1);
    } 
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const slideGroups = [];
  for (let i = 0; i < offersData.length; i += cardsPerSlide) {
    slideGroups.push(offersData.slice(i, i + cardsPerSlide));
  }

  return (
    <section dir='ltr' className="py-12 bg-muted/30 rounded-lg">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{th("specialOffers")}</h2>
        <p className="mt-2 text-muted-foreground">{th("specialOffersDesc")}</p>
      </div>

      <div className="relative w-[95%] mx-auto">
        {offersData.length > cardsPerSlide && (
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
        )}

        {offersData.length > cardsPerSlide && (
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
        )}

        <div 
          ref={sliderRef}
          className="overflow-hidden rounded-xl"
        >
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
                  slideGroup.map((offer, idx) => (
                    <ProductCard 
                      key={offer.id} 
                      idx={idx} 
                      language={language}
                      type="offer"
                       t={t}
                        tb={tb}
                        tc={tc}
                      product={offer}
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
        <Link href="/offers?search=&page=1">
          <Badge
            variant="outline"
            className="text-base py-2 px-6 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors border-primary"
          >
            {tc("viewAllOffers")}
          </Badge>
        </Link>
      </div>

      {showImageUpScale && selectedOffer && (
        <ImageUpScale 
          src={selectedOffer.imageUrl || "/placeholder.svg"}
          alt={language === "en" ? selectedOffer.name : selectedOffer.name_ar}
          onClose={handleCloseImageUpScale}
        />
      )}
    </section>
  );
}