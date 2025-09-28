"use client";

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

export default function Header() {
  const t = useTranslations("header");
  const tc = useTranslations("common");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

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

  interface User {
    name: string;
    email: string;
    role: "admin" | "trader" | "sales";
    commercialName?: string; 
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ willChange: "transform" }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 ml-6 flex items-center space-x-2">
            <Image
              src="/tajer-logo.svg"
              alt="تاجر"
              width={60}
              height={60}
              className="ml-2"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 ">
            <Link
              href="/categories"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {tc("categories")}
            </Link>
            <Link
              href="/companies?search=&page=1"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {tc("companies")}
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {tc('dashboard')}
              </Link>
            ) : (
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {tc("about")}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LocaleSwitcher />

          <Link href="/cart" className="hidden md:flex">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">{t("cart")}</span>
            </Button>
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex">
                  <User className="h-4 w-4 ml-2" />
                  {user?.commercialName || t("profile")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">{t("profile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/orders">{t("orders")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 ml-2" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/register" className="hidden md:flex">
                <Button className="bg-secondary hover:bg-secondary/90">
                  {t("register")}
                </Button>
              </Link>

              <Link href="/login" className="hidden md:flex">
                <Button  variant="outline">
                  {t("login")}
                </Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
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
      {isMenuOpen && (
        <div className="container md:hidden mx-auto w-[80%]  ">
          <nav className="flex flex-col space-y-4 py-4 items-center">
            <Link
              href="/categories"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {tc("categories")}
            </Link>
            <Link
              href="/companies"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {tc("companies")}
            </Link>
          {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {tc('dashboard')}
              </Link>
            ) : (
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {tc("about")}
              </Link>
            )}

            <Link href="/cart" className="w-full">
              <Button variant="outline" className="w-full">
                <ShoppingCart className="h-5 w-5 ml-2" />
                {t("cart")}
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 ml-2" />
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    <User className="h-5 w-5 ml-2" />
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-secondary hover:bg-secondary/90">
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}
            <div className="flex justify-center pt-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};