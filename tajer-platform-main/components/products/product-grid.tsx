"use client"
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Boxes, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useSearchParams, usePathname } from 'next/navigation';
import ProductCard from '../common/CommonCard';
interface ProductType  {
  id: string;
  name: string;
  isOnSale: boolean;
  packPrice: number;
  piecePrice: number;
  minOrderQuantity: number;
  unitType: string;
  product: {
    name: string;
    name_ar: string;
    imageUrl: string;
    category: string;
    manufacturer: string;
    piecePrice: number;
    piecesPerPack: number;
    discountType: string;
    unitType: string;
    id: number;
    discountAmount: number;
    packPrice: number;
    minOrderQuantity: number;
  };
}


export default function ProductGrid({ categoryId, factoryId }: { categoryId: number | number[]; factoryId: number }) {
  const t = useTranslations("specialProducts");
    const tb = useTranslations("buttons");
    const tc = useTranslations("common");
  
  const tn = useTranslations('noProducts');
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState<ProductType[]>([]);
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
          <ProductCard 
            key={product.id}
            idx={Number(product.id)}
            language={language}
            product={product}
            t={t}
            tb={tb}
            tc={tc}
            type='productGrid'
          />
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
                <Boxes/>
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