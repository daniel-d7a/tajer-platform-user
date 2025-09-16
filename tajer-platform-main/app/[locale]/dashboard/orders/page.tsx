"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import OpenOrder from "@/components/invoices/openOrder";

interface Merchant {
  commercialName?: string;
}

interface Order {
  id: number;
  merchantId?: number;
  status: string;
  totalValue?: number;
  createdAt?: string | null;
  merchant?: Merchant;
}

export default function Page() {
  const [openOrder, setOpenOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>("PENDING");
  const [activeBtn, setActiveBtn] = useState<string>("PENDING");
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);

  const statuses = ["PENDING", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"];
  const statusLabels: Record<string, string> = {
    PENDING: "قيد الإنتظار",
    PROCESSING: "قيد التنفيذ",
    OUT_FOR_DELIVERY: "خرج للتوصيل",
    DELIVERED: "تم التسليم",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://tajer-backend.tajerplatform.workers.dev/api/orders/orders/user?limit=&page=&status=${status}&from=&to=`,
          { credentials: "include" }
        );
        const res = await response.json();
        setData(res?.data ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);

  const statusColor = (s: string) => {
    switch (s) {
      case "PENDING":
        return "text-yellow-500";
      case "PROCESSING":
        return "text-blue-500";
      case "OUT_FOR_DELIVERY":
        return "text-orange-500";
      case "DELIVERED":
        return "text-green-500";
      default:
        return "";
    }
  };

  return (
    <div className="font-cairo space-y-8 w-full mb-10">
      <div className="bg-card  rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold">
          إلقاء نظره سريعه علي  طلباتك
        </h1>
        <p className="text-muted-foreground mt-2">
          إحصائيات مفصلة عن  طلباتك الحاليه !
        </p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">طلباتك</h2>
        <div className="flex flex-row gap-2 md:flex-row md:gap-4 ">
          <Link href="/products" className="inline-flex items-center px-4 py-2 gap-2 bg-primary text-white rounded-md hover:bg-primary/90">
            تصفح المنتجات
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
            className={activeBtn === s ? `bg-primary hover:bg-secondary text-white` : `bg-background hover:bg-secondary border`}
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
                <th className="p-3 border-b">رقم الطلب</th>
                <th className="p-3 border-b">اسم التاجر</th>
                <th className="p-3 border-b">التاريخ</th>
                <th className="p-3 border-b">المبلغ</th>
                <th className="p-3 border-b">الحالة</th>
                <th className="p-3 border-b">إجراءات</th>
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
                    <div className="h-4 w-20 bg-background/90 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-12 bg-background/90 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-14 bg-background/90 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-6 w-20 bg-background/90 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          data.length === 0 ? (
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
                  <th className="p-3 border-b">رقم الطلب</th>
                  <th className="p-3 border-b">اسم التاجر</th>
                  <th className="p-3 border-b">التاريخ</th>
                  <th className="p-3 border-b">المبلغ</th>
                  <th className="p-3 border-b">الحالة</th>
                  <th className="p-3 border-b">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order) => (
                  <tr key={order.id} className="hover:bg-muted border-b">
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => {
                        setOpenOrder(order);
                        setOpen(true);
                      }}
                    >
                      {order.id}
                    </td>
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => {
                        setOpenOrder(order);
                        setOpen(true);
                      }}
                    >
                      {order.merchant?.commercialName || "-"}
                    </td>
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => {
                        setOpenOrder(order);
                        setOpen(true);
                      }}
                    >
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("ar-EG")
                        : "غير محدد"}
                    </td>
                    <td
                      className="p-3 cursor-pointer flex justify-center items-center gap-1"
                      onClick={() => {
                        setOpenOrder(order);
                        setOpen(true);
                      }}
                    >
                      <strong className="text-primary text-md">JD</strong>
                      {(order.totalValue ?? 0).toFixed(2)}
                    </td>
                    <td
                      className={`p-3 cursor-pointer ${statusColor(order.status)}`}
                      onClick={() => {
                        setOpenOrder(order);
                        setOpen(true);
                      }}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenOrder(order);
                          setOpen(true);
                        }}
                        className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {openOrder && open && (
        <OpenOrder Id={openOrder.id} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}