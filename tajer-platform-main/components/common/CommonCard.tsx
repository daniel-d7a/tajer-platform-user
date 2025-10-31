"use client";

import useOneTimeAnimation from "./useOneTimeAnimation";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import ImageUpScale from "../ImageUpScale";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { createPortal } from "react-dom";

interface ProductType {
  id: number;
  name: string;
  isOnSale?: boolean;
  packPrice?: number | null;
  piecePrice?: number | null;
  minOrderQuantity?: number | null;
  unitType: string;
  product?: {
    id: number;
    name: string;
    name_ar: string;
    imageUrl: string | null;
    category: string | null;
    manufacturer: string | null;
    piecePrice: number | null;
    piecesPerPack: number | null;
    discountType: string;
    unitType: string;
    discountAmount: number | null;
    packPrice: number | null;
    minOrderQuantity: number | null;
  };
}

interface ProductBase {
  id: number;
  name: string;
  name_ar: string;
  imageUrl: string | null;
  category: string | null;
  manufacturer: string | null;
  piecePrice: number | null;
  piecesPerPack: number | null;
  discountType: string;
  unitType: string;
  discountAmount: number | null;
  packPrice: number | null;
  minOrderQuantity: number | null;
}

export default function ProductCard({
  product,
  idx,
  language,
  type,
  t,
  tb,
  tc,
}: {
  product: ProductType;
  idx: number;
  language: string;
  type: "offer" | "product" | "productGrid";
  t: (key: string) => string;
  tb: (key: string) => string;
  tc: (key: string) => string;
}) {
  const [cardRef, inView] = useOneTimeAnimation<HTMLDivElement>({
    threshold: type === "productGrid" ? 0.01 : 0.18,
  });

  const [showImageUpScale, setShowImageUpScale] = useState(false);

  const productDetails: ProductBase =
    type === "product" && product.product
      ? (product.product as ProductBase)
      : (product as unknown as ProductBase);

  const calculateDiscountedPrice = (
    offer: ProductBase,
    isPack: boolean = false
  ) => {
    const originalPrice = isPack ? offer.packPrice ?? 0 : offer.piecePrice ?? 0;
    const discount = offer.discountAmount ?? 0;

    if (discount <= 0) return originalPrice;

    if (offer.discountType === "percentage") {
      return originalPrice * (1 - discount / 100);
    } else {
      return Math.max(0, originalPrice - discount);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowImageUpScale(true);
  };

  const handleCloseImageUpScale = () => {
    setShowImageUpScale(false);
  };

  const getAnimationStyle = () => {
    if (type === "productGrid") {
      return {
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(10px)",
        transition: inView
          ? "opacity 0.3s ease-out, transform 0.3s ease-out"
          : "none",
        transitionDelay: inView ? `${idx * 0.01}s` : "0s",
        willChange: inView ? "opacity, transform" : "auto",
      };
    } else {
      return {
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(60px)",
        transition: inView
          ? "opacity 0.7s cubic-bezier(.4,.2,0,1), transform 0.7s cubic-bezier(.4,.2,0,1)"
          : "none",
        transitionDelay: inView ? `${idx * 0.08}s` : "0s",
        willChange: inView ? "opacity, transform" : "auto",
      };
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        style={getAnimationStyle()}
        className="w-full h-full flex-shrink-0"
      >
        <Card className="overflow-hidden flex flex-col h-full w-full rounded-2xl border-2 transition-transform duration-300 hover:border-primary/30">
          <div className="relative pt-[100%]">
            {(productDetails.discountAmount ?? 0) > 0 && (
              <Badge className="absolute top-2 right-2 bg-primary z-10">
                {productDetails.discountType === "percentage"
                  ? `${productDetails.discountAmount ?? 0}% ${t("offer")}`
                  : `${productDetails.discountAmount ?? 0} ${tc("coins")} ${t(
                      "offer"
                    )}`}
              </Badge>
            )}
            <div
              className="absolute top-0 left-0 w-full h-full cursor-zoom-in"
              onClick={handleImageClick}
            >
              <Image
                src={productDetails.imageUrl || "/placeholder.svg"}
                alt={productDetails.name}
                fill
                className="object-cover duration-300 hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>

          <CardContent className="p-4 flex-grow">
            <h3 className="font-semibold mb-1 line-clamp-2 text-lg truncate w-full">
              {language === "en" ? productDetails.name : productDetails.name_ar}
            </h3>

            <div className="flex items-baseline mt-2">
              {productDetails.unitType === "pack_only" ||
              productDetails.unitType === "piece_or_pack" ? (
                <div className="flex gap-2 flex-col w-full">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 w-full">
                      {(productDetails.discountAmount ?? 0) > 0 ? (
                        <div className="flex gap-2">
                          <span className="text-lg font-bold text-primary">
                            {calculateDiscountedPrice(
                              productDetails,
                              false
                            ).toFixed(2)}{" "}
                            {tc("coins")}
                          </span>
                          <span className="line-through text-muted-foreground text-sm">
                            {(productDetails.piecePrice ?? 0).toFixed(2)}{" "}
                            {tc("coins")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {(productDetails.piecePrice ?? 0).toFixed(2)}{" "}
                          {tc("coins")}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        / {language === "en" ? "piece" : "قطعة"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-md w-[100%] mr-2 font-medium">
                      {t("PackPrice")}:{" "}
                      {calculateDiscountedPrice(productDetails, true).toFixed(
                        2
                      )}{" "}
                      {tc("coins")}
                      {(productDetails.discountAmount ?? 0) > 0 && (
                        <span className="line-through text-muted-foreground text-sm ml-2">
                          {(productDetails.packPrice ?? 0).toFixed(2)}{" "}
                          {tc("coins")}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t("piecesPerPack")}: {productDetails.piecesPerPack ?? 0}{" "}
                      / {language === "en" ? "pieces" : "قطع في الحزمة"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  {(productDetails.discountAmount ?? 0) > 0 ? (
                    <div className="flex gap-2 w-full">
                      <span className="text-lg font-bold text-primary">
                        {calculateDiscountedPrice(productDetails).toFixed(2)}{" "}
                        {tc("coins")}
                      </span>
                      <span className="line-through text-muted-foreground text-sm">
                        {(productDetails.piecePrice ?? 0).toFixed(2)}{" "}
                        {tc("coins")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {(productDetails.piecePrice ?? 0).toFixed(2)}{" "}
                      {tc("coins")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Link href={`/products/${productDetails.id}`} className="w-full">
              <Button
                variant="outline"
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <ShoppingCart className="h-4 w-4 ml-2" />
                {tb("viewProducts")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {showImageUpScale &&
        createPortal(
          <ImageUpScale
            src={productDetails.imageUrl || "/placeholder.svg"}
            alt={
              language === "en" ? productDetails.name : productDetails.name_ar
            }
            onClose={handleCloseImageUpScale}
          />,
          document.body
        )}
    </>
  );
}
