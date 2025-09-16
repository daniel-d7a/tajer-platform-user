"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import {
  House,
  TicketSlash,
  Settings,
  Truck,
  ShoppingCart,
} from "lucide-react";

// تأكد أن رابط الإعدادات والروابط كلها تبدأ بـ / وليس localhost
const sidebarLinks = [
  { label: "الرئيسية", icon: <House />, href: "/dashboard" },
  { label: "الفواتير", icon: <TicketSlash />, href: "/dashboard/invoice" },
  { label: "السلة", icon: <ShoppingCart />, href: "/cart" },
  { label: "الطلبات", icon: <Truck />, href: "/dashboard/orders" },
  { label: "الإعدادات", icon: <Settings />, href: "/dashboard/settings" },
];

// دالة تنظف مسار الرابط من لغة الواجهة (locale) مثل /en أو /ar
function getNormalizedPath(pathname: string) {
  const parts = pathname.split('/');
  // parts[0] is '', parts[1] could be 'en' or 'ar'
  if (["en", "ar"].includes(parts[1])) {
    return '/' + parts.slice(2).join('/');
  }
  return pathname;
}

// دالة تحدد الزر النشط (تدعم الروابط الفرعية)
function isActiveRoute(currentPath: string, linkHref: string) {
  const normalizedPath = getNormalizedPath(currentPath);
  if (linkHref === "/dashboard") {
    return normalizedPath === "/dashboard";
  }
  return (
    normalizedPath === linkHref ||
    normalizedPath.startsWith(linkHref + "/")
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const userData = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("data") || "{}")
    : null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">جاري تحويلك لصفحة تسجيل الدخول...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background" dir="rtl">
      {/* Sidebar */}
      <div className="hidden md:block w-1/5 border-l bg-background">
        <aside className="fixed h-screen w-1/5 p-4 font-cairo flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6">Tajer Dashboard</h2>
          <nav className="w-full flex flex-col gap-2">
            {sidebarLinks.map((item) => (
              <SidebarButton
                key={item.href}
                label={item.label}
                icon={item.icon}
                href={item.href}
                active={isActiveRoute(pathname, item.href)}
              />
            ))}
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:w-4/5 p-4 space-y-6">
        <div className="bg-card rounded-2xl shadow-sm">
          <h1 className="text-3xl">
            مرحبا <strong>{userData?.commercialName ?? "مستخدم"} !</strong>
          </h1>
        </div>
        <div className="bg-card rounded-2xl shadow-sm">
          {children}
        </div>
      </div>

      <BottomNavMobile pathname={pathname} />
    </div>
  );
}

type SidebarButtonProps = {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
};

const SidebarButton: React.FC<SidebarButtonProps> = ({
  label,
  icon,
  href,
  active = false,
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all text-lg hover:bg-muted hover:text-secondary
        ${active ? "text-primary  shadow-md hover:bg-muted" : ""}`}
    >
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

type BottomNavMobileProps = {
  pathname: string | null;
};

const BottomNavMobile: React.FC<BottomNavMobileProps> = ({ pathname }) => {
  return (
    <nav className="fixed bg-background border-t flex md:hidden justify-between px-2 py-2 shadow-lg w-full bottom-0 left-0">
      {sidebarLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center flex-1 py-1 px-2 text-xs transition-all 
            ${isActiveRoute(pathname || "", item.href) ? "text-primary font-bold" : "text-muted-foreground"}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};