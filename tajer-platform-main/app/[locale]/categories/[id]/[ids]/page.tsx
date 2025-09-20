"use client";
import {useState} from 'react'
import ProductGrid from '@/components/products/product-grid';
import { useParams,useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
export default function Page() {
    const router = useRouter();
    const t = useTranslations('categories');

  const [searchValue,setSearchValue] = useState('')
  const {id} = useParams();
    const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?search=${encodeURIComponent(searchValue)}&page=1`);
  };
  return (
    <div className="w-[90%] py-8 mx-auto">
       <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="pr-10"
        />
      </form>
      <ProductGrid factoryId={0} categoryId={Number(id)}/>
    </div>
  );
};