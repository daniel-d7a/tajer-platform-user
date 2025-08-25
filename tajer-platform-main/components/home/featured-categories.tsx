"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  image?: string;
  count: number;
}

export default function FeaturedCategories() {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const [data, setData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://tajer-backend.tajerplatform.workers.dev/api/public/categories?limit=&page='
        );
        const res: { data: Category[] } = await response.json();
        setData(res.data);
      } finally {
        console.log('omar ');
      }
    };
    fetchData();
  }, []);

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t('featuredCategories')}</h2>
        <p className="mt-2 text-muted-foreground">
          {t('featuredCategoriesDesc')}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mx-auto px-4">
        {data.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="relative mx-auto h-24 w-24 mb-4 flex items-center justify-center overflow-hidden rounded-full bg-muted">
                  <Image
                    src={category.image || '/coffee.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover scale-105 transition-transform duration-300 hover:scale-110 hover:opacity-80 object-center"
                  />
                </div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} {tc('products')}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <Image
          src="/brandOne.png"
          alt="صورة"
          width={1920}
          height={1080}
          className="mt-8 w-[85%] mx-auto rounded-lg"
          priority
        />
      </div>
    </section>
  );
};
