"use client";
import ProductGrid from "@/components/products/product-grid";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { Clock, Package, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  name_ar: string;
  parentId: null;
  imageUrl: null;
  image_public_id: null;
  children: [
    {
      id: number;
      name: string;
      name_ar: string;
      parentId: null;
      imageUrl: null;
      image_public_id: null;
    }
  ];
}

interface Suggestion {
  id: string;
  name: string;
  name_ar: string;
  imageUrl?: string;
}

interface ProductsData {
  data: [
    {
      id: number;
      barcode: null;
      name: string;
      name_ar: string;
      description: null;
      description_ar: null;
      unitType: "piece_only" | "pack_only" | "piece_or_pack" | string;
      piecePrice: null;
      packPrice: null;
      piecesPerPack: null;
      factoryId: number;
      imageUrl: null;
      image_public_id: null;
      minOrderQuantity: null;
      discountAmount: null;
      discountType: "percentage" | "fixed_amount" | string;
    }
  ];
  meta: {
    from: number;
    to: number;
    page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export default function Page() {
  const t = useTranslations("categories");
  const th = useTranslations("header");
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const pathname = usePathname();
  const [data, setData] = useState<Product>();
  const [isVisible, setIsVisible] = useState(false);
  const [searchValue, setSearchValue] = useState(currentSearch);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const { id } = useParams();

  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || "en";
    setLanguage(lang);
  }, [pathname]);

  const isRTL = language === "ar";

  useEffect(() => {
    const stored = localStorage.getItem("recentProductSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing recent product searches:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return;

      const totalItems = suggestions.length + recentSearches.length;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < totalItems - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : totalItems - 1
        );
      } else if (e.key === "Tab" && suggestions.length > 0) {
        e.preventDefault();
        const firstSuggestion = suggestions[0];
        setSearchValue(getSuggestionName(firstSuggestion));
        setActiveSuggestionIndex(0);
      } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
        e.preventDefault();
        handleSuggestionSelect(activeSuggestionIndex);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showSuggestions, suggestions, recentSearches, activeSuggestionIndex]);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(
          `https://tajer-platform-api.eyadabdou862.workers.dev/api/public/products?categoryId=${id}&factoryId=&search=${encodeURIComponent(
            query
          )}&page=1&limit=5`
        );

        if (response.ok) {
          const data: ProductsData = await response.json();

          if (data.data && data.data.length > 0) {
            const productSuggestions: Suggestion[] = data.data.map(
              (product: ProductsData["data"][number]) => ({
                id: String(product.id),
                name: product.name,
                name_ar: product.name_ar,
                imageUrl: product.imageUrl ?? undefined,
              })
            );
            setSuggestions(productSuggestions);
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching product suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchValue.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(searchValue);
      }, 1000);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue, fetchSuggestions]);

  const handleSuggestionSelect = (index: number) => {
    if (index < suggestions.length) {
      const suggestion = suggestions[index];
      handleSuggestionClick(getSuggestionName(suggestion));
    } else {
      const recentIndex = index - suggestions.length;
      handleSuggestionClick(recentSearches[recentIndex]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = searchValue.trim();

    if (!trimmedValue) {
      setShowSuggestions(false);
      router.push(`?page=1`);
      return;
    }

    const updated = [
      trimmedValue,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== trimmedValue.toLowerCase()
      ),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentProductSearches", JSON.stringify(updated));
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    router.push(`?search=${encodeURIComponent(trimmedValue)}&page=1`);
  };

  const handleSuggestionClick = (value: string) => {
    setSearchValue(value);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);

    const updated = [
      value,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== value.toLowerCase()
      ),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentProductSearches", JSON.stringify(updated));

    router.push(`?search=${encodeURIComponent(value)}&page=1`);
  };

  const handleDeleteSearch = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== value);
    setRecentSearches(updated);
    localStorage.setItem("recentProductSearches", JSON.stringify(updated));
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
      <>
        {before}
        <strong className="font-semibold text-primary">{match}</strong>
        {after}
      </>
    );
  };

  const getSuggestionName = (suggestion: Suggestion) => {
    return isRTL && suggestion.name_ar ? suggestion.name_ar : suggestion.name;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://tajer-platform-api.eyadabdou862.workers.dev/api/public/categories/${id}`
      );
      const json = await res.json();
      if (res.ok) {
        setData(json);
        setTimeout(() => {
          setIsVisible(true);
        }, 100);
      } else {
        toast.error("something went wrong please try to show more");
      }
    } catch {
      toast.error("somehting went wrong please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const hasChildren = data?.children && data.children.length > 0;

  return (
    <div className="flex flex-col gap-5 py-10 mx-auto">
      {!loading && (
        <h1 className="text-3xl font-bold text-center p-5">
          {language === "ar"
            ? hasChildren
              ? `التصنيفات الفرعية لـ ${data?.name_ar}`
              : `المنتجات من  ${data?.name_ar}`
            : hasChildren
            ? `Sub Categories for ${data?.name}`
            : `Products in ${data?.name}`}
        </h1>
      )}

      {loading ? (
        <div>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden animate-pulse">
              <div className="w-full h-56 md:h-64 lg:h-72 xl:h-80 bg-muted"></div>
            </Card>
          ))}
        </div>
      ) : hasChildren ? (
        <div>
          {data?.children?.map((children, index) => (
            <Link
              key={children.id}
              href={`/categories/${id}/${children.id}`}
              className={`
                block transform transition-all duration-700 ease-out
                ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }
              `}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="relative w-full h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-500">
                <Image
                  src={children.imageUrl || "/coffee.jpg"}
                  alt={children.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                  <div className="transform group-hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg mb-2">
                      {language === "en" ? children.name : children.name_ar}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-5">
          <div ref={searchRef} className="relative mb-6 mx-auto">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search
                  className={`absolute ${
                    isRTL ? "left-3" : "right-3"
                  } top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground`}
                />
                <Input
                  ref={inputRef}
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowSuggestions(true);
                    setActiveSuggestionIndex(-1);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={t("searchPlaceholderProducts")}
                  className={isRTL ? "pl-10" : "pr-10"}
                />
              </div>
            </form>

            {showSuggestions &&
              (suggestions.length > 0 ||
                recentSearches.length > 0 ||
                isLoadingSuggestions) && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.length > 0 && (
                    <>
                      <div className="p-2 border-b border-border">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          {th("suggestions")}
                        </p>
                      </div>
                      <div className="py-1">
                        {suggestions.map((suggestion, idx) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onClick={() =>
                              handleSuggestionClick(
                                getSuggestionName(suggestion)
                              )
                            }
                            className={`w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                              isRTL ? "text-right" : "text-left"
                            } ${
                              activeSuggestionIndex === idx ? "bg-muted/50" : ""
                            }`}
                          >
                            {suggestion.imageUrl ? (
                              <Image
                                src={suggestion.imageUrl}
                                alt={getSuggestionName(suggestion)}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded object-cover flex-shrink-0"
                              />
                            ) : (
                              <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="truncate">
                                {highlightMatch(
                                  getSuggestionName(suggestion),
                                  searchValue
                                )}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {suggestions.length > 0 && recentSearches.length > 0 && (
                    <div className="border-t border-border my-1" />
                  )}

                  {recentSearches.length > 0 && (
                    <>
                      <div className="p-2 border-b border-border">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {th("recentSearches")}
                        </p>
                      </div>
                      <div className="py-1">
                        {recentSearches.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSuggestionClick(item)}
                            className={`w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex justify-between items-center group ${
                              activeSuggestionIndex === suggestions.length + idx
                                ? "bg-muted/50"
                                : ""
                            }`}
                          >
                            <span
                              className={`flex items-center gap-3 ${
                                isRTL ? "flex-row-reverse" : ""
                              }`}
                            >
                              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span>{highlightMatch(item, searchValue)}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSearch(item, e)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {isLoadingSuggestions && (
                    <div className="p-3">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>

          <ProductGrid categoryId={Number(id)} factoryId={0} />
        </div>
      )}
    </div>
  );
}
