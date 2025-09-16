"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState,useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { usePathname } from "next/navigation";

interface Product {
  id: number;
  name: string;
  name_ar:string;
  imageUrl: string;
  piecePrice: number;
  salePrice?: number;
  isOnSale: boolean;
  unit: string;
  category: string;
  manufacturer: string;
  minOrderQuantity: number;
  unitType:string;
  piecesPerPack: number; 
  packPrice: number;
  factory : {
    name:string
    name_ar:string;
  }
}
export default function ProductGrid({categoryId ,factoryId} : {categoryId: number ; factoryId : number}) {
  const t = useTranslations('product');
  const tS = useTranslations("specialProducts");
  const tc = useTranslations("common");
  const tn = useTranslations('noProducts');
  const searchParams = useSearchParams();
  const [productData, SetProductData] = useState<Product[]>([]);
  const [loading,SetLoading] = useState(true);
  const [meta,SetMeta] = useState<{ last_page: number }>({ last_page: 1 });
  const [language,setLanguage] = useState('en')
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0]; 
    setLanguage(lang)
  }, [pathname]);
  useEffect(() =>{
    const fetchData = async () =>{
      try{
        SetLoading(true);
        const fetchData = await fetch(`https://tajer-backend.tajerplatform.workers.dev/api/public/products?categoryId=${categoryId}&factoryId=${factoryId}&search=${search}&page=${page}&limit=`);
        const res = await fetchData.json();
        SetProductData(res.data);
        SetMeta(res.meta);
      } finally {
        SetLoading(false);
      };
    };
    fetchData();
    // eslint-disable-next-line
  },[page, search]);

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="gap-6 w-full px-2 flex flex-col">
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>

      {loading &&
       Array.from({ length: 16 }).map((_, idx) => (
            <Card  key={idx} className="animate-pulse h-full p-5" >
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
      {productData.length > 0 ? (
        !loading  && productData.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col h-full">
          <div className="relative pt-[100%]">
            {product.isOnSale && (
              <Badge className="absolute top-2 right-2 bg-primary z-10">
                {t('offer')}
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
            <h3 className="font-semibold mb-1 line-clamp-2 text-xl truncate w-full"> {language === 'en' ? product.name : product.name_ar}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {language === 'en' ? product.factory.name : product.factory.name_ar}
            </p>
            <div className="flex items-baseline mt-2">
              {product.unitType === 'pack_only' || product.unitType === 'piece_or_pack' ? (
  <div className="flex flex-col gap-2 w-full">
    <div className="flex items-center justify-between  gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">
          {(product.packPrice / product.piecesPerPack).toFixed(2)} {tc('coins')}
        </span>
        <span className="text-sm text-muted-foreground line-through">
          {product.piecePrice.toFixed(2)} {tc('coins')}
        </span>
          <span className="text-xs text-muted-foreground truncate w-25">
        / {language === 'en' ? product.name : product.name_ar}
      </span>
      </div>
    
    </div>

    <span className="text-md">
      {tS('PackPrice')} : {product.packPrice.toFixed(2)} {tc('coins')}
    </span>
  </div>
) : (
  <div className="flex items-center justify-between flex-wrap gap-2">
    <span className="text-lg font-bold">
      {product.piecePrice.toFixed(2)} {tc('coins')}
    </span>
    <span className="text-xs text-muted-foreground truncate">
      / {language === 'en' ? product.name : product.name_ar}
    </span>
  </div>
)}

            </div>
            <span className='text-xs text-muted-foreground'>
              {tS('UnitType')} : {product.unitType === "piece_only" ? tS('pieceOnly') : product.unitType === "pack_only" ? tS('packOnly') : tS('pieceOrPack')}
               </span>
            <p className="text-xs text-muted-foreground mt-1">
              {t('minOrder')} : {product.minOrderQuantity}/  {language === 'en' ? product.name : product.name_ar}
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
      ))
      ) : (
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

      <div className="flex justify-start items-center w-full gap-2 mt-6">
        {Array.from({ length: meta.last_page || 1 }, (_, i) => i + 1).map((p) => (
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
           

    </div>
  );
};