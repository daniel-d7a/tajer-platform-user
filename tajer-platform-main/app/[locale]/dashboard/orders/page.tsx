"use client";
import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  Truck,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { OrderRow } from "@/components/dashboard/OrderRow";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Merchant {
  commercialName?: string;
}

interface Order {
  id: number;
  merchantId?: number;
  status: string;
  totalValue: number;
  createdAt: string | null;
  merchant: Merchant;
  text_id?: string;
}

interface OrdersResponse {
  data: Order[];
  meta: {
    page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  stats?: {
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
    totalCashback: number;
  };
}

export default function Page() {
  const to = useTranslations("orders");
  const t = useTranslations("dashboard");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<string>("PENDING");
  const [activeBtn, setActiveBtn] = useState<string>("PENDING");
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<OrdersResponse["meta"]>({
    page: 1,
    last_page: 1,
    total: 0,
    per_page: 20,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [language, setLanguage] = useState("en");
  const pathname = usePathname();
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || "en";
    setLanguage(lang);
  }, [pathname]);
  const statuses = [
    {
      value: "PENDING",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      value: "PROCESSING",
      icon: <RefreshCw className="w-4 h-4" />,
    },
    {
      value: "OUT_FOR_DELIVERY",
      icon: <Truck className="w-4 h-4" />,
    },
    {
      value: "DELIVERED",
      icon: <PackageCheck className="w-4 h-4" />,
    },
  ];

  const statusLabels: Record<string, string> = {
    PENDING: to("status.PENDING"),
    PROCESSING: to("status.PROCESSING"),
    OUT_FOR_DELIVERY: to("status.OUT_FOR_DELIVERY"),
    DELIVERED: to("status.Delivered"),
  };

  const page = Number(searchParams.get("page")) || 1;

  const fetchData = async (
    currentPage: number = page,
    limit: number = itemsPerPage
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/orders/orders/user?limit=${limit}&page=${currentPage}&status=${status}&from=2025-06-01T00:00:00+02:00&to=2025-06-30T23:59:59+02:00
`,
        { credentials: "include" }
      );
      const res: OrdersResponse = await response.json();
      setOrders(res.data || []);
      setMeta(res.meta || { page: 1, last_page: 1, total: 0, per_page: limit });
    } catch (error) {
      console.error("Error fetching data:", error);
      setOrders([]);
      setMeta({ page: 1, last_page: 1, total: 0, per_page: limit });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [status, page, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(meta.last_page, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="font-cairo space-y-8 w-full mb-10">
      <div className="bg-card rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold">{t("orders")}</h1>
        <p className="text-muted-foreground mt-2">{t("ordersSubTitle")}</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">{to("OrdersTitle")}</h2>
        <div className="flex flex-row gap-2 md:flex-row md:gap-4">
          <Link
            href="/categories"
            className="inline-flex items-center px-4 py-2 gap-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {to("BrowseProducts")}
            <ShoppingCart />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statuses.map((s) => (
          <Button
            key={s.value}
            type="button"
            onClick={() => {
              setStatus(s.value);
              setActiveBtn(s.value);
            }}
            className={
              activeBtn === s.value
                ? `bg-primary hover:bg-primary/90 text-white flex items-center gap-2`
                : `bg-background hover:bg-secondary text-black dark:text-white border flex items-center gap-2`
            }
          >
            {s.icon}
            {statusLabels[s.value]}
          </Button>
        ))}
      </div>

      {/* Pagination Info and Items Per Page Selector */}
      {!loading && orders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {to("showing")} {(page - 1) * itemsPerPage + 1} -{" "}
            {Math.min(page * itemsPerPage, meta.total)} {to("of")} {meta.total}{" "}
            {to("orders")}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {to("itemsPerPage")}:
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => handleItemsPerPageChange(Number(value))}
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <SelectTrigger
                dir={language === "ar" ? "rtl" : "ltr"}
                className="w-[130px] border rounded-md px-2 py-1 text-sm h-9"
              >
                <SelectValue placeholder={to("itemsPerPage")} />
              </SelectTrigger>
              <SelectContent dir={language === "ar" ? "rtl" : "ltr"}>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl flex flex-col w-full items-center justify-center border shadow-sm mb-5">
        {loading ? (
          <div className="w-full min-w-[1000px]">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center text-center border-b p-4 gap-4"
              >
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-8 w-20 mx-auto" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-muted-foreground">
                  {to("noOrders")}
                </p>
              </div>
              <Link href="/categories">
                <Button className="bg-primary hover:bg-primary/90 mt-4">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {to("BrowseProducts")}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <table className="w-full text-center border-collapse min-w-[1000px]">
            <thead>
              <tr>
                <th className="p-3 border-b">{to("label.orderid")}</th>
                <th className="p-3 border-b">{to("label.total")}</th>
                <th className="p-3 border-b">{to("label.status")}</th>
                <th className="p-3 border-b">{to("label.createdAt")}</th>
                <th className="p-3 border-b">{to("label.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow
                  text_id={order.text_id || ""}
                  key={order.id}
                  id={order.id}
                  merchant={order.merchant?.commercialName || "-"}
                  totalValue={order.totalValue}
                  status={order.status}
                  createdAt={order.createdAt}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Enhanced Pagination */}
      {meta.last_page > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {to("page")} {page} {to("of")} {meta.last_page}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft
                className={`h-4 w-4 ${
                  language === "ar" ? "rotate-180" : "rotate-360"
                }`}
              />
              {to("previous")}
            </Button>

            <div className="flex gap-1 mx-2">
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="min-w-[40px]"
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === meta.last_page}
              className="flex items-center gap-1"
            >
              {to("next")}
              <ChevronRight
                className={`h-4 w-4 ${
                  language === "ar" ? "rotate-180" : "rotate-360"
                }`}
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
