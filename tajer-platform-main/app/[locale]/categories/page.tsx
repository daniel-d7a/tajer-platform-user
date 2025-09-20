"use client"
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/products/product-grid';
import CategoryList from '@/components/categories/category-list';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
 
export default function CategoriesPage() {
  const t = useTranslations('categories');
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState<string>(currentSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?search=${encodeURIComponent(searchValue)}&page=1`);
  };
  return (
    <div className="w-[90%] py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('browseProducts')}</h1>
 
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="pr-10"
        />
      </form>
      <Tabs defaultValue="products" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">{t('tabsCategories')}</TabsTrigger>
          <TabsTrigger value="products">{t('tabsProducts')}</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryList  search={String(searchValue)}/>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardContent className="p-6">
              <ProductGrid factoryId={0} categoryId={0}/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};