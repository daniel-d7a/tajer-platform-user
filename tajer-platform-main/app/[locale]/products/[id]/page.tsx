import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { use } from 'react';
import { useTranslations } from 'next-intl';

const products = [
  {
    id: 1,
    name: 'زيت زيتون فاخر',
    images: [
      '/placeholder.svg?height=500&width=500',
      '/placeholder.svg?height=500&width=500',
      '/placeholder.svg?height=500&width=500',
    ],
    price: 75.0,
    unit: 'لتر',
    minOrder: 6,
    category: 'بقالة',
    company: 'شركة الزيوت العالمية',
    isOnSale: true,
    salePrice: 65.0,
    description:
      'زيت زيتون بكر ممتاز من أجود أنواع الزيتون المزروع في بساتين البحر الأبيض المتوسط. يتميز بطعمه الغني ولونه الذهبي الطبيعي.',
    specifications: [
      'حجم العبوة: 1 لتر',
      'نوع الزيت: بكر ممتاز',
      'المنشأ: إسبانيا',
      'تاريخ الانتهاء: 24 شهر من تاريخ الإنتاج',
    ],
    inStock: true,
    stockQuantity: 150,
  },
  {
    id: 2,
    name: 'أرز بسمتي',
    images: ['/placeholder.svg?height=500&width=500'],
    price: 120.0,
    unit: 'كيس 5 كجم',
    minOrder: 10,
    category: 'بقالة',
    company: 'شركة الغذاء الوطنية',
    isOnSale: false,
    description:
      'أرز بسمتي فاخر طويل الحبة، مستورد من الهند. يتميز برائحته العطرة وطعمه المميز.',
    specifications: [
      'الوزن: 5 كيلوجرام',
      'النوع: بسمتي طويل الحبة',
      'المنشأ: الهند',
      'مدة الصلاحية: 18 شهر',
    ],
    inStock: true,
    stockQuantity: 80,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations('product');

  const { id } = use(params);
  const product = products.find(p => p.id === Number.parseInt(id));

  if (!product) {
    notFound(); 
  }

  return (
    <div className="w-[90%] py-8 mx-auto">
      <div className="mb-6">
        <Link href="/categories">
          <Button variant="ghost" className="mb-4">
            <ArrowRight className="h-4 w-4 ml-2" />
            {t('backToProducts')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isOnSale && (
              <Badge className="absolute top-4 right-4 bg-primary">
                {t('discount')}{' '}
                {Math.round(
                  ((product.price - product.salePrice!) / product.price) * 100
                )}
                %
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded border"
                >
                  <Image
                    src={image || '/placeholder.svg'}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              {product.category}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.company}</p>
          </div>

          <div className="flex items-baseline space-x-4 space-x-reverse">
            {product.isOnSale ? (
              <>
                <span className="text-3xl font-bold text-primary">
                  {product.salePrice!.toFixed(2)} JD
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {product.price.toFixed(2)} JD
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">
                {product.price.toFixed(2)} JD
              </span>
            )}
            <span className="text-muted-foreground">/ {product.unit}</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              <strong>{t('minOrder')}</strong> {product.minOrder} {product.unit}
            </p>
            <p className="text-sm">
              <strong>{t('inStock')}</strong>{' '}
              <span
                className={
                  product.inStock ? 'text-secondary' : 'text-destructive'
                }
              >
                {product.inStock
                  ? `${product.stockQuantity} ${t('pieces')}`
                  : t('notAvailable')}
              </span>
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">{t('description')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{t('specifications')}</h3>
            <ul className="space-y-1">
              {product.specifications.map((spec, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {spec}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-5 w-5 ml-2" />
              {product.inStock ? t('addToCart') : t('outofStock')}
            </Button>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Truck className="h-6 w-6 text-secondary" />
                <span className="text-xs text-muted-foreground">
                  {t('fastDelivery')}
                </span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6 text-secondary" />
                <span className="text-xs text-muted-foreground">
                  {t('qualityGuarantee')}
                </span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RefreshCw className="h-6 w-6 text-secondary" />
                <span className="text-xs text-muted-foreground">
                  {t('returnable')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">{t('relatedProducts')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4)
            .map(relatedProduct => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
              >
                <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                  <div className="relative aspect-square">
                    <Image
                      src={relatedProduct.images[0] || '/placeholder.svg'}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                    {relatedProduct.isOnSale && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        {t('offer')}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-baseline">
                      {relatedProduct.isOnSale ? (
                        <>
                          <span className="font-bold text-primary">
                            {relatedProduct.salePrice!.toFixed(2)} JD
                          </span>
                          <span className="text-sm text-muted-foreground line-through mr-2">
                            {relatedProduct.price.toFixed(2)} JD
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">
                          {relatedProduct.price.toFixed(2)} JD
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
