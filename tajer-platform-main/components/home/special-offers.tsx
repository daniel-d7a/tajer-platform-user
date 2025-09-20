"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

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

export default function SpecialOffers() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const [offersData, setOffersData] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  
  const [language, setLanguage] = useState('en');
  const pathname = usePathname();
  
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || 'en'; 
    setLanguage(lang);
  }, [pathname]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(
          "https://tajer-backend.tajerplatform.workers.dev/api/public/offers"
        );
        const json = await res.json();
        setOffersData(json.data.slice(0, 3)); 
      } catch (err) {
        console.error("something went wrong", err);
        setErrorMessage(t('errorMessage'));
      } finally {
        setLoading(false);
      };
    };
    fetchOffers();
  }, []);

  const calculateDiscountedPrice = (offer: Offer, isPack: boolean = false) => {
    const originalPrice = isPack ? offer.packPrice : offer.piecePrice;
    
    if (offer.discountAmount <= 0) return originalPrice;
    
    if (offer.discountType === 'percentage') {
      return originalPrice * (1 - offer.discountAmount / 100);
    } else {
      return Math.max(0, originalPrice - offer.discountAmount);
    };
  };
  return (
    <section className="py-12 bg-muted/30 rounded-lg">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t("specialOffers")}</h2>
        <p className="mt-2 text-muted-foreground">{t("specialOffersDesc")}</p>
      </div>
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse h-full p-5">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 flex-grow">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/4" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : offersData.length > 0 ? (
          offersData.map((offer) => (
            <Link href={`products/${offer.id}`} key={offer.id} className="w-full h-full">
              <Card className="overflow-hidden flex flex-col h-full rounded-2xl hover:scale-105 duration-300 transition-transform">
                <div className="relative pt-[100%]">
                  <Badge className="absolute top-2 right-2 bg-primary z-10">
                    {offer.discountType === 'percentage' 
                      ? `${offer.discountAmount}% ${tc('discount')}` 
                      : `${offer.discountAmount} ${tc('coins')} ${tc('discount')}`}
                  </Badge>
                  <Image
                    src={offer.imageUrl || "/placeholder.svg"}
                    alt={language === 'en' ? offer.name : offer.name_ar}
                    fill
                    className="object-cover absolute top-0 left-0"
                  />
                </div>
                <CardContent className="p-4 flex-grow">
                  <div className="text-sm text-muted-foreground mb-1"></div>
                  <h3 className="font-semibold mb-1 line-clamp-2 text-xl">
                    {language === 'en' ? offer.name : offer.name_ar}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'en' ? offer.factory.name : offer.factory.name_ar}
                  </p>
                  <div className="flex items-baseline mt-2 gap-2">
                    {offer.unitType === "pack_only" || offer.unitType === "piece_or_pack" ? (
                      <div className="flex gap-2 flex-col w-full">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2 w-full">
                            {offer.discountAmount > 0 ? (
                              <div className="flex gap-2 items-center">
                                <span className="text-lg font-bold">
                                  {calculateDiscountedPrice(offer, false).toFixed(2)} {tc('coins')}
                                </span>
                                <span className="line-through text-muted-foreground">
                                  {offer.piecePrice.toFixed(2)} {tc('coins')}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold">
                                {offer.piecePrice.toFixed(2)} {tc('coins')}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              / {language === 'en' ? offer.name : offer.name_ar}
                            </span> 
                          </div>
                        </div>
                        <div>
                          <span className="text-md w-[100%] mr-2 flex gap-2">
                            {t('PackPrice')}: {calculateDiscountedPrice(offer, true).toFixed(2)} {tc('coins')}
                            {offer.discountAmount > 0 && (
                              <span className="line-through text-muted-foreground ml-2">
                                {offer.packPrice.toFixed(2)} {tc('coins')}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-xs text-muted-foreground">
                            {t('piecesPerPack')}: {offer.piecesPerPack} {t('piece')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        {offer.discountAmount > 0 ? (
                          <div className="flex gap-2">
                            <span className="text-lg font-bold">
                              {calculateDiscountedPrice(offer).toFixed(2)} {tc('coins')}
                            </span>
                            <span className="line-through text-muted-foreground">
                              {offer.piecePrice.toFixed(2)} {tc('coins')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold">
                            {offer.piecePrice.toFixed(2)} {tc('coins')} 
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {tc('perPiece')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t('UnitType')}: {offer.unitType === "piece_only" 
                        ? t('pieceOnly') 
                        : offer.unitType === "pack_only" 
                        ? t('packOnly') 
                        : t('pieceOrPack')}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {t('minOrder')}: {offer.minOrderQuantity} {offer.unitType === "pack_only" ? t('packs') : t('pieces')}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/products/${offer.id}`)}
                  >
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    {t('viewOffer')}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            {t('noOffers')}
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        )}
      </div>
      <div className="text-center mt-8">
        <Link href="/offers?search=&page=1">
          <Badge
            variant="outline"
            className="text-base py-2 px-4 cursor-pointer hover:bg-secondary hover:text-white"
          >
            {tc("viewAllOffers")}
          </Badge>
        </Link>
      </div>
    </section>
  );
};