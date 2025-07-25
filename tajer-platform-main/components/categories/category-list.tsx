import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

const categories = [
  {
    id: 1,
    name: 'بقالة',
    image: '/placeholder.svg?height=200&width=200',
    count: 120,
    subcategories: ['معلبات', 'مشروبات', 'حبوب', 'زيوت'],
  },
  {
    id: 2,
    name: 'سوبر ماركت',
    image: '/placeholder.svg?height=200&width=200',
    count: 85,
    subcategories: ['منظفات', 'أدوات منزلية', 'منتجات ورقية', 'عناية شخصية'],
  },
  {
    id: 3,
    name: 'مطاعم',
    image: '/placeholder.svg?height=200&width=200',
    count: 150,
    subcategories: ['توابل', 'زيوت', 'معلبات', 'مجمدات'],
  },
  {
    id: 4,
    name: 'حلويات',
    image: '/placeholder.svg?height=200&width=200',
    count: 60,
    subcategories: ['مكسرات', 'شوكولاتة', 'سكاكر', 'مستلزمات خبز'],
  },
  {
    id: 5,
    name: 'مكتبات',
    image: '/placeholder.svg?height=200&width=200',
    count: 45,
    subcategories: ['قرطاسية', 'أدوات مكتبية', 'أوراق', 'أقلام'],
  },
  {
    id: 6,
    name: 'كوفي شوب',
    image: '/placeholder.svg?height=200&width=200',
    count: 75,
    subcategories: ['قهوة', 'شاي', 'مستلزمات تقديم', 'حلويات'],
  },
];

export default function CategoryList() {
  const tc = useTranslations('common');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map(category => (
        <Card key={category.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              <div className="relative h-40 w-40">
                <Image
                  src={category.image || '/placeholder.svg'}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {category.count} {tc('products')}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {category.subcategories.map((subcat, index) => (
                    <Link
                      key={index}
                      href={`/categories/${category.id}/${subcat}`}
                      className="text-xs bg-muted px-2 py-1 rounded-md hover:bg-primary/10"
                    >
                      {subcat}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/categories/${category.id}`}
                  className="block mt-4 text-sm text-primary hover:underline"
                >
                  {tc('viewAllProducts')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
