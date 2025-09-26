"use client";
import React, { useEffect, useState } from "react";
import { Boxes, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { OrderRow } from "@/components/dashboard/OrderRow";
import { Skeleton } from "@/components/ui/skeleton";

interface Merchant {
  commercialName?: string;
}

interface Invoice {
  id: number;
  createdAt: string | null;
  totalValue: number;
  status: string;
  merchant: Merchant;
  text_id:string;
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
  const t = useTranslations('dashboard')
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
    };
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <div className="font-cairo space-y-8 w-full mb-10">
      <div className="bg-card  rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold">{t('invice')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('invoiceSubTitle')} 
        </p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">{to("Invoices")}</h2>
        <div className="flex flex-row gap-2 md:flex-row md:gap-4">
          <Link href="/categories">
            <button className="inline-flex text-md items-center px-4 py-2 gap-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer">
               {t('browseProducts')}
              <Boxes />
            </button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl flex items-center justify-center border shadow-sm mb-5">
        {(!loading && invoiceData.length === 0) ? (
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
                          {to('BrowseProducts')}
                        </Button>
                      </Link>
                    </div>
                  </td>
          </tr>
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
              ) : (
                invoiceData.map((invoice) => (
                  <OrderRow
                    key={invoice.id}
                    text_id={invoice.text_id}
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
};