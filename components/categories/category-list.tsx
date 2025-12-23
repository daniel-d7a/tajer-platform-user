"use client";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
interface SubCategory {
  id: number;
  name: string;
  name_ar: string;
}

interface Category {
  id: number;
  name: string;
  name_ar: string;
  imageUrl: string;
  children?: SubCategory[];
}

interface Meta {
  page: number;
  last_page: number;
  total: number;
}

export default function CategoryList({ search }: { search: string }) {
  const tc = useTranslations("common");
  const tn = useTranslations("noCategories");
  const [language, setLanguage] = useState("en");
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0];
    setLanguage(lang);
  }, [pathname]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setVisibleItems(new Set());
      try {
        const res = await fetch(
          `https://tajer-platform-api.eyadabdou862.workers.dev/api/public/categories?limit=&page=${page}&search=${search}`
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
    // eslint-disable-next-line
  }, [page, currentSearch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setTimeout(() => {
              setVisibleItems((prev) => new Set(prev).add(index));
            }, index * 100);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    itemsRef.current.forEach((item, index) => {
      if (item) {
        item.setAttribute("data-index", index.toString());
        observer.observe(item);
      }
    });

    return () => {
      itemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, [categories, loading]);

  const isItemVisible = (index: number) => visibleItems.has(index);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    if (!meta) return [];

    const pages = [];
    const totalPages = meta.last_page;
    const currentPage = page;

    pages.push(1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push(-1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push(-2);
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="overflow-hidden animate-pulse">
                <div className="w-full h-56 md:h-64 lg:h-72 xl:h-80 bg-mutedcard animate-pulse"></div>
              </Card>
            ))
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={category.id}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className={`
                  transform transition-all duration-700 ease-out
                  ${
                    isItemVisible(index)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }
                `}
              >
                <Link
                  href={`/categories/${category.id}`}
                  className="block rounded-md w-full"
                >
                  <div className="relative w-full h-56 md:h-64 lg:h-72 xl:h-80 rounded-md overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-500">
                    <Image
                      src={category.imageUrl || "/coffee.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                      <div className="transform group-hover:scale-105 transition-transform duration-300">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg mb-2">
                          {language === "en" ? category.name : category.name_ar}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div
              ref={(el) => {
                itemsRef.current[0] = el;
              }}
              className={`
                col-span-full text-center py-16 transform transition-all duration-700 ease-out
                ${
                  isItemVisible(0)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }
              `}
            >
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">{tn("title")}</h2>
              <p className="text-muted-foreground mb-6">{tn("subTitle")}</p>
              <Link href="/categories">
                <Button className="bg-primary hover:bg-primary/90 transform transition-transform hover:scale-105 duration-300">
                  {tn("browseProducts")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t mt-6">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft
                  className={`h-4 w-4 ${
                    language === "ar" ? "rotate-180" : "rotate-0"
                  }`}
                />
                {tc("previous")}
              </Button>

              <div className="flex gap-1 mx-2">
                {getPageNumbers().map((pageNum) =>
                  pageNum === -1 || pageNum === -2 ? (
                    <span key={`ellipsis-${pageNum}`} className="px-2 py-1">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === meta.last_page}
                className="flex items-center gap-1"
              >
                {tc("next")}
                <ChevronRight
                  className={`h-4 w-4 ${
                    language === "ar" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
