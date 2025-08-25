"use client";

import React, { useEffect, useState } from "react";
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

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
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
  };
  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar pathname={pathname} />
      </div>
      {/* Main Content */}
      <div className="w-full md:w-4/5 flex-1">
        <div className="p-5 w-full space-y-8 ">
          <h1 className="text-3xl">
            مرحبا <strong>{userData?.commercialName ?? "مستخدم"} !</strong>
          </h1>
          <h3 className="text-ring">إحصائيات مفصلة عن أداء متجرك !</h3>
        </div>
        <div className="p-5 w-full">
          {children}
        </div>
      </div>
      <BottomNavMobile showMore={showMore} setShowMore={setShowMore} pathname={pathname} />
    </div>
  );
};

type SidebarProps = {
  pathname: string | null;
};

const sidebarLinks = [
  { label: "الرئيسية", icon: <House />, href: "/dashboard" },
  { label: "الفواتير", icon: <TicketSlash />, href: "/dashboard/invoice" },
  { label: "السلة", icon: <ShoppingCart />, href: "/cart" },
  { label: "الطلبات", icon: <Truck />, href: "/dashboard/orders" },
  { label: "الإعدادات", icon: <Settings />, href: "/dashboard/settings" },
];
type BottomNavMobileProps = {
  showMore: boolean;
  setShowMore: (v: boolean) => void;
  pathname: string | null;
};

const BottomNavMobile: React.FC<BottomNavMobileProps> = ({ showMore, setShowMore, pathname }) => {
  const mainLinks = sidebarLinks.slice(0, 4);
  const moreLinks = sidebarLinks.slice(4);
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex md:hidden justify-between px-2 py-1 shadow-lg">
        {mainLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center flex-1 py-1 px-2 text-xs ${pathname === item.href ? "text-primary" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          className="flex flex-col items-center flex-1 py-1 px-2 text-xs text-gray-600"
          onClick={() => setShowMore(!showMore)}
        >
          <Settings />
          <span>المزيد</span>
        </button>
      </nav>
      {showMore && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:hidden" onClick={() => setShowMore(false)}>
          <div className="w-full bg-background rounded-t-xl p-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">المزيد من الصفحات</h3>
            <div className="flex flex-col gap-2">
              {moreLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 p-2 rounded-md ${pathname === item.href ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setShowMore(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <button className="mt-4 w-full py-2 rounded-md border border-gray-400 hover:bg-gray-200" onClick={() => setShowMore(false)}>
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};
const Sidebar: React.FC<SidebarProps> = ({ pathname }) => {
  return (
    <div className="min-w-[10vw] w-1/5 h-full lg:min-w-[270px]">
      <aside className="w-1/5  fixed h-screen border-l p-4 bg-background font-cairo flex flex-col items-center">
      <h2 className="text-2xl font-bold h-[15%] mb-6">Tajer Dashboard</h2>
      <nav className="w-full flex flex-col gap-2 justify-center items-center ">
        {sidebarLinks.map((item) => (
          <SidebarButton 
            key={item.href}
            label={item.label}
            icon={item.icon}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
      </nav>
    </aside>
    </div>
  );
};

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
      className={`w-full shadow-sm rounded-lg text-xl flex p-2 items-center gap-3 duration-300  text-center justify-center 
        ${active ? "text-primary " : "hover:text-secondary"}`}
      style={{ justifyContent: 'center' }}
    >
      <span className="w-7 h-7 flex items-center justify-center ">{icon}</span>
      <span className="w-[30%]">{label}</span>
    </Link>
  );
};