"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { Truck, Wallet, DollarSign, Boxes, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import Link from "next/link";
import { OrderRow } from "@/components/dashboard/OrderRow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  text_id:string;
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
    <div className="space-y-8 ">
      <div className="bg-card  shadow-sm  space-y-2 ">
        <h1 className="text-md font-bold lg:text-lg">
          {td('titel1')}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm lg:text-md">
          {td('subTitle1')}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={td('cardreview.totalOrder')}
          value={stats.totalOrders}
          icon={<Truck className="w-6 h-6" />}
          loading={loading}
        />
        <StatCard
          title={td('cardreview.totalCashback')}
          value={stats.totalCashback}
          icon={<Wallet className="w-6 h-6" />}
          loading={loading}
        />
        <StatCard
          title={td('cardreview.totalSpent')}
          value={stats.totalSpent}
          icon={<DollarSign className="w-6 h-6" />}
          loading={loading}
        />
        <StatCard
          title={td('cardreview.pendingOrders')}
          value={stats.pendingOrders}
          icon={<Truck className="w-6 h-6" />}
          loading={loading}
        />
      </div>
      
      {/* Recent Orders */}
      <div className="bg-card rounded-2xl shadow-sm mb-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold">{td('recentOrders')}</h2>
          <Link href="/categories">
            <Button className="bg-primary hover:bg-primary/90">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {td('browseProducts')}
            </Button>
          </Link>
        </div>
        <div className="rounded-xl border shadow-sm overflow-x-auto">
          <table className="min-w-full text-center border-collapse">
            <thead className="border-b">
              <tr className="text-lg">
                <th className="p-4 whitespace-nowrap">{to('label.orderid')}</th>
                <th className="p-4 whitespace-nowrap">{to('label.merchnat')}</th>
                <th className="p-4 whitespace-nowrap">{to('label.total')}</th>
                <th className="p-4 whitespace-nowrap">{to('label.status')}</th>
                <th className="p-4 whitespace-nowrap">{to('label.createdAt')}</th>
                <th className="p-4 whitespace-nowrap">{to('label.actions')}</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4"><Skeleton className="h-4 w-16 mx-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 mx-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20 mx-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16 mx-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 mx-auto" /></td>
                    <td className="p-4"><Skeleton className="h-8 w-20 mx-auto" /></td>
                  </tr>
                ))
              ) : ordersData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Boxes className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-muted-foreground">
                          {to('noOrders')}
                        </p>
                      </div>
                      <Link href="/categories">
                        <Button className="bg-primary hover:bg-primary/90 mt-4">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {td('browseProducts')}
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : ( 
                ordersData.map((order) => (
                  <OrderRow
                    key={order.id}
                    id={order.id}
                    text_id={order.text_id}
                    merchant={order.merchant.commercialName}
                    totalValue={order.totalValue}
                    status={order.status}
                    createdAt={order.createdAt}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;