"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import ImageUpScale from "../ImageUpScale";
interface SubCategory {
  id: number;
  name: string;
  name_ar:string;
}

interface Category {
  id: number;
  name: string;
  name_ar:string;
  imageUrl:string;
  children?: SubCategory[];
}

interface Meta {
  page: number;
  last_page: number;
  total: number;
}

export default function CategoryList({search} : {search:string}) {
  const tc = useTranslations("common");
  const tn = useTranslations('noCategories')
  const [language,setLanguage] = useState('en')
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [close,setIsClose] = useState(false)
  const [selecetImage,setSelectedImage] = useState('')
  const [meta, setMeta] = useState<Meta | null>(null);
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0]; 
    setLanguage(lang)
  }, [pathname]);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://tajer-backend.tajerplatform.workers.dev/api/public/categories?limit=&page=${page}&search=${search}`
        );
        const json: { data: Category[]; meta: Meta } = await res.json();
        setCategories(json.data);
        setMeta(json.meta);
      } catch (err) {
        console.error("error fetching categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [page,search]);
  return (
    <>
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative h-40 w-40 bg-muted animate-pulse" />
                  <div className="p-4 flex-1">
                    <div className="h-6 w-32 bg-muted rounded mb-2 animate-pulse" />
                    <div className="h-4 w-20 bg-muted rounded mb-4 animate-pulse" />
                    <div className="flex flex-wrap gap-2 mt-4">
                      {Array.from({ length: 3 }).map((__, subIdx) => (
                        <div
                          key={subIdx}
                          className="h-5 w-16 bg-muted rounded-md animate-pulse"
                        />
                      ))}
                    </div>
                    <div className="h-4 w-24 bg-muted rounded mt-4 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative h-40 w-40">
                    <Image
                      onClick={() =>{
                        setSelectedImage(String(category.imageUrl))
                        setIsClose(true)
                      }}
                      src={category.imageUrl || "/library.jpg"}
                      alt={language === "en" ? category.name : category.name_ar}
                      fill
                      className="object-cover cursor-zoom-in"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-xl font-semibold">{language === "en" ? category.name : category.name_ar}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {tc("products")}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {category.children?.map((sub) => (
                        <Link 
                          key={sub.id}
                          href={`/categories/${category.id}/${sub.id}`}
                          className="text-xs bg-muted px-2 py-1 rounded-md hover:bg-primary/10"
                        >
                         {language === "en" ? sub.name : sub.name_ar}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/categories/${category.id}`}
                      className="block mt-4 text-sm text-primary hover:underline"
                    >
                      {tc("viewAllProducts")}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
           <div className="col-span-full text-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{tn('title')}</h2>
          <p className="text-muted-foreground mb-6">
              {tn('subTitle')}
          </p>
          <Link href="/categories">
            <Button className="bg-primary hover:bg-primary/90">
              {tn('browseProducts')}
            </Button>
          </Link>
        </div>
        )}
      </div>
      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-start w-full bg-red-500 gap-4 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-muted rounded-md disabled:opacity-50"
          >
            {tc("prev")}
          </button>
          <span>
            {meta.page} / {meta.last_page}
          </span>
          <button
            disabled={page === meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-muted rounded-md disabled:opacity-50"
          >
            {tc("next")}
          </button>
        </div>
      )}
    </div>
    {close && <ImageUpScale src={selecetImage} alt="category image" onClose={() => setIsClose(false)}/>}
        </>

  );
};