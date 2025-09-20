"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useTranslations } from "next-intl";
import {
  House,
  TicketSlash,
  Settings,
  Truck,
  ShoppingCart,
} from "lucide-react";

function getNormalizedPath(pathname: string) {
  const parts = pathname.split('/');
  if (["en", "ar"].includes(parts[1])) {
    return '/' + parts.slice(2).join('/');
  }
  return pathname;
}

function isActiveRoute(currentPath: string, linkHref: string) {
  const normalizedPath = getNormalizedPath(currentPath);
  if (linkHref === "/dashboard") {
    return normalizedPath === "/dashboard";
  }
  return normalizedPath === linkHref;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const tc = useTranslations('common');
  const td = useTranslations('dashboard');
  const sidebarLinks = [
    { label: td('labels.main'), icon: <House />, href: "/dashboard" },
    { label: td('labels.invoices'), icon: <TicketSlash />, href: "/dashboard/invoice" },
    { label: td('labels.cart'), icon: <ShoppingCart />, href: "/cart" },
    { label: td('labels.orders'), icon: <Truck />, href: "/dashboard/orders" },
    { label: td('labels.settings'), icon: <Settings />, href: "/dashboard/settings" },
  ];
 
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguage] = useState('en');
  const [userData, setUserData] = useState<{ commercialName?: string } | null>(null);

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || 'en'; 
    setLanguage(lang);
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const data = localStorage.getItem("data");
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">{tc('noSignIn')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className="hidden md:block w-1/5 border-l border-r bg-background">
        <aside className="fixed h-screen w-1/5 p-4 font-cairo flex flex-col gap-5 items-center">
          <h2 className="text-2xl font-bold mb-6">Tajer Dashboard</h2>
          <nav className="w-full flex h-[70%] justify-between flex-col gap-2">
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
      <div className="flex-1 md:w-4/5 p-4 space-y-6 pb-16 md:pb-0">
        <div className="bg-card rounded-2xl shadow-sm p-4">
          <h1 className="text-3xl">
            {tc('welcome')} <strong>{userData?.commercialName || td('defaultUser')}!</strong>
          </h1>
        </div>
        <div className="bg-card rounded-2xl shadow-sm">
          {children}
        </div>
      </div>
      
      <BottomNavMobile pathname={pathname} sidebarLinks={sidebarLinks} />
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
        ${active ? "text-primary shadow-md hover:bg-muted" : ""}`}
    >
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

type BottomNavMobileProps = {
  pathname: string | null;
  sidebarLinks: Array<{ label: string; icon: React.ReactNode; href: string }>;
};

const BottomNavMobile: React.FC<BottomNavMobileProps> = ({ pathname, sidebarLinks }) => {
  return (
    <nav className="fixed bg-background border-t flex md:hidden justify-between px-2 py-2 shadow-lg w-full bottom-0 left-0 z-50">
      {sidebarLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center flex-1 py-1 px-2 text-xs hover:text-secondary transition-all 
            ${isActiveRoute(pathname || "", item.href) ? "text-primary font-bold" : "text-muted-foreground"}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};