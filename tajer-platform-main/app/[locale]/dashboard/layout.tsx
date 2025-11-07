"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useTranslations } from "next-intl";
import {
  House,
  TicketSlash,
  Settings,
  Truck,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

function getNormalizedPath(pathname: string) {
  const parts = pathname.split("/");
  if (["en", "ar"].includes(parts[1])) {
    return "/" + parts.slice(2).join("/");
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tc = useTranslations("common");
  const td = useTranslations("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const sidebarLinks = [
    { label: td("labels.main"), icon: <House />, href: "/dashboard" },
    {
      label: td("labels.invoices"),
      icon: <TicketSlash />,
      href: "/dashboard/invoice",
    },
    { label: td("labels.cart"), icon: <ShoppingCart />, href: "/cart" },
    { label: td("labels.orders"), icon: <Truck />, href: "/dashboard/orders" },
    {
      label: td("labels.settings"),
      icon: <Settings />,
      href: "/dashboard/settings",
    },
  ];

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguage] = useState("en");
  const [userData, setUserData] = useState<{ commercialName?: string } | null>(
    null
  );

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || "en";
    setLanguage(lang);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "userData") {
        const newData = event.newValue ? JSON.parse(event.newValue) : null;
        setUserData(newData);
      }
    };

    const initialData = localStorage.getItem("userData");
    if (initialData) {
      setUserData(JSON.parse(initialData));
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
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
        <p className="text-lg font-medium">{tc("noSignIn")}</p>
      </div>
    );
  }
  return (
    <div
      className="flex min-h-screen w-full bg-background"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Sidebar */}
      <div className={`hidden lg:block bg-background border-r transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <aside className={`sticky top-0 h-fit p-6 font-cairo flex flex-col gap-4 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}>
          {/* Header with toggle button */}
          <div className={`flex items-center justify-between mb-2 ${
            isCollapsed ? 'flex-col gap-2' : ''
          }`}>
            {!isCollapsed && (
              <h2 className="text-2xl font-bold">{tc("DashboardTitle")}</h2>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
              title={isCollapsed ? "فتح القائمة" : "طي القائمة"}
            >
              {language === "ar" ? (
                isCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
              ) : (
                isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <nav className="flex-1 flex flex-col gap-2">
            {sidebarLinks.map((item) => (
              <SidebarButton
                key={item.href}
                label={item.label}
                icon={item.icon}
                href={item.href}
                active={isActiveRoute(pathname, item.href)}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </aside>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out`}>
        <div className="p-4 md:p-6 space-y-6 pb-16 md:pb-0">
          {/* Welcome Header */}
          <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {tc("welcome")} <strong>{userData?.commercialName}!</strong>
            </h1>
          </div>
          {/* Page Content */}
          <div className="min-w-0">{children}</div>
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
  isCollapsed?: boolean;
};

const SidebarButton: React.FC<SidebarButtonProps> = ({
  label,
  icon,
  href,
  active = false,
  isCollapsed = false,
}) => {
  return (
    <Link
      href={href}
      className={`
        relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-base 
         overflow-hidden
        ${
          active
            ? "text-primary hover:text-primary"
            : "text-foreground  hover:text-secondary"
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
      title={isCollapsed ? label : ''}
    >
      {/* Active Indicator Animation */}
     
      <span
        className={`relative z-10 w-5 h-5 flex items-center justify-center transition-transform duration-300 ${
          active ? "scale-110 hover:text-primary" : "scale-100"
        }`}
      >
        {icon}
      </span>

      {!isCollapsed && (
        <span
          className={`relative z-10 font-medium transition-all duration-300 ${
            active ? "translate-x-1" : "translate-x-0"
          }`}
        >
          {label}
        </span>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0  transition-opacity duration-300 rounded-xl" />
    </Link>
  );
};

type BottomNavMobileProps = {
  pathname: string | null;
  sidebarLinks: Array<{ label: string; icon: React.ReactNode; href: string }>;
};

const BottomNavMobile: React.FC<BottomNavMobileProps> = ({
  pathname,
  sidebarLinks,
}) => {
  return (
    <nav className="fixed bg-background border-t flex lg:hidden justify-between px-2 py-3 shadow-lg w-full bottom-0 left-0 z-50">
      {sidebarLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            relative flex flex-col items-center flex-1 py-1 px-2 text-xs transition-all duration-300
            ${
              isActiveRoute(pathname || "", item.href)
                ? "text-primary font-semibold hover:none scale-110"
                : "text-muted-foreground"
            }
          `}
        >
          {/* Mobile Active Indicator */}
          {isActiveRoute(pathname || "", item.href) && (
            <div className="absolute -top-3 w-full h-0.5 bg-primary rounded-full scale-105 transition-all duration-300" />
          )}

          <span
            className={`mb-1 transition-transform duration-300 ${
              isActiveRoute(pathname || "", item.href)
                ? "scale-110"
                : "scale-100"
            }`}
          >
            {item.icon}
          </span>

          <span className="text-[10px] leading-tight transition-all duration-300">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};