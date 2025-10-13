import useOneTimeAnimation from "./useOneTimeAnimation";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import ImageUpScale from "../ImageUpScale";
import { useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

// ده الـ interface الصح اللي بيمatch الـ API response
interface ProductBase {
  id: number;
  barcode: string | null;
  name: string;
  name_ar: string;
  description: string | null;
  description_ar: string | null;
  unitType: "piece_only" | "pack_only" | "piece_and_pack" | string;
  piecePrice: number | null;
  packPrice: number | null;
  piecesPerPack: number | null;
  factoryId: number;
  imageUrl: string | null;
  image_public_id: string | null;
  minOrderQuantity: number | null;
  discountAmount: number | null;
  discountType: "percentage" | "fixed_amount" | string | null;
}

export default function ProductCard({
  product,
  idx,
  language,
  type,
  t,
  tb,
  tc
}: {
  product: ProductBase; // استخدم ProductBase مباشرة
  idx: number;
  language: string;
  type: "offer" | "product" | "productGrid";
  t: (key: string) => string;
  tb: (key: string) => string;
  tc: (key: string) => string;
}) {
  const [cardRef, inView] = useOneTimeAnimation<HTMLDivElement>({ 
    threshold: type === "productGrid" ? 0.01 : 0.18 
  });

  const [showImageUpScale, setShowImageUpScale] = useState(false);

  // احسب isOnSale من الـ discountAmount
  const isOnSale = product.discountAmount && product.discountAmount > 0;

  const calculateDiscountedPrice = (product: ProductBase, isPack: boolean = false) => {
    const originalPrice = isPack ? (product.packPrice || 0) : (product.piecePrice || 0);
    if (!product.discountAmount || product.discountAmount <= 0) return originalPrice;
    
    if (product.discountType === 'percentage') {
      return originalPrice * (1 - product.discountAmount / 100);
    } else {
      return Math.max(0, originalPrice - product.discountAmount);
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

  // Handle null prices
  const piecePrice = product.piecePrice || 0;
  const packPrice = product.packPrice || 0;
  const piecesPerPack = product.piecesPerPack || 0;

  return (
    <>
      <div
        ref={cardRef}
        style={getAnimationStyle()}
        className="w-full h-full flex-shrink-0"
      >
        <Card className="overflow-hidden flex flex-col h-full rounded-2xl duration-300 transition-transform border-2 hover:border-primary/30">
          <div className="relative pt-[100%]">
            {isOnSale && (
              <Badge className="absolute top-2 right-2 bg-primary z-10">
                {product.discountType === 'percentage' 
                  ? `${product.discountAmount}% ${t('offer')}` 
                  : `${product.discountAmount} ${tc('coins')} ${t('offer')}`}
              </Badge> 
            )}
            <div 
              className="absolute top-0 left-0 w-full h-full cursor-zoom-in"
              onClick={handleImageClick}
            >
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover duration-300 hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>
          <CardContent className="p-4 flex-grow">
            <div className="text-sm text-muted-foreground mb-1"></div>
            <h3 className="font-semibold mb-1 line-clamp-2 text-lg truncate w-full">
              {language === 'en' ? product.name : product.name_ar}
            </h3>
            <div className="flex items-baseline mt-2">
              {product.unitType === "pack_only" || product.unitType === "piece_or_pack" ? (
                <div className="flex gap-2 flex-col w-full">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 w-full">
                      {isOnSale ? (
                        <div className="flex gap-2">
                          <span className="text-lg font-bold text-primary">
                            {calculateDiscountedPrice(product, false).toFixed(2)} {tc('coins')}
                          </span>
                          <span className="line-through text-muted-foreground text-sm">
                            {piecePrice.toFixed(2)} {tc('coins')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {piecePrice.toFixed(2)} {tc('coins')}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        / {language === 'en' ? "piece" : "قطعة"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-md w-[100%] mr-2 font-medium">
                      {t('PackPrice')}: {calculateDiscountedPrice(product, true).toFixed(2)} {tc('coins')}
                      {isOnSale && (
                        <span className="line-through text-muted-foreground text-sm ml-2">
                          {packPrice.toFixed(2)} {tc('coins')}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t('piecesPerPack')}: {piecesPerPack} / {language === 'en' ? "pieces" : "قطع في الحزمه"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  {isOnSale ? (
                    <div className="flex gap-2 w-full">
                      <span className="text-lg font-bold text-primary">
                        {calculateDiscountedPrice(product).toFixed(2)} {tc('coins')}
                      </span>
                      <span className="line-through text-muted-foreground text-sm">
                        {piecePrice.toFixed(2)} {tc('coins')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {piecePrice.toFixed(2)} {tc('coins')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/products/${product.id}`}
              className="w-full" 
            >
            <Button
              variant="outline"
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" 
            >
              <ShoppingCart className="h-4 w-4 ml-2" />
              {tb('viewProducts')}
            </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
     {showImageUpScale  && 
  createPortal(
    <ImageUpScale 
      src={product.imageUrl || "/placeholder.svg"}
      alt={language === "en" ? product.name : product.name_ar}
      onClose={handleCloseImageUpScale}
    />,
    document.body
  )
}
    </>
  );
};