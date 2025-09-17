"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { OrderRow } from "@/components/dashboard/OrderRow";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
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

  const statuses = ["PENDING", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"];
  const statusLabels: Record<string, string> = {
    PENDING: to("status.PENDING"),
    PROCESSING: to("status.PROCESSING"),
    OUT_FOR_DELIVERY: to("status.OUT_FOR_DELIVERY"),
    DELIVERED: to("status.Delivered"),
  };

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://tajer-backend.tajerplatform.workers.dev/api/orders/orders/user?limit=20&page=${page}&status=${status}&from=&to=`,
          { credentials: "include" }
        );
        const res: OrdersResponse = await response.json();
        setOrders(res.data || []);
        setMeta(res.meta || { page: 1, last_page: 1, total: 0, per_page: 20 });
      } catch (error) {
        console.error("Error fetching data:", error);
        setOrders([]);
        setMeta({ page: 1, last_page: 1, total: 0, per_page: 20 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status, page]);

  return (
    <div className="font-cairo space-y-8 w-full mb-10">
      <div className="bg-card  rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold">إلقاء نظره سريعه علي طلباتك</h1>
        <p className="text-muted-foreground mt-2">
          إحصائيات مفصلة عن طلباتك الحاليه !
        </p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">{to('OrdersTitle')}</h2>
        <div className="flex flex-row gap-2 md:flex-row md:gap-4 ">
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 gap-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
              {to('BrowseProducts')}
            <Boxes />
          </Link>
        </div>
      </div>
      <div className="flex gap-2">
        {statuses.map((s) => (
          <Button
            key={s}
            type="button"
            onClick={() => {
              setStatus(s);
              setActiveBtn(s);
            }}
            className={
              
              activeBtn === s
                ? `bg-primary hover:bg-secondary text-white`
                : `bg-background hover:bg-secondary border`
            }
          >
            {statusLabels[s]}
          </Button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border shadow-sm mb-5">
        {loading ? (
          <table className="w-full text-center border-collapse min-w-[1000px]">
            <thead>
              <tr>
                <th className="p-3 border-b">{to('label.orderid')}</th>
                <th className="p-3 border-b">{to('label.merchnat')}</th>
                <th className="p-3 border-b">{to('label.total')}</th>
                <th className="p-3 border-b">{to('label.status')}</th>
                <th className="p-3 border-b">{to('label.createdAt')}</th>
                <th className="p-3 border-b">{to('label.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-3">
                    <div className="h-4 w-16 bg-background/90 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-24 bg-background/90 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-12 bg-background/90 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-14 bg-background/90 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-20 bg-background/90 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-6 w-20 bg-background/90 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : orders.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">لا يوجد طلبات</h2>
            <p className="text-muted-foreground mb-6">
              لم يتم العثور على أي طلبات في هذه الحالة. جرب حالات أخرى أو ابدأ التسوق الآن!
            </p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90">
                تصفح المنتجات
              </Button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-center border-collapse min-w-[1000px]">
            <thead>
              <tr>
                <th className="p-3 border-b">{to('label.orderid')}</th>
                <th className="p-3 border-b">{to('label.merchnat')}</th>
                <th className="p-3 border-b">{to('label.total')}</th>
                <th className="p-3 border-b">{to('label.status')}</th>
                <th className="p-3 border-b">{to('label.createdAt')}</th>
                <th className="p-3 border-b">{to('label.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow
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
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {Array.from({ length: meta.last_page || 1 }, (_, i) => i + 1).map((p) => (
          <Link key={p} href={`?page=${p}`} scroll={true}>
            <Button
              variant={p === meta.page ? "default" : "outline"}
              className="px-4 py-2 text-sm"
            >
              {p}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}