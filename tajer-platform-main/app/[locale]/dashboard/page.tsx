"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const tc = useTranslations('common');
  const td = useTranslations('dashboard');
  const to = useTranslations('orders');
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
    // eslint-disable-next-line
  }, [isAuthenticated]);

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
        <p className="text-lg font-medium">{tc('noSignIn')}</p>
      </div>
    );
  } 

  return (
    <div className="space-y-8 md:p-8">
      <div className="bg-card rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold sm:text-xl">
          {td('titel1')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {td('subTitle1')}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title={td('cardreview.totalOrder')}
          value={stats.totalOrders}
          icon={<Truck className="w-[24px] h-[24px]" />}
          loading={loading}
        />
        <StatCard
          title={td('cardreview.totalCashback')}
          value={stats.totalCashback}
          icon={<Wallet className="w-[24px] h-[24px]" />}
          loading={loading}
        />
        <StatCard
          title={td('cardreview.totalSpent')}
          value={stats.totalSpent}
          icon={<DollarSign className="w-[24px] h-[24px]" />}
          loading={loading}
        />
        <StatCard
          title={td('cardreview.pendingOrders')}
          value={stats.pendingOrders}
          icon={<Truck className="w-[28px] h-[28px]" />}
          loading={loading}
        />
      </div>
      
      {/* Recent Orders */}
      <div className="rounded-xl">
        <h2 className="text-2xl font-bold mb-4">{td('recentOrders')}</h2>
        
      <div className="rounded-xl border shadow-sm mb-5 overflow-x-auto max-w-full">
  <table className="min-w-[700px] w-max text-center border-collapse">
    <thead className="border-b">
      <tr className="text-lg">
        <th className="p-3 whitespace-nowrap">{to('label.orderid')}</th>
        <th className="p-3 whitespace-nowrap">{to('label.merchnat')}</th>
        <th className="p-3 whitespace-nowrap">{to('label.total')}</th>
        <th className="p-3 whitespace-nowrap">{to('label.status')}</th>
        <th className="p-3 whitespace-nowrap">{to('label.createdAt')}</th>
        <th className="p-3 whitespace-nowrap">{to('label.actions')}</th>
      </tr>
    </thead>
    <tbody className="text-base">
      {!loading && ordersData.length === 0 && (
        <tr>
          <td colSpan={6} className="p-6 text-center text-muted-foreground">
            {to('noOrders')}
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