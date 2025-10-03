'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
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
import LocaleSwitcher from "../LocaleSwitcher";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";
import { getCartItemsCount } from "@/app/[locale]/cart/helper";

export default function Header() {
  const t = useTranslations("header");
  const tc = useTranslations("common");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [showHeader, setShowHeader] = useState(true);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateCartCount = () => {
      const count = getCartItemsCount();
      setCartItemsCount(count);
    };

    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
    
    const interval = setInterval(updateCartCount, 2000);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) return;
      if (typeof window === "undefined") return;
      const currentY = window.scrollY;
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

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ willChange: "transform" }}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center space-x-2 mr-4 sm:mr-6">
            <Image
              src="/tajer-logo.svg"
              alt="تاجر"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/categories"
              className="text-sm font-medium transition-colors hover:text-primary px-2 py-1"
            >
              {tc("categories")}
            </Link>
            <Link
              href="/companies?search=&page=1"
              className="text-sm font-medium transition-colors hover:text-primary px-2 py-1"
            >
              {tc("companies")}
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary px-2 py-1"
              >
                {tc('dashboard')}
              </Link>
            ) : (
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary px-2 py-1"
              >
                {tc("about")}
              </Link>
            )}
          </nav>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center lg: justify-end space-x-2 sm:space-x-3 flex-1">
          <div className="hidden sm:flex items-center space-x-2">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 hover:bg-muted rounded-md transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 min-w-0 p-0 bg-transparent flex items-center justify-center text-secondary text-sm font-bold"
              >
                {cartItemsCount > 99 ? '99+' : cartItemsCount}
              </Badge>
            )}
          </Link>

          {/* Desktop Auth Buttons */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="max-w-32 truncate">
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
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/register">
                <Button className="bg-secondary hover:bg-secondary/90 text-sm px-3 py-2 h-9">
                  {t("register")}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="text-sm px-3 py-2 h-9">
                  {t("login")}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
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
<div className="flex items-center lg:hidden justify-between p-2 border-t">
                <ThemeToggle />
                <LocaleSwitcher />
              </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-3">
                <Link
                  href="/categories"
                  className="text-base font-medium transition-colors hover:text-primary py-2 px-3 rounded-lg hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tc("categories")}
                </Link>
                <Link
                  href="/companies"
                  className="text-base font-medium transition-colors hover:text-primary py-2 px-3 rounded-lg hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tc("companies")}
                </Link>
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="text-base font-medium transition-colors hover:text-primary py-2 px-3 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tc('dashboard')}
                  </Link>
                ) : (
                  <Link
                    href="/about"
                    className="text-base font-medium transition-colors hover:text-primary py-2 px-3 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tc("about")}
                  </Link>
                )}
              </div>

              {/* Mobile Cart Button */}
              <Link 
                href="/cart" 
                className="relative"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" className="w-full justify-center gap-2 py-3">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    {t("cart")}
                  </div>
                 
                </Button>
              </Link>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-2">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full justify-center py-3"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 ml-2" />
                    {t("logout")}
                  </Button>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* Mobile Theme & Locale */}
              
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}