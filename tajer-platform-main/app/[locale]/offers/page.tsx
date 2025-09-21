"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const [searchValue,setSearchValue] = useState('')
  const [offersData, setOffersData] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [language, setLanguage] = useState('en');
  const pathname = usePathname();
    const searchParams = useSearchParams();
  
  const search = searchParams.get("search")
  
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || 'en'; 
    setLanguage(lang);
  }, [pathname]);
   const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${pathname}?search=${encodeURIComponent(searchValue)}&page=1`);
  };
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(
          `https://tajer-backend.tajerplatform.workers.dev/api/public/offers?categoryId=&search=${search || ''}&page=&limit=`
        );
        const json = await res.json();
        setOffersData(json.data); 
      } catch (err) {
        console.error("something went wrong", err);
        setErrorMessage(t('errorMessage') || "something went wrong, try again later please.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [t,search]);
  const calculateDiscountedPrice = (offer: Offer, isPack: boolean = false) => {
    const originalPrice = isPack ? offer.packPrice : offer.piecePrice;
    
    if (offer.discountAmount <= 0) return originalPrice;
    
    if (offer.discountType === 'percentage') {
      return originalPrice * (1 - offer.discountAmount / 100);
    } else {
      return Math.max(0, originalPrice - offer.discountAmount);
    }
  };

  return (
    <section className="py-12 bg-muted/30 rounded-lg  mx-auto p-6">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t("specialOffers")}</h2>
        <p className="mt-2 text-muted-foreground">{t("specialOffersDesc")}</p>
      </div>
         <form onSubmit={handleSearch} className="relative mb-6 ">
          <div>
                  <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className="pr-10"
                      />
            </div>

                </form>
      <div className="w-[100%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse h-full p-4">
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
                      ? `${offer.discountAmount}% ${tc('offer')}` 
                      : `${offer.discountAmount} ${tc('coins')} ${tc('offer')}`}
                  </Badge>
                  <Image
                    src={offer.imageUrl || "/placeholder.svg"}
                    alt={language === 'en' ? offer.name : offer.name_ar}
                    fill
                    className="object-cover absolute top-0 left-0"
                  />
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-semibold mb-1 line-clamp-2 text-xl">
                    {language === 'en' ? offer.name : offer.name_ar}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'en' ? offer.factory.name : offer.factory.name_ar}
                  </p>

                  <div className="flex items-baseline mt-2">
                    {offer.unitType === "pack_only" || offer.unitType === "piece_or_pack" ? (
                      <div className="flex gap-2 flex-col w-full">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2 w-full">
                            {offer.discountAmount > 0 ? (
                              <div className="flex gap-2">
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
                              /{language === 'en' ? offer.name : offer.name_ar}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-md w-[100%] mr-2 ">
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
                            {t('piecesPerPack')}: {offer.piecesPerPack}
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

                  <div className="flex flex-col gap-2 mt-2">
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
                <CardFooter className="p-4 pt-0 flex flex-col gap-4">
                  <Button
                    className="w-full text-white p-2.5 text-center cursor-pointer hover:bg-secondary duration-300"
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
    </section>
  );
};