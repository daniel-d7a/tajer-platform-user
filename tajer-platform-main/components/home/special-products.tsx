"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

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
    imageUrl: string;
    category: string;
    manufacturer: string;
    piecePrice: number;
    piecesPerPack: number;
    unitType: string;
    id: number;
    packPrice:number;
    minOrderQuantity:number
  };
}

export default function SpecialProducts() {
  const t = useTranslations("specialProducts");
  const tb = useTranslations("buttons")
  const router = useRouter();
  const [Products, setProducts] = useState<ProductType[] | null>(null);
  const [loading, SetLoading] = useState(true);
  
  const fetchSpecialProducts = async () => {
    try {
      const data = await fetch(
        "https://tajer-backend.tajerplatform.workers.dev/api/featured/featured-products"
      );
      const res = await data.json();
      setProducts(res);
    } catch {
      setProducts(null);
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialProducts();
  }, []);

  return (
    <section className="py-12">
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">{t('title')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('subTitle')}
          </p>
        </div>

        {loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, idx) => (
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
    ))}
  </div>
) : Products?.length ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Products.slice(0, 4).map((product) => (
      <Link key={product.id} className="w-[100%] h-full" href={`/products/${product.product.id}`}>
        <Card className="overflow-hidden flex flex-col h-full">
          <div className="relative pt-[100%]">
            {product.isOnSale && (
              <Badge className="absolute top-2 right-2 bg-primary z-10">
                offer
              </Badge>
            )}
            <Image
              src={product.product.imageUrl || "/placeholder.svg"}
              alt={product.product.name}
              fill
              className="object-cover absolute top-0 left-0"
            />
          </div>
          <CardContent className="p-4 flex-grow">
            <div className="text-sm text-muted-foreground mb-1"></div>
            <h3 className="font-semibold mb-1 line-clamp-2 text-xl truncate w-full">
              {product.product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {product.product.manufacturer}
            </p>

            <div className="flex items-baseline mt-2">
              {product.product.unitType === "pack_only" ||
              product.product.unitType === "piece_or_pack" ? (
                <div className="flex gap-2 flex-col w-full">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {product.product.piecePrice.toFixed(2)} JD
                      </span>
                      /
                    </div>
                    <span className="text-xs text-muted-foreground mr-1 truncate w-full">
                      {product.product.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-md w-[100%] mr-2">
                      Pack Price : {product.product.packPrice} JD
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">
                      عدد القطع  : {product.product.piecesPerPack}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-lg font-bold">
                    {product.product.piecePrice} JD
                  </span>
                  <span className="text-xs text-muted-foreground mr-1 truncate w-25">
                    / {product.product.name}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">
                Unit Type : {product.product.unitType}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              minOrder : {product.product.minOrderQuantity} {product.name}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <ShoppingCart className="h-4 w-4 ml-2" />
              viewProduct
            </Button>
          </CardFooter>
        </Card>
      </Link>
    ))}
  </div>
) : (
  <div className=" w-full">
    <p className="text-center">{t('NotFoundProducts')}</p>
  </div>
)}

             <div className="text-center mt-8">
                   <Link href="/special-products" >
                     <Badge
                       variant="outline"
                       className="text-base py-2 px-4  cursor-pointer hover:bg-secondary hover:text-white"
                     >
                        {tb('featuredProducts')}
                     </Badge>
                   </Link>
                 </div>
      </div>
    </section>
  );
};