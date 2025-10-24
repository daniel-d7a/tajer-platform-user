"use client";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "@/i18n/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Boxes, Search, Clock, Trash2, Factory } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ImageUpScale from "@/components/ImageUpScale";
import Image from "next/image";

interface Company {
  id: number;
  name: string;
  name_ar: string;
  discountAmount: number;
  discountType: string | null;
  imageUrl: string | null;
  image_public_id: string | null;
}

interface Suggestion {
  id: number;
  name: string;
  name_ar: string;
  imageUrl?: string | null;
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
  const t = useTranslations("factories");
  const tc = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const th = useTranslations("header");

  const search = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState<string>(search || "");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const page = Number(searchParams.get("page")) || 1;
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
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
    const stored = localStorage.getItem("recentFactorySearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing recent factory searches:", error);
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
        `https://tajer-backend.tajerplatform.workers.dev/api/admin/factories?page=1&limit=5&search=${encodeURIComponent(
          query
        )}`
      );

      if (response.ok) {
        const data: ApiResponse = await response.json();

        if (data.data && data.data.length > 0) {
          const factorySuggestions: Suggestion[] = data.data.map(
            (factory: Company) => ({
              id: factory.id,
              name: factory.name,
              name_ar: factory.name_ar,
              imageUrl: factory.imageUrl,
            })
          );
          setSuggestions(factorySuggestions);
        } else {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching factory suggestions:", error);
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
    localStorage.setItem("recentFactorySearches", JSON.stringify(updated));
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
    localStorage.setItem("recentFactorySearches", JSON.stringify(updated));

    router.push(`${pathname}?search=${encodeURIComponent(value)}&page=1`);
  };

  const handleDeleteSearch = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== value);
    setRecentSearches(updated);
    localStorage.setItem("recentFactorySearches", JSON.stringify(updated));
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

  useEffect(() => {
    const fetchFactory = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://tajer-backend.tajerplatform.workers.dev/api/admin/factories?page=${page}&limit=20&search=${search}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const json: ApiResponse = await res.json();
        setCompanies(json.data || []);
        setMeta(json.meta || meta);
      } catch (error) {
        console.error("Error fetching factories:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFactory();
    //eslint-disable-next-line
  }, [page, search]);

  const hasDiscount = (company: Company) => {
    return company.discountAmount > 0 && company.discountType;
  };

  const getDiscountText = (company: Company) => {
    if (!hasDiscount(company)) return null;

    if (company.discountType === "percentage") {
      return `${company.discountAmount}% ${t("off") || "Off"}`;
    } else {
      return `${company.discountAmount} ${tc("coins")} ${t("off") || "Off"}`;
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("Registeredcompanies")}
        </h2>

        <div ref={searchRef} className="relative mb-6">
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
                        <Factory className="h-3 w-3" />
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
                              width={300}
                              height={300}
                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <Factory className="h-4 w-4 text-orange-600 flex-shrink-0" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  className="bg-background border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center animate-fadeIn relative"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  {hasDiscount(company) && (
                    <Badge className="absolute top-2 right-2 bg-primary z-10">
                      {getDiscountText(company)}
                    </Badge>
                  )}
                  <Avatar className="w-full h-32 mb-4 cursor-zoom-in">
                    <AvatarImage
                      className="w-full h-full object-contain rounded-lg"
                      src={company.imageUrl || "/supermarket1.jpg"}
                      onClick={() => {
                        setOpen(true);
                        setSelectedImage(
                          company.imageUrl || "/supermarket1.jpg"
                        );
                      }}
                      alt={
                        language === "ar"
                          ? company.name_ar
                          : company.name || t("name")
                      }
                    />
                  </Avatar>
                  <h3 className="text-xl font-semibold text-center mb-2">
                    {language === "ar" ? company.name_ar : company.name}
                  </h3>
                  <Link
                    href={`/companies/${company.id}`}
                    className="flex items-center justify-center gap-2 mt-3 bg-primary w-full text-center text-white px-4 py-2 rounded-md transition-colors hover:bg-primary/90"
                  >
                    {t("Details")} <Boxes className="w-4 h-4" />
                  </Link>
                </div>
              ))}
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
              (p) => (
                <Link
                  key={p}
                  href={`?search=${encodeURIComponent(search)}&page=${p}`}
                  scroll={true}
                >
                  <Button
                    variant={p === page ? "default" : "outline"}
                    className="px-4 py-2 text-sm"
                  >
                    {p}
                  </Button>
                </Link>
              )
            )}
          </div>
        )}

        {!loading && companies.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t("noCompaniesFound") || "No companies found"}
            </p>
          </div>
        )}
      </div>

      {selectedImage && open && (
        <ImageUpScale
          alt=""
          src={selectedImage}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
