"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Truck, Wallet, Percent, PiggyBank } from "lucide-react";

import CountUp from "react-countup";


const DashboardPage: React.FC = () => {

  const { isAuthenticated } = useAuth();
  const router = useRouter();

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
    <div className="space-y-8 p-2 md:p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <StatCard
          title="Total Orders"
          value={70}
          icon={<Truck className="w-[24px] h-[24px]" />}
        />
        <StatCard
          title="Cashback"
          value={30}
          icon={<Wallet className="w-[24px] h-[24px]" />}
        />
        <StatCard
          title="Savings Ratio"
          value={15}
          icon={<Percent className="w-[24px] h-[24px]" />}
        />
        <StatCard
          title="Saving Value"
          value={120}
          icon={<PiggyBank className="w-[28px] h-[28px]" />}
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
                <th className="p-3">المنتج</th>
                <th className="p-3">السعر</th>
                <th className="p-3">الكمية</th>
                <th className="p-3">الإجمالي</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">التاريخ</th>
              </tr>
            </thead>
            <tbody className="text-base">
              <OrderRow id="1001" product="منتج 1" price={10} qty={2} total={20} status="مكتمل" date="2025/08/15" />
              <OrderRow id="1002" product="منتج 2" price={20} qty={1} total={20} status="قيد التنفيذ" date="2025/08/16" />
              <OrderRow id="1003" product="منتج 3" price={30} qty={3} total={90} status="ملغي" date="2025/08/17" />
              <OrderRow id="1004" product="منتج 4" price={25} qty={4} total={100} status="مكتمل" date="2025/08/17" />
              <OrderRow id="1005" product="منتج 5" price={15} qty={5} total={75} status="قيد التنفيذ" date="2025/08/17" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;



type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="flex items-center border-1 hover:border-[var(--primary)] duration-300 rounded-2xl h-[100px] p-5 w-[100%]">
      <div className="text-[var(--primary)]">{icon}</div>
      <div className="flex flex-col mr-4">
        <CountUp
          className="text-3xl font-bold w-full"
          start={0}
          end={value}
          duration={5}
        />
        <h2>{title}</h2>
      </div>
    </div>
  );
};

// ------------------ Order Row ------------------
type OrderRowProps = {
  id: string;
  product: string;
  price: number;
  qty: number;
  total: number;
  status: string;
  date: string;
};

const OrderRow: React.FC<OrderRowProps> = ({
  id,
  product,
  price,
  qty,
  total,
  status,
  date,
}) => {
  const getStatusClass = (status: string): string => {
    switch (status) {
      case "مكتمل":
        return "text-green-600 font-semibold";
      case "قيد التنفيذ":
        return "text-yellow-600 font-semibold";
      case "ملغي":
        return "text-red-600 font-semibold";
      default:
        return "";
    }
  };

  return (
    <tr className="border-b hover:bg-muted/40 duration-200">
      <td className="p-3">{id}</td>
      <td className="p-3">{product}</td>
      <td className="p-3">JD{price}</td>
      <td className="p-3">{qty}</td>
      <td className="p-3">JD{total}</td>
      <td className={`p-3 ${getStatusClass(status)}`}>{status}</td>
      <td className="p-3">{date}</td>
    </tr>
  );
};