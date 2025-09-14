"use client";
import React, { useEffect, useState } from "react";
import { Boxes, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Merchant {
  commercialName: string;
}

interface Order {
  id: number;
  merchantId: number;
  status: string;
  totalValue: number;
  createdAt: string;
  merchant: Merchant;
}

export default function Page() {
  const [openOrder, setOpenOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>("PENDING");
  const [activeBtn, setActiveBtn] = useState<string>("PENDING");
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://tajer-backend.tajerplatform.workers.dev/api/orders/orders?status=${status}`,
          { credentials: "include" }
        );
        const res = await response.json();
        setData(res.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);

  const statusColor = (status: string) => {
    switch (status) {
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">طلباتك</h2>
        <div className="flex flex-row gap-2 md:flex-row md:gap-4 ">
          <button className="inline-flex items-center px-4 py-2 gap-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer">
            تصفح المنتجات
            <Boxes />
          </button>
          <button className="inline-flex items-center px-4 py-2 gap-2 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-900 transition">
            تحميل
            <Download />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {["PENDING", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"].map((s) => (
          <Button
            key={s}
            onClick={() => {
              setStatus(s);
              setActiveBtn(s);
            }}
            className={activeBtn === s ? `bg-primary text-white` : `bg-background border-1`}
          >
            {s}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm mb-5">
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
            {loading
              ? [...Array(5)].map((_, i) => (
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
                ))
              : data.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800 border-b">
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => setOpenOrder(order)}
                    >
                      {order.id}
                    </td>
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => setOpenOrder(order)}
                    >
                      {order.merchant?.commercialName || "-"}
                    </td>
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => setOpenOrder(order)}
                    >
                      {order.createdAt}
                    </td>
                    <td
                      className="p-3 cursor-pointer flex justify-center items-center gap-1"
                      onClick={() => setOpenOrder(order)}
                    >
                      <strong className="text-primary text-md">JD</strong>
                      {order.totalValue.toFixed(2)}
                    </td>
                    <td
                      className={`p-3 cursor-pointer ${statusColor(order.status)}`}
                      onClick={() => setOpenOrder(order)}
                    >
                      {order.status}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setOpenOrder(order)}
                        className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {openOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="rounded-xl shadow-lg bg-background w-[500px] max-w-full p-6 space-y-4">
            <h3 className="text-xl font-bold mb-4">
              تفاصيل الطلب {openOrder.id}
            </h3>
            <div className="space-y-2">
              <p>
                <strong>اسم التاجر:</strong> {openOrder.merchant?.commercialName || "-"}
              </p>
              <p>
                <strong>التاريخ:</strong> {openOrder.createdAt}
              </p>
              <p>
                <strong>المبلغ الكلي:</strong> JD{openOrder.totalValue.toFixed(2)}
              </p>
              <p>
                <strong>الحالة:</strong>{" "}
                <span className={statusColor(openOrder.status)}>
                  {openOrder.status}
                </span>
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-500"
                onClick={() => setOpenOrder(null)}
              >
                إغلاق
              </button>
              <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
                تحميل PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
