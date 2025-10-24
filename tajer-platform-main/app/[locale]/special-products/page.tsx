"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/common/CommonCard";

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
  const [productData, setProductData] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const tc = useTranslations("common");
  const tp = useTranslations("specialProducts");
  const tb = useTranslations("buttons");
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
        <p className="mt-2 text-muted-foreground">
          Special Products for you merchant
        </p>
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
              <ProductCard
                idx={product.id}
                language="ar"
                key={product.id}
                product={product}
                type="productGrid"
                t={tp}
                tb={tb}
                tc={tc}
              />
            );
          })}
      </div>
    </div>
  );
}
