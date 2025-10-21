"use client"
import {Link} from '@/i18n/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Boxes, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useSearchParams, usePathname } from 'next/navigation';
import ProductCard from '../common/CommonCard';

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

export default function ProductGrid({ categoryId, factoryId }: { categoryId: number | number[]; factoryId: number }) {
  const t = useTranslations("specialProducts");
  const tb = useTranslations("buttons");
  const tc = useTranslations("common");
  const tn = useTranslations('noProducts');
  
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState<ProductBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<{ last_page: number; total?: number }>({ last_page: 1 });
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

  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    if (search) {
      url.searchParams.set('search', search);
    }
    window.location.href = url.toString();
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(meta.last_page, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
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
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t mt-6">
         
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : "rotate-360"}`}/>
              {tc('previous')}
            </Button>

            <div className="flex gap-1 mx-2">
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="min-w-[40px]"
                >
                  {pageNum}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === meta.last_page}
              className="flex items-center gap-1"
            >
              {tc('next')}
              <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : "rotate-360"}`} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}