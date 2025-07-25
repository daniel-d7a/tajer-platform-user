import { Card, CardContent } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/products/product-grid';
import CategoryList from '@/components/categories/category-list';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CategoriesPage() {
  const t = useTranslations('categories');

  return (
    <div className="w-[90%] py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('browseProducts')}</h1>

      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t('searchPlaceholder')} className="pr-10" />
      </div>

      <Tabs defaultValue="products" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">{t('tabsCategories')}</TabsTrigger>
          <TabsTrigger value="products">{t('tabsProducts')}</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <CategoryList />
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardContent className="p-6">
              <ProductGrid />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
