"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState,useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
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
}

export default function ProductGrid() {
  const t = useTranslations('product');
  const searchParams = useSearchParams();
  const [productData, SetProductData] = useState<Product[]>([]);
  const [loading,SetLoading] = useState(true);
  const [meta,SetMeta] = useState<{ last_page: number }>({ last_page: 1 });

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  useEffect(() =>{
    const fetchData = async () =>{
      try{
        SetLoading(true);
        const fetchData = await fetch(`https://tajer-backend.tajerplatform.workers.dev/api/public/products?categoryId=&search=${search}&page=${page}&limit=`);
        const res = await fetchData.json();
        SetProductData(res.data);
        SetMeta(res.meta);
      } finally {
        SetLoading(false);
      };
    };
    fetchData();
  },[page, search]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-2 flex flex-col">

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

      {!loading && productData.map(product => (
        <Card key={product.id} className="overflow-hidden flex flex-col h-full">
          <div className="relative pt-[100%]">
            {product.isOnSale && (
              <Badge className="absolute top-2 right-2 bg-primary z-10">
                {t('offer')}
              </Badge>
            )}
            <Image
              src={product.imageUrl || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover absolute top-0 left-0"
            />
          </div>
          <CardContent className="p-4 flex-grow">
            <div className="text-sm text-muted-foreground mb-1">
              {product.category}
            </div>
            <h3 className="font-semibold mb-1 line-clamp-2 text-xl truncate w-full">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {product.manufacturer}
            </p>

          
  <div className="flex items-baseline mt-2 ">
                {product.unitType === 'pack_only' || product.unitType === 'piece_or_pack' ? (
                 <div className='flex gap-2  flex-col w-full '>
                  <div className='flex  items-center '>
                    <div className='flex items-center gap-2'>
    <span className="text-lg font-bold">
                    {(product.piecePrice / product.piecesPerPack).toFixed(2)} JD
                  </span>
                   <span className="text-sm text-muted-foreground line-through mr-2">
                    {product.piecePrice.toFixed(2)} JD
                  </span>
                    </div>
        
                     <span className="text-xs text-muted-foreground mr-1  truncate w-25">
                / {product.name}
              </span>
                  </div>
                    <span className="text-md w-[100%]  mr-2">
                    Pack Price : {product.packPrice.toFixed(2)} JD
                  </span>
                 </div>
                ) : (  
                <>
                 <span className="text-lg font-bold">
                  {product.piecePrice.toFixed(2)} JD
                </span>
                 <span className="text-xs text-muted-foreground mr-1  truncate w-25">
                / {product.name}
              </span>
                </>
               )}    
            </div>

            <span className='text-xs text-muted-foreground'>Unit Type : {product.unitType}</span>
            <p className="text-xs text-muted-foreground mt-1">
              {t('minOrder')} : {product.minOrderQuantity} {product.name}
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

      <div className="flex justify-center items-center w-full gap-2 mt-6">
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