"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import { ShoppingCart } from "lucide-react";
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

// Custom hook to check if element is in viewport
function useInView<T extends HTMLElement = HTMLElement>(opts?: { threshold?: number }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let ticking = false;
    const threshold = opts?.threshold ?? 0.15;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // Check if threshold of element is visible
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

// مكون البطاقة المنفصل مع الأنيميشن
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
  const [cardRef, inView] = useInView<HTMLDivElement>({ threshold: 0.18 });

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
        transition: "opacity 0.7s cubic-bezier(.4,.2,0,1), transform 0.7s cubic-bezier(.4,.2,0,1)",
        transitionDelay: inView ? `${idx * 0.08}s` : "0s",
        willChange: "opacity, transform",
      }}
      className="w-full h-full"
    >
      <Link href={`/products/${offer.id}`} className="block w-full h-full" tabIndex={0}>
        <Card className="overflow-hidden flex flex-col h-full rounded-2xl hover:scale-105 duration-300 transition-transform">
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
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={idx === 0}
            />
          </div>
          <CardContent className="p-4 flex-grow">
            <h3 className="font-semibold mb-1 line-clamp-2 text-xl">
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
                        <span className="text-lg font-bold">
                          {calculateDiscountedPrice(offer, false).toFixed(2)} {tc("coins")}
                        </span>
                        <span className="line-through text-muted-foreground">
                          {offer.piecePrice.toFixed(2)} {tc("coins")}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">
                        {offer.piecePrice.toFixed(2)} {tc("coins")}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      /               {language === "en" ? offer.name : offer.name_ar}

                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md">
                      {t("PackPrice")}: {calculateDiscountedPrice(offer, true).toFixed(2)} {tc("coins")}
                    </span>
                    {offer.discountAmount > 0 && (
                      <span className="line-through text-muted-foreground">
                        {offer.packPrice.toFixed(2)} {tc("coins")}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {t("piecesPerPack")}: {offer.piecesPerPack}  /{language === "en" ? offer.name : offer.name_ar}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {offer.discountAmount > 0 ? (
                    <>
                      <span className="text-lg font-bold">
                        {calculateDiscountedPrice(offer).toFixed(2)} {tc("coins")}
                      </span>
                      <span className="line-through text-muted-foreground">
                        {offer.piecePrice.toFixed(2)} {tc("coins")}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">
                      {offer.piecePrice.toFixed(2)} {tc("coins")}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-xs text-muted-foreground">
                {t("UnitType")}: {offer.unitType === "piece_only" 
                  ? t("pieceOnly") 
                  : offer.unitType === "pack_only" 
                  ? t("packOnly") 
                  : t("pieceOrPack")}
              </span>
              <span className="text-xs text-muted-foreground">
                {t("minOrder")}: {offer.minOrderQuantity} {offer.unitType === "pack_only" ? t("packs") : t("pieces")}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              variant="outline"
              className="w-full"
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

// مكون الهيكل العظمي
function SkeletonCard({ idx }: { idx: number }) {
  return (
    <Card key={idx} className="animate-pulse h-full">
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

export default function SpecialOffers() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const [offersData, setOffersData] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [language, setLanguage] = useState<string>('en');

  const router = useRouter();
  const pathname = usePathname();

  // Detect language from pathname
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    setLanguage(segments[0] || 'en');
  }, [pathname]);

  // Fetch offers data
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
        setOffersData(json.data?.slice(0, 4) || []); 
      } catch {
        setErrorMessage(t("errorMessage") || "Failed to load offers");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [t]);

  return (
    <section className="py-12 bg-muted/30 rounded-lg">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t("specialOffers")}</h2>
        <p className="mt-2 text-muted-foreground">{t("specialOffersDesc")}</p>
      </div>
      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }, (_, idx) => (
            <SkeletonCard key={idx} idx={idx} />
          ))
        ) : offersData.length > 0 ? (
          offersData.map((offer, idx) => (
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
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-8">
            {t("noOffers") || "No offers available"}
            {errorMessage && <p className="text-sm mt-2">{errorMessage}</p>}
          </div>
        )}
      </div>
      <div className="text-center mt-8">
        <Link href="/offers?search=&page=1">
          <Badge
            variant="outline"
            className="text-base py-2 px-4 cursor-pointer hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            {tc("viewAllOffers")}
          </Badge>
        </Link>
      </div>
    </section>
  );
}