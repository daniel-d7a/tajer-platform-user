"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProduct {
  id: number;
  productId: number;
  position: number | null;
  product: {
    id: number;
    barcode: string;
    name: string;
    name_ar: string;
    description: string;
    unitType: string;
    piecePrice: number;
    packPrice: number;
    piecesPerPack: number;
    factoryId: number;
    imageUrl: string;
    image_public_id: string;
    minOrderQuantity: number;
    discountAmount: number;
    discountType: string | null;
  };
}

export default function ProductGrid() {
  const t = useTranslations("product");
  const [productData, setProductData] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://tajer-backend.tajerplatform.workers.dev/api/featured/featured-products"
        );
        const json: FeaturedProduct[] = await res.json();
        setProductData(json);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-[100%] flex flex-col gap-10 items-center justify-center p-10">
         <div className="text-center ">
        <h2 className="text-4xl font-bold">Special Products</h2>
        <p className="mt-2 text-muted-foreground">Special Products for you merchant</p>
      </div>
<div className="w-[100%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
      {loading &&
        Array.from({ length: 8 }).map((_, idx) => (
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

      {!loading &&
        productData.map((item) => {
          const product = item.product;
          return (
            <Card key={product.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative pt-[100%]">
                {product.discountAmount > 0 && (
                  <Badge className="absolute top-2 right-2 bg-primary z-10">
                    {t("offer")}
                  </Badge>
                )} 
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover absolute top-0 left-0"
                />
              </div>
              <CardContent className="p-4 flex-grow">
                <div className="text-sm text-muted-foreground mb-1 truncate w-full">
                  {product.barcode}
                </div>
                <h3 className="font-semibold mb-1 line-clamp-2 text-xl truncate w-full truncate w-full">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2  truncate w-full">
                  {product.description}
                </p>

                <div className="flex items-baseline mt-2">
                  {product.unitType === "pack_only" ||
                  product.unitType === "piece_or_pack" ? (
                    <div className="flex gap-2 flex-col w-full">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {(product.piecePrice / product.piecesPerPack).toFixed(
                              2
                            )}{" "}
                            JD
                          </span>
                          <span className="text-sm text-muted-foreground line-through mr-2">
                            {product.piecePrice.toFixed(2)} JD
                          </span>
                        </div>

                        <span className="text-xs text-muted-foreground ml-2 truncate w-25">
                          / {product.name}
                        </span>
                      </div>
                      <span className="text-md w-full">
                        Pack Price : {product.packPrice.toFixed(2)} JD
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-lg font-bold">
                        {product.piecePrice.toFixed(2)} JD
                      </span>
                      <span className="text-xs text-muted-foreground ml-2 truncate w-25">
                        / {product.name}
                      </span>
                    </>
                  )}
                </div>

                <span className="text-xs text-muted-foreground">
                  Unit Type : {product.unitType}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("minOrder")} : {product.minOrderQuantity} {product.name}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/products/${product.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    {t("viewProduct")}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
    </div>
    </div>
    
  );
}
