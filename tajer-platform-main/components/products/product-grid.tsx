"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useSearchParams, usePathname } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  name_ar: string;
  imageUrl: string;
  piecePrice: number;
  salePrice?: number;
  isOnSale: boolean;
  unit: string;
  category: string;
  manufacturer: string;
  minOrderQuantity: number;
  unitType: string;
  piecesPerPack: number;
  packPrice: number;
  factory: {
    name: string;
    name_ar: string;
  };
  discountType?: string;
  discountAmount?: number;
}

export default function ProductGrid({ categoryId, factoryId }: { categoryId: number | number[]; factoryId: number }) {
  const t = useTranslations('product');
  const tS = useTranslations("specialProducts");
  const tc = useTranslations("common");
  const tn = useTranslations('noProducts');
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<{ last_page: number }>({ last_page: 1 });
  const [language, setLanguage] = useState('en');
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || 'en';
    setLanguage(lang);
  }, [pathname]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let categoryParam = '';
        if (Array.isArray(categoryId)) {
          categoryParam = `categoryId=${categoryId.map((c) => c).join(',')}`;
        } else {
          categoryParam = `categoryId=${categoryId}`;
        };
        const fetchData = await fetch(`https://tajer-backend.tajerplatform.workers.dev/api/public/products?${categoryParam}&factoryId=${factoryId}&search=${search}&page=${page}&limit=`);
        const res = await fetchData.json();
        setProductData(res.data);
        setMeta(res.meta);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search, categoryId, factoryId]);

  const calculateDiscountedPrice = (product: Product, isPack: boolean = false) => {
    const originalPrice = isPack ? product.packPrice : product.piecePrice;
    
    if (!product.discountAmount || product.discountAmount <= 0) return originalPrice;
    
    if (product.discountType === 'percentage') {
      return originalPrice * (1 - product.discountAmount / 100);
    } else {
      return Math.max(0, originalPrice - product.discountAmount);
    }
  };

  const isProductOnSale = (product: Product) => {
    return product.isOnSale || (product.discountAmount && product.discountAmount > 0);
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="gap-6 w-full px-2 flex flex-col">
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>

        {loading &&
          Array.from({ length: 16 }).map((_, idx) => (
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
        {!loading && productData.length > 0 && productData.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col h-full rounded-2xl hover:scale-105 duration-300 transition-transform">
            <div className="relative pt-[100%]">
              {isProductOnSale(product) && (
                <Badge className="absolute top-2 right-2 bg-primary z-10">
                  {product.discountType === 'percentage' 
                    ? `${product.discountAmount}% ${tc('offer')}` 
                    : `${product.discountAmount} ${tc('coins')} ${tc('offer')}`}
                </Badge>
              )}
              <Image
                src={product.imageUrl || '/placeholder.svg'}
                alt={language === 'en' ? product.name : product.name_ar}
                fill
                className="object-cover absolute top-0 left-0"
              />
            </div>
            <CardContent className="p-4 flex-grow">
              <div className="text-sm text-muted-foreground mb-1">
                {product.category}
              </div>
              <h3 className="font-semibold mb-1 line-clamp-2 text-xl">
                {language === 'en' ? product.name : product.name_ar}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'en' ? product.factory.name : product.factory.name_ar}
              </p>
              
              <div className="flex items-baseline mt-2">
                {product.unitType === 'pack_only' || product.unitType === 'piece_or_pack' ? (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isProductOnSale(product) ? (
                          <>
                            <span className="text-lg font-bold">
                              {calculateDiscountedPrice(product, false).toFixed(2)} {tc('coins')}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {product.piecePrice.toFixed(2)} {tc('coins')}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            {product.piecePrice.toFixed(2)} {tc('coins')}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                            /{language === 'en' ? product.name : product.name_ar}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isProductOnSale(product) ? (
                        <>
                          <span className="text-md font-bold">
                            {tS('PackPrice')}: {calculateDiscountedPrice(product, true).toFixed(2)} {tc('coins')}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.packPrice.toFixed(2)} {tc('coins')}
                          </span>
                        </>
                      ) : (
                        <span className="text-md">
                          {tS('PackPrice')}: {product.packPrice.toFixed(2)} {tc('coins')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground">
                        {tS('piecesPerPack')}: {product.piecesPerPack}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center  flex-wrap gap-2 w-full">
                    {isProductOnSale(product) ? (
                      <>
                        <span className="text-lg font-bold">
                          {calculateDiscountedPrice(product).toFixed(2)} {tc('coins')}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {product.piecePrice.toFixed(2)} {tc('coins')}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">
                        {product.piecePrice.toFixed(2)} {tc('coins')}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      /{language === 'en' ? product.name : product.name_ar}
                    </span>
                  </div>
                )}
              </div>
              
              <span className='text-xs text-muted-foreground block mt-2'>
                {tS('UnitType')} : {product.unitType === "piece_only" ? tS('pieceOnly') : product.unitType === "pack_only" ? tS('packOnly') : tS('pieceOrPack')}
              </span>
              
              <p className="text-xs text-muted-foreground mt-1">
                {t('minOrder')} : {product.minOrderQuantity} {product.unitType === "pack_only" ? tS('packs') : tc('pieces')}
              </p>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Link href={`/products/${product.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  {t('viewProduct')}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        
        {!loading && productData.length === 0 && (
          <div className="col-span-full text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{tn('title')}</h2>
            <p className="text-muted-foreground mb-6">
              {tn('subTitle')}
            </p>
            <Link href="/categories">
              <Button className="bg-primary hover:bg-primary/90">
                {tn('browseProducts')}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {meta.last_page > 1 && (
        <div className="flex justify-start items-center w-full gap-2 mt-6">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`?search=${encodeURIComponent(search)}&page=${p}`} scroll={true}>
              <Button 
                variant={p === page ? "default" : "outline"} 
                className="px-4 py-2 text-sm"
              >
                {p}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}