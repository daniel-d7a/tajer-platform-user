'use client';

import { useState, useEffect, useRef } from "react";
import {Link} from '@/i18n/navigation';
import Image from "next/image";
import { Menu, X, ShoppingCart, User, LogOut, Search, Trash2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import LocaleSwitcher from "../LocaleSwitcher";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";
import { getCartItemsCount } from "@/app/[locale]/cart/helper";
import { Input } from "../ui/input";
import { useSearchParams } from "next/navigation";

export default function Header() {
  const t = useTranslations("header");
  const tc = useTranslations("common");
  const searchParams = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [showHeader, setShowHeader] = useState(true);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ||"");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const lastScrollY = useRef(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

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
      
      // إخفاء الـ suggestions عند التمرير
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = searchValue.trim();
    
    if (!trimmedValue) {
      setShowSuggestions(false);
      return;
    }

    const updated = [
      trimmedValue,
      ...recentSearches.filter(item => 
        item.toLowerCase() !== trimmedValue.toLowerCase()
      )
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setShowSuggestions(false);
    router.push('/products?search=' + encodeURIComponent(trimmedValue));
  };

  const handleSuggestionClick = (value: string) => {
    setSearchValue(value);
    setShowSuggestions(false);
    router.push('/products?search=' + encodeURIComponent(value));
  };

  const handleDeleteSearch = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(item => item !== value);
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

        <div className="flex-1 flex justify-center px-2 lg:px-4 max-w-xl">
          <div ref={searchRef} className="relative w-full">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pr-10 w-full"
                />
              </div>
            </form>

            {showSuggestions && recentSearches.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-border">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t('RecentSearch')}
                  </p>
                </div>
                <div className="py-1 ">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full px-3 py-2 text-sm  hover:bg-muted/50 transition-colors flex justify-between items-center "
                    >
                      <span className="text-left">
                        {highlightMatch(item, searchValue)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSearch(item, e)}
                        className="opacity-100 transition-opacity p-1 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 " />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                <Button variant="ghost" className="hidden md:flex items-center gap-2 min-w-0 max-w-32">
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
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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
                <Button variant="outline" className="text-sm px-3 py-2 h-9 whitespace-nowrap">
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
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{t("menu")}</span>
          </Button>
        </div>
      </div>
      
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
                    <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search here..."
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="pr-10 w-full"
                    />
                  </div>
                </form>

                {showSuggestions && recentSearches.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div className="p-2 border-b border-border">
                      <p className="text-xs font-medium text-muted-foreground">
                        Recent Searches
                      </p>
                    </div>
                    <div className="py-1">
                      {recentSearches.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full px-3 py-3 text-base text-start hover:bg-muted/50 transition-colors flex items-center justify-between group border-b border-border last:border-b-0"
                        >
                          <span className="flex-1 text-left">
                            {highlightMatch(item, searchValue)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSearch(item, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </button>
                      ))}
                    </div>
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
                <Button variant="outline" className="w-full justify-center gap-2 py-3">
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
                    <Button variant="outline" className="w-full justify-center py-3" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-5 w-5 ml-2" />
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 justify-center py-3" onClick={() => setIsMenuOpen(false)}>
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