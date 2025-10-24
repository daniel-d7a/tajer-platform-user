"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Clock,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/common/CommonCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Offer = {
  id: number;
  name: string;
  name_ar: string;
  description: string;
  imageUrl: string;
  expiresAt: string;
  discountType: string;
  discountAmount: number;
  piecePrice: number;
  packPrice: number;
  piecesPerPack: number;
  unitType: string;
  minOrderQuantity: number;
  factory: {
    name: string;
    name_ar: string;
  };
};

interface Suggestion {
  id: string;
  name: string;
  name_ar: string;
  imageUrl?: string;
}

interface ApiResponse {
  data: Offer[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
    limit: number;
    offset: number;
    from: number;
    to: number;
  };
}

export default function SpecialOffers() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const to = useTranslations("orders");
  const th = useTranslations("header");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [searchValue, setSearchValue] = useState(search);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const [offersData, setOffersData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [language, setLanguage] = useState("en");

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
    const stored = localStorage.getItem("recentOfferSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing recent offer searches:", error);
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

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/public/offers?categoryId=&search=${encodeURIComponent(
          query
        )}&page=1&limit=5`
      );

      if (response.ok) {
        const data: ApiResponse = await response.json();

        if (data.data && data.data.length > 0) {
          const offerSuggestions: Suggestion[] = data.data.map(
            (offer: Offer) => ({
              id: offer.id.toString(),
              name: offer.name,
              name_ar: offer.name_ar,
              imageUrl: offer.imageUrl,
            })
          );
          setSuggestions(offerSuggestions);
        } else {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching offer suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

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
      router.push(`${pathname}?page=1`);
      return;
    }

    const updated = [
      trimmedValue,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== trimmedValue.toLowerCase()
      ),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentOfferSearches", JSON.stringify(updated));
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    router.push(
      `${pathname}?search=${encodeURIComponent(trimmedValue)}&page=1`
    );
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
    localStorage.setItem("recentOfferSearches", JSON.stringify(updated));

    router.push(`${pathname}?search=${encodeURIComponent(value)}&page=1`);
  };

  const handleDeleteSearch = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== value);
    setRecentSearches(updated);
    localStorage.setItem("recentOfferSearches", JSON.stringify(updated));
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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageNumbers = () => {
    if (!offersData?.meta.last_page) return [];

    const currentPage = page;
    const lastPage = offersData.meta.last_page;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= lastPage; i++) {
      if (
        i === 1 ||
        i === lastPage ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let prev = 0;
    for (const i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://tajer-backend.tajerplatform.workers.dev/api/public/offers?categoryId=&search=${
            search || ""
          }&page=${page}&limit=8`
        );
        const json: ApiResponse = await res.json();
        setOffersData(json);
      } catch (err) {
        console.error("something went wrong", err);
        setErrorMessage(
          t("errorMessage") || "something went wrong, try again later please."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [t, search, page]);

  const tp = useTranslations("specialProducts");
  const tb = useTranslations("buttons");

  return (
    <section className="py-12   mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t("specialOffers")}</h2>
        <p className="mt-2 text-muted-foreground">{t("specialOffersDesc")}</p>
      </div>

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
              placeholder={t("searchPlaceholder")}
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
                          handleSuggestionClick(getSuggestionName(suggestion))
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

      <div className="w-[100%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse h-full p-4">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 flex-grow">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/4" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : offersData?.data && offersData.data.length > 0 ? (
          offersData.data.map((offer) => (
            <ProductCard
              key={offer.id}
              idx={offer.id}
              language={language}
              product={offer}
              type="productGrid"
              t={tp}
              tb={tb}
              tc={tc}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            {t("noOffers")}
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        )}
      </div>

      {/* Pagination */}
      {offersData?.meta && offersData.meta.last_page > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="text-sm text-muted-foreground">
            {to("page")} {page} {to("of")} {offersData.meta.last_page}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {to("previous")}
            </Button>

            <div className="flex gap-1 mx-2">
              {getPageNumbers().map((pageNum, index) =>
                pageNum === "..." ? (
                  <span key={`dots-${index}`} className="px-2 py-1">
                    ...
                  </span>
                ) : (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum as number)}
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
              disabled={page === offersData.meta.last_page}
              className="flex items-center gap-1"
            >
              {to("next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
