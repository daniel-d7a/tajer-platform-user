"use client";
import React, { useEffect, useState } from "react";
import { Boxes, ShoppingBag } from "lucide-react";
import Link from "next/link";
import OpenOrder from "@/components/invoices/openOrder";
import { Button } from "@/components/ui/button";
interface Invoice {
  id: number;
  date: string;
  total: number;
  status: string;
  statusColor: string;
  products: { name: string; qty: number; price: number }[];
  shipping: string;
  payment: string;
   createdAt?: string;
  totalValue: number;
}

export default function Page() {
  const [openInvoice, setOpenInvoice] = useState<Invoice | null>(null);
  const [InvoiceData,setinvoiceData] = useState<Invoice[]>();
  const [loading,setLoading] = useState(true)
  const [open,setOpen] = useState(false)
  const fetchInvoice = async () =>{
    try{
      const data = await fetch("https://tajer-backend.tajerplatform.workers.dev/api/orders/orders/user?limit=&page=&status=DELIVERED&from=&to=",
        { credentials: "include" })
        const res = await data.json();
        setinvoiceData(res.data);
    }finally{
      setLoading(false);
    };
  };
  useEffect(() =>{
    fetchInvoice();
  },[])
  return (
    <div className="font-cairo space-y-8 w-full mb-10">
   <div className="bg-card  rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold">
            فواتيرك علي المنصه
          </h1>
          <p className="text-muted-foreground mt-2">
            اطلع علي الطلبات التي وصلت علي حسابك 
          </p>
        </div>      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">فواتيرك</h2>

        <div className="flex flex-row gap-2 md:flex-row md:gap-4">
          <Link href='/categories'>
        <button className="inline-flex text-md items-center px-4 py-2 gap-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer">
          تصفح المنتجات
          <Boxes />
        </button>
          </Link>
        </div>
      </div>
      {/* جدول الفواتير */}
      <div className="overflow-x-auto rounded-xl border shadow-sm mb-5">
          {InvoiceData?.length === 0 ? (
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
  
          <thead className="">
            <tr>
              <th className="p-3 border-b">رقم الفاتورة</th>
              <th className="p-3 border-b">التاريخ</th>
              <th className="p-3 border-b">المبلغ</th>
              <th className="p-3 border-b">الحالة</th>
              <th className="p-3 border-b">إجراءات</th>
            </tr>
          </thead>
          <tbody>

            {loading ? (
              <tr className="hover:bg-muted">
                <td className="p-3 border-b">جاري التحميل</td>
                <td className="p-3 border-b">جاري التحميل</td>
                <td className="p-3 border-b">جاري التحميل</td>
                <td className="p-3 border-b">جاري التحميل</td>
                <td className="p-3 border-b">جاري التحميل</td>
              </tr>
            )  :             
              (
              InvoiceData?.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-muted">
                <td className="p-3 border-b">{invoice.id}</td>
                <td className="p-3 border-b">{invoice.createdAt == null ? "غير محدد" : new Date(invoice.createdAt).toLocaleDateString("ar-EG")}</td>
                <td className="p-3 border-b">JD {invoice.totalValue.toFixed(2)}</td>
                <td className={`p-3 border-b ${invoice.statusColor}`}>
                  {invoice.status === 'OUT_FOR_DELIVERY' ? "خرج  للتوصيل" : invoice.status === 'PENDING' ? "قيد الإنتظار" : invoice.status === 'PROCESSING' ? "قيد التنفيذ" : "تم التسليم"}
                </td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => {
                      setOpenInvoice(invoice)
                      setOpen(true)
                    }}
                    className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
          )}
     
      </div>
      {openInvoice  && open && (
        <OpenOrder Id={openInvoice.id} onClose={() => setOpenInvoice(null)}/>
      )}
    </div>
  );
};