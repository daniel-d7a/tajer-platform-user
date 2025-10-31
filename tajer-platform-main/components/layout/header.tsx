"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Search,
  Trash2,
  Clock,
  Tag,
  Package,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import LocaleSwitcher from "../LocaleSwitcher";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";
import { getCartItemsCount } from "@/app/[locale]/cart/helper";
import { Input } from "../ui/input";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Suggestion {
  id: string;
  name: string;
  name_ar: string;
  type: "category" | "product";
  imageUrl?: string;
}
type Offer = {
  id: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  imageUrl: string;
  expiresAt: string;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  unitType: string;
  piecePrice: number;
  packPrice: number;
  piecesPerPack: number;

  categories: {
    id: number;
    name: string;
    name_ar: string;
  }[];
  manufacturer: string;
  factory: {
    name: string;
    name_ar: string;
  };
  discountType?: string;
  discountAmount?: number;
};
interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  count: number;
  name_ar: string;
}
export default function Header() {
  const t = useTranslations("header");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [language, setLanguage] = useState("en");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [showHeader, setShowHeader] = useState(true);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const lastScrollY = useRef(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0];
    setLanguage(lang);
  }, [pathname]);

  const isRTL = language === "ar";

  useEffect(() => {
    const updateCartCount = () => {
      const count = getCartItemsCount();
      setCartItemsCount(count);
    };

    updateCartCount();

    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    const interval = setInterval(updateCartCount, 2000);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) return;
      const currentY = window.scrollY;

      setShowSuggestions(false);

      if (currentY < 36) {
        setShowHeader(true);
        lastScrollY.current = currentY;
        return;
      }

      if (currentY > lastScrollY.current && currentY > 36) {
        setShowHeader(false);
      } else if (currentY < lastScrollY.current) {
        setShowHeader(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing recent searches:", error);
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
    setIsLoading(true);
    try {
      const categoriesResponse = await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/public/all_categories?search=${encodeURIComponent(
          query
        )}`
      );
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData && categoriesData.length > 0) {
          const categorySuggestions: Suggestion[] = categoriesData
            .slice(0, 5)
            .map((category: Category) => ({
              id: category.id,
              name: category.name,
              name_ar: category.name_ar,
              type: "category",
              imageUrl: category.imageUrl,
            }));
          setSuggestions(categorySuggestions);
          setIsLoading(false);
          return;
        }
      }

      const productsResponse = await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/public/all_products?categoryId=&factoryId=&search=${encodeURIComponent(
          query
        )}`
      );

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        if (productsData && productsData.length > 0) {
          const productSuggestions: Suggestion[] = productsData
            .slice(0, 5)
            .map((product: Offer) => ({
              id: product.id,
              name: product.name,
              name_ar: product.name_ar,
              type: "product",
              imageUrl: product.imageUrl,
            }));
          setSuggestions(productSuggestions);
        } else {
          setSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
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
      handleSuggestionClick(getSuggestionName(suggestion), suggestion.type);
    } else {
      const recentIndex = index - suggestions.length;
      handleSuggestionClick(recentSearches[recentIndex]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = searchValue.trim();

    if (!trimmedValue) {
      setShowSuggestions(false);
      return;
    }

    const updated = [
      trimmedValue,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== trimmedValue.toLowerCase()
      ),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    router.push("/products?search=" + encodeURIComponent(trimmedValue));
  };

  const handleSuggestionClick = (
    value: string,
    type?: "category" | "product"
  ) => {
    setSearchValue(value);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);

    if (type === "category") {
      router.push(`/categories?search=${encodeURIComponent(value)}`);
    } else {
      router.push("/products?search=" + encodeURIComponent(value));
    }
  };

  const handleDeleteSearch = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== value);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
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

  const getSuggestionIcon = (type: "category" | "product") => {
    return type === "category" ? (
      <Tag className="h-4 w-4 text-green-600 flex-shrink-0" />
    ) : (
      <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
    );
  };

  const getSuggestionName = (suggestion: Suggestion) => {
    return isRTL && suggestion.name_ar ? suggestion.name_ar : suggestion.name;
  };

  const getSuggestionTypeText = (type: "category" | "product") => {
    return type === "category" ? tc("category") : tc("product");
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ willChange: "transform" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center flex-1 min-w-0">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/tajer-logo.svg"
              alt="تاجر"
              width={80}
              height={80}
              className="w-16 h-16 lg:w-20 lg:h-20"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 ml-4 lg:ml-6">
            <Link
              href="/categories"
              className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
            >
              {tc("categories")}
            </Link>
            <Link
              href="/companies?search=&page=1"
              className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
            >
              {tc("companies")}
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
              >
                {tc("dashboard")}
              </Link>
            ) : (
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
              >
                {tc("about")}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex-1 flex justify-center  px-2 lg:px-4 max-w-xl">
          <div ref={searchRef} className="relative w-full">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Search
                  className={`absolute ${
                    isRTL ? "left-3" : "right-3"
                  } top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
                />
                <Input
                  ref={inputRef}
                  placeholder={t("searchPlaceholder")}
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowSuggestions(true);
                    setActiveSuggestionIndex(-1);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className={`hover:ring-1 hover:ring-primary ${isRTL ? "pl-10" : "pr-10"} w-full`}
                />
              </div>
            </form>

            {showSuggestions &&
              (suggestions.length > 0 ||
                recentSearches.length > 0 ||
                isLoading) && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.length > 0 && (
                    <>
                      <div className="p-2 border-b border-border">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          {t("suggestions")}
                        </p>
                      </div>
                      <div className="py-1">
                        {suggestions.map((suggestion, idx) => (
                          <button
                            key={`${suggestion.type}-${suggestion.id}`}
                            type="button"
                            onClick={() =>
                              handleSuggestionClick(
                                getSuggestionName(suggestion),
                                suggestion.type
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
                              getSuggestionIcon(suggestion.type)
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="truncate">
                                {highlightMatch(
                                  getSuggestionName(suggestion),
                                  searchValue
                                )}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground capitalize flex-shrink-0">
                              {getSuggestionTypeText(suggestion.type)}
                            </span>
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
                          {t("recentSearches")}
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

                  {/* Loading State */}
                  {isLoading && (
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
        </div>
          <div className="flex gap-2 items-center border-primary border- p-3">
            <p>{user?.walletBalance.toFixed(2) || 0} {tc('coins')}</p>
            <Wallet className="w-5 h-5 text-primary "/>
          </div>
        <div className="flex items-center justify-end flex-1 min-w-0 gap-1 lg:gap-2">
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>

          <Link
            href="/cart"
            className="relative p-2 hover:bg-muted rounded-md transition-colors flex-shrink-0"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 min-w-0 p-0 bg-transparent flex items-center justify-center text-secondary text-sm font-bold"
              >
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </Badge>
            )}
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center gap-2 min-w-0 max-w-32"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {user?.commercialName || t("profile")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    {t("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/orders" className="cursor-pointer">
                    {t("orders")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/register">
                <Button className="bg-secondary hover:bg-secondary/90 text-sm px-3 py-2 h-9 whitespace-nowrap">
                  {t("register")}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-sm px-3 py-2 h-9 whitespace-nowrap"
                >
                  {t("login")}
                </Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">{t("menu")}</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center justify-between p-3 border-t border-border mt-2">
        <ThemeToggle />
        <LocaleSwitcher />
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <div className="relative" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search
                      className={`absolute ${
                        isRTL ? "left-3" : "right-3"
                      } top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground`}
                    />
                    <Input
                      placeholder={t("searchPlaceholder")}
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setShowSuggestions(true);
                        setActiveSuggestionIndex(-1);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className={`${isRTL ? "pl-10" : "pr-10"} w-full`}
                    />
                  </div>
                </form>

                {showSuggestions &&
                  (suggestions.length > 0 ||
                    recentSearches.length > 0 ||
                    isLoading) && (
                    <div className="absolute top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {suggestions.length > 0 && (
                        <>
                          <div className="p-2 border-b border-border">
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                              <Package className="h-3 w-3" />
                              {t("suggestions")}
                            </p>
                          </div>
                          <div className="py-1">
                            {suggestions.map((suggestion) => (
                              <button
                                key={`${suggestion.type}-${suggestion.id}`}
                                type="button"
                                onClick={() =>
                                  handleSuggestionClick(
                                    getSuggestionName(suggestion),
                                    suggestion.type
                                  )
                                }
                                className={`w-full px-3 py-3 text-base hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                                  isRTL ? "text-right" : "text-left"
                                } border-b border-border last:border-b-0`}
                              >
                                {suggestion.imageUrl ? (
                                  <Image
                                    src={suggestion.imageUrl}
                                    alt={getSuggestionName(suggestion)}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                                  />
                                ) : (
                                  getSuggestionIcon(suggestion.type)
                                )}
                                <div className="flex-1 min-w-0">
                                  <span className="truncate">
                                    {highlightMatch(
                                      getSuggestionName(suggestion),
                                      searchValue
                                    )}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground capitalize flex-shrink-0">
                                  {getSuggestionTypeText(suggestion.type)}
                                </span>
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
                              {t("recentSearches")}
                            </p>
                          </div>
                          <div className="py-1">
                            {recentSearches.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSuggestionClick(item)}
                                className="w-full px-3 py-3 text-base hover:bg-muted/50 transition-colors flex justify-between items-center group border-b border-border last:border-b-0"
                              >
                                <span
                                  className={`flex items-center gap-3 ${
                                    isRTL ? "flex-row-reverse" : ""
                                  }`}
                                >
                                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <span>
                                    {highlightMatch(item, searchValue)}
                                  </span>
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

                      {/* Loading State */}
                      {isLoading && (
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

              <div className="flex flex-col space-y-2">
                <Link
                  href="/categories"
                  className="py-3 px-4 hover:bg-muted rounded-md transition-colors text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tc("categories")}
                </Link>
                <Link
                  href="/companies"
                  className="py-3 px-4 hover:bg-muted rounded-md transition-colors text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tc("companies")}
                </Link>
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="py-3 px-4 hover:bg-muted rounded-md transition-colors text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tc("dashboard")}
                  </Link>
                ) : (
                  <Link
                    href="/about"
                    className="py-3 px-4 hover:bg-muted rounded-md transition-colors text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tc("about")}
                  </Link>
                )}
              </div>

              <Link
                href="/cart"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2 py-3"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{t("cart")}</span>
                  {cartItemsCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {isAuthenticated ? (
                <Button
                  variant="outline"
                  className="w-full justify-center py-3"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 ml-2" />
                  {t("logout")}
                </Button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/login" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-center py-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 ml-2" />
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button
                      className="w-full bg-secondary hover:bg-secondary/90 justify-center py-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("register")}
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
