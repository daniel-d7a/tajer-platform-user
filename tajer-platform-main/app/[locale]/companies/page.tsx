"use client";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface Company {
  id: number;
  name: string;
  name_ar: string;
  discountAmount: number;
  discountType: string | null;
  imageUrl: string | null;
  image_public_id: string | null;
}

interface ApiResponse {
  data: Company[];
  meta: {
    limit: number;
    offset: number;
    from: number;
    to: number;
    page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [meta, setMeta] = useState<ApiResponse["meta"]>({
    limit: 20,
    offset: 0,
    from: 1,
    to: 0,
    page: 1,
    last_page: 1,
    total: 0,
    per_page: 20,
  });
  const [loading, setLoading] = useState(true);
  const t = useTranslations('factories');
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [language,setLanguage] = useState('en')
  const pathname = usePathname();
      useEffect(() => {
      const segments = pathname.split("/").filter(Boolean);
      const lang = segments[0]; 
      setLanguage(lang)
    }, [pathname]);
  useEffect(() => {
    const fetchFactory = async () => {
      setLoading(true);
      try {
        const res = await fetch(
         'https://tajer-backend.tajerplatform.workers.dev/api/admin/factories?page=1&limit=20&search=',{credentials:'include'}
        );

        const json: ApiResponse = await res.json();
        setCompanies(json.data || []);
        setMeta(json.meta || meta);
      } catch  {
        setCompanies([]);
        setMeta(meta);
      } finally {
        setLoading(false);
      }
    };
    fetchFactory();
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">{t('Registeredcompanies')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-background border rounded-lg shadow-sm p-6 flex flex-col items-center"
              >
                <Skeleton className="w-full h-32 mb-4 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          : companies.map((company, i) => (
              <div
                key={company.id}
                className="bg-background border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center animate-fadeIn"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
              >
                <Avatar className="w-full h-32 mb-4">
                  <AvatarImage
                    className="w-full h-full object-cover rounded-lg"
                    src={company.imageUrl || "/supermarket1.jpg"}
                    alt={language === 'ar' ? company.name : company.name_ar || t('name')}
                  />
                </Avatar>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {language === 'ar' ? company.name : company.name_ar || t('name')}
                </h3>
                <Link
                  href={`/companies/${company.id}`}
                  className="bg-primary w-full text-center text-white px-4 py-2 rounded-md transition-colors"
                >
                  {t('Details')}
                </Link>
              </div>
            ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {Array.from({ length: meta.last_page || 1 }, (_, i) => i + 1).map((p) => (
          <Link key={p} href={`?page=${p}`} scroll={true}>
            <Button variant={p === page ? "default" : "outline"} className="px-4 py-2 text-sm">
              {p}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};