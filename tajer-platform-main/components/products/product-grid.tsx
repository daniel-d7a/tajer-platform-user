import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

const products = [
  {
    id: 1,
    name: 'زيت زيتون فاخر',
    image: '/placeholder.svg?height=300&width=300',
    price: 75.0,
    unit: 'لتر',
    minOrder: 6,
    category: 'بقالة',
    company: 'شركة الزيوت العالمية',
    isOnSale: true,
    salePrice: 65.0,
  },
  {
    id: 2,
    name: 'أرز بسمتي',
    image: '/placeholder.svg?height=300&width=300',
    price: 120.0,
    unit: 'كيس 5 كجم',
    minOrder: 10,
    category: 'بقالة',
    company: 'شركة الغذاء الوطنية',
    isOnSale: false,
  },
  {
    id: 3,
    name: 'معجون طماطم',
    image: '/placeholder.svg?height=300&width=300',
    price: 8.5,
    unit: 'علبة',
    minOrder: 24,
    category: 'بقالة',
    company: 'شركة المعلبات المتحدة',
    isOnSale: false,
  },
  {
    id: 4,
    name: 'مناديل ورقية',
    image: '/placeholder.svg?height=300&width=300',
    price: 12.0,
    unit: 'عبوة',
    minOrder: 20,
    category: 'منتجات ورقية',
    company: 'شركة النظافة العالمية',
    isOnSale: true,
    salePrice: 10.0,
  },
  {
    id: 5,
    name: 'شاي أخضر',
    image: '/placeholder.svg?height=300&width=300',
    price: 15.0,
    unit: 'علبة',
    minOrder: 12,
    category: 'مشروبات',
    company: 'شركة المشروبات العالمية',
    isOnSale: false,
  },
  {
    id: 6,
    name: 'سكر ناعم',
    image: '/placeholder.svg?height=300&width=300',
    price: 25.0,
    unit: 'كيس 2 كجم',
    minOrder: 15,
    category: 'بقالة',
    company: 'شركة الغذاء الوطنية',
    isOnSale: false,
  },
];

export default function ProductGrid() {
  const t = useTranslations('product');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden flex flex-col h-full">
          <div className="relative pt-[100%]">
            {product.isOnSale && (
              <Badge className="absolute top-2 right-2 bg-primary z-10">
                {t('offer')}
              </Badge>
            )}
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover absolute top-0 left-0"
            />
          </div>
          <CardContent className="p-4 flex-grow">
            <div className="text-sm text-muted-foreground mb-1">
              {product.category}
            </div>
            <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">
              {product.company}
            </p>
            <div className="flex items-baseline mt-2">
              {product.isOnSale ? (
                <>
                  <span className="text-lg font-bold">
                    {product.salePrice?.toFixed(2)} JD
                  </span>
                  <span className="text-sm text-muted-foreground line-through mr-2">
                    {product.price.toFixed(2)} JD
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold">
                  {product.price.toFixed(2)} JD
                </span>
              )}
              <span className="text-xs text-muted-foreground mr-1">
                / {product.unit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('minOrder')} : {product.minOrder} {product.unit}
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
    </div>
  );
}
