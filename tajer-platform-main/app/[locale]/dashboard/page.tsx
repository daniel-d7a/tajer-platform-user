"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Truck, Wallet, DollarSign } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OrderRow } from "@/components/dashboard/OrderRow";
type StatsType = {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  totalCashback: number;
};

type OrderType = {
  id: number;
  merchantId: number;
  status: string;
  totalValue: number;
  createdAt: string | null;
  merchant: {
    commercialName: string;
  };
};

type OrdersResponse = {
  stats: StatsType;
  data: OrderType[];
};
const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [ordersData, setOrdersData] = useState<OrderType[]>([]);
  const [stats, setStats] = useState<StatsType>({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    totalCashback: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    };
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const data = await fetch(
        "https://tajer-backend.tajerplatform.workers.dev/api/orders/orders/user?limit=&page=&status=PENDING&from=&to=",
        { credentials: "include" }
      );
      const res: OrdersResponse = await data.json();
      setOrdersData(res.data || []);
      setStats(res.stats || {
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        totalCashback: 0,
      });
    } catch (error) {
      console.error(error);
      setOrdersData([]);
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        totalCashback: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">جاري تحويلك لصفحة تسجيل الدخول...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:p-8">
          <div className="bg-card  rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold">
          إلقاء نظره سريعه علي أداء متجرك
          </h1>
          <p className="text-muted-foreground mt-2">
            إحصائيات مفصلة عن أداء متجرك !
          </p>
        </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3  lg:grid-cols-4 gap-4 ">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<Truck className="w-[24px] h-[24px]" />}
          loading={loading}
        />
        <StatCard
          title="Cashback"
          value={stats.totalCashback}
          icon={<Wallet className="w-[24px] h-[24px]" />}
          loading={loading}
        />
        <StatCard
          title="Total Spent"
          value={stats.totalSpent}
          icon={<DollarSign className="w-[24px] h-[24px]" />}
          loading={loading}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<Truck className="w-[28px] h-[28px]" />}
          loading={loading}
        />
      </div>
      {/* Recent Orders */}
      <div className="rounded-xl ">
        <h2 className="text-2xl font-bold mb-4">أحدث الطلبات</h2>
        <div className="overflow-x-auto rounded-xl border shadow-sm mb-5">
          <table className="w-full min-w-[600px] text-center border-collapse">
            <thead className=" border-b">
              <tr className="text-lg">
                <th className="p-3">رقم الطلب</th>
                <th className="p-3">المتجر</th>
                <th className="p-3">السعر الإجمالي</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">تاريخ الإنشاء</th>
                <th className="p-3">الإجرائات</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {!loading && ordersData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    لا يوجد طلبات حتى الآن
                  </td>
                </tr>
              )}
              {ordersData.map((order) => (
                <OrderRow
                  key={order.id}
                  id={order.id}
                  merchant={order.merchant.commercialName}
                  totalValue={order.totalValue}
                  status={order.status}
                  createdAt={order.createdAt}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;