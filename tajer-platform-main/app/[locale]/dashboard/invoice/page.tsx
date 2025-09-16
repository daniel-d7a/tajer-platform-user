"use client";
import React, { useEffect, useState } from "react";
import { Boxes, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { OrderRow } from "@/components/dashboard/OrderRow";

interface Merchant {
  commercialName?: string;
}

interface Invoice {
  id: number;
  createdAt: string | null;
  totalValue: number;
  status: string;
  merchant: Merchant;
}

interface ApiResponse {
  data: Invoice[];
  meta?: {
    limit: number;
    offset: number;
    from: number;
    to: number;
    page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export default function Page() {
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const to = useTranslations("orders");
  const tc = useTranslations("common");

  const fetchInvoice = async () => {
    try {
      const data = await fetch(
        "https://tajer-backend.tajerplatform.workers.dev/api/orders/orders/user?limit=&page=&status=DELIVERED&from=&to=",
        { credentials: "include" }
      );
      const res: ApiResponse = await data.json();
      setInvoiceData(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <div className="font-cairo space-y-8 w-full mb-10">
      <div className="bg-card  rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold">فواتيرك علي المنصه</h1>
        <p className="text-muted-foreground mt-2">
          اطلع علي الطلبات التي وصلت علي حسابك
        </p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">{to("Invoices")}</h2>
        <div className="flex flex-row gap-2 md:flex-row md:gap-4">
          <Link href="/categories">
            <button className="inline-flex text-md items-center px-4 py-2 gap-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer">
              تصفح المنتجات
              <Boxes />
            </button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border shadow-sm mb-5">
        {(!loading && invoiceData.length === 0) ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">empty</h2>
            <p className="text-muted-foreground mb-6">emptyDesc</p>
            <Link href="/categories">
              <Button className="bg-primary hover:bg-primary/90">
                browseProducts
              </Button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b">{to("InvoiceId")}</th>
                <th className="p-3 border-b">{to("label.merchnat")}</th>
                <th className="p-3 border-b">{to("label.total")}</th>
                <th className="p-3 border-b">{to("label.createdAt")}</th>
                <th className="p-3 border-b">{to("label.status")}</th>
                <th className="p-3 border-b">{to("label.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="hover:bg-muted">
                  <td className="p-3 border-b">{tc("loading")}</td>
                  <td className="p-3 border-b">{tc("loading")}</td>
                  <td className="p-3 border-b">{tc("loading")}</td>
                  <td className="p-3 border-b">{tc("loading")}</td>
                  <td className="p-3 border-b">{tc("loading")}</td>
                  <td className="p-3 border-b">{tc("loading")}</td>
                </tr>
              ) : (
                invoiceData.map((invoice) => (
                  <OrderRow
                    key={invoice.id}
                    createdAt={invoice.createdAt}
                    id={invoice.id}
                    totalValue={Number(invoice.totalValue)}
                    status={invoice.status}
                    merchant={invoice.merchant?.commercialName ?? "-"}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}