"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

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

// Custom hook for one-time animation
function useOneTimeAnimation<T extends HTMLElement = HTMLElement>(opts?: { threshold?: number }) {
  const ref = useRef<T | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    let ticking = false;
    const threshold = opts?.threshold ?? 0.15;

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

function OfferCard({
  offer,
  idx,
  language,
  t,
  tc,
  router,
}: { 
  offer: Offer; 
  idx: number; 
  language: string;
  t: (key: string) => string;
  tc: (key: string) => string;
  router: ReturnType<typeof useRouter>;
}) {
  const [cardRef, inView] = useOneTimeAnimation<HTMLDivElement>({ threshold: 0.18 });

  const calculateDiscountedPrice = (offer: Offer, isPack: boolean = false): number => {
    const originalPrice = isPack ? offer.packPrice : offer.piecePrice;
    if (offer.discountAmount <= 0) return originalPrice;
    if (offer.discountType === "percentage") {
      return originalPrice * (1 - offer.discountAmount / 100);
    }
    return Math.max(0, originalPrice - offer.discountAmount);
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
      <Link href={`/products/${offer.id}`} className="block w-full h-full" tabIndex={0}>
        <Card className="overflow-hidden flex flex-col h-full rounded-2xl duration-300 transition-transform border-2 hover:border-primary/30">
          <div className="relative pt-[100%]">
            <Badge className="absolute top-2 right-2 bg-primary z-10">
              {offer.discountType === "percentage" 
                ? `${offer.discountAmount}% ${tc("discount")}`
                : `${offer.discountAmount} ${tc("coins")} ${tc("discount")}`
              }
            </Badge>
            <Image
              src={offer.imageUrl || "/placeholder.svg"}
              alt={language === "en" ? offer.name : offer.name_ar}
              fill
              className="object-cover absolute top-0 left-0"
              sizes="(max-width: 768px) 100vw, 25vw"
              priority={idx === 0}
            />
          </div>
          <CardContent className="p-4 flex-grow">
            <h3 className="font-semibold mb-1 line-clamp-2 text-lg">
              {language === "en" ? offer.name : offer.name_ar}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {language === "en" ? offer.factory.name : offer.factory.name_ar}
            </p>
            <div className="flex flex-col gap-2 mt-2">
              {(offer.unitType === "pack_only" || offer.unitType === "piece_or_pack") ? (
                <>
                  <div className="flex items-center gap-2">
                    {offer.discountAmount > 0 ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          {calculateDiscountedPrice(offer, false).toFixed(2)} {tc("coins")}
                        </span>
                        <span className="line-through text-muted-foreground text-sm">
                          {offer.piecePrice.toFixed(2)} {tc("coins")}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {offer.piecePrice.toFixed(2)} {tc("coins")}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      /{language === "en" ? "piece" : "قطعة"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md font-medium">
                      {t("PackPrice")}: {calculateDiscountedPrice(offer, true).toFixed(2)} {tc("coins")}
                    </span>
                    {offer.discountAmount > 0 && (
                      <span className="line-through text-muted-foreground text-sm">
                        {offer.packPrice.toFixed(2)} {tc("coins")}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {offer.discountAmount > 0 ? (
                    <>
                      <span className="text-lg font-bold text-primary">
                        {calculateDiscountedPrice(offer).toFixed(2)} {tc("coins")}
                      </span>
                      <span className="line-through text-muted-foreground text-sm">
                        {offer.piecePrice.toFixed(2)} {tc("coins")}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {offer.piecePrice.toFixed(2)} {tc("coins")}
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
                router.push(`/products/${offer.id}`);
              }}
            >
              <ShoppingCart className="h-4 w-4 ml-2" />
              {t("viewOffer")}
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
    </Card>
  );
}

export default function SpecialOffers() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const [offersData, setOffersData] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [language, setLanguage] = useState<string>('en');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  console.log(errorMessage)
  const router = useRouter();
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

  const cardsPerSlide = 4;
  const totalSlides = Math.ceil(offersData.length / cardsPerSlide);

  // منطق الأسهم المحسّن
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
    <section className="py-12 bg-muted/30 rounded-lg">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t("specialOffers")}</h2>
        <p className="mt-2 text-muted-foreground">{t("specialOffersDesc")}</p>
      </div>

      <div className="relative w-[95%] mx-auto">
        {/* زر السابق - يظهر فقط إذا كان هناك سلايدات سابقة */}
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

        {/* زر التالي - يظهر فقط إذا كان هناك سلايدات تالية */}
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
                  Array.from({ length: 4 }, (_, idx) => (
                    <SkeletonCard key={idx} idx={idx} />
                  ))
                ) : slideGroup.length > 0 ? (
                  slideGroup.map((offer, idx) => (
                    <OfferCard 
                      key={offer.id} 
                      offer={offer} 
                      idx={idx} 
                      language={language}
                      t={t}
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
        <Link href="/offers?search=&page=1">
          <Badge
            variant="outline"
            className="text-base py-2 px-6 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors border-primary"
          >
            {tc("viewAllOffers")}
          </Badge>
        </Link>
      </div>
    </section>
  );
}