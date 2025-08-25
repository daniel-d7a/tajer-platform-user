"use client";
import React, { useState } from "react";
import { Boxes, Download } from "lucide-react";
import Link from "next/link";

interface Invoice {
  id: string;
  date: string;
  total: number;
  status: string;
  statusColor: string;
  products: { name: string; qty: number; price: number }[];
  shipping: string;
  payment: string;
}

export default function Page() {
  const [openInvoice, setOpenInvoice] = useState<Invoice | null>(null);
  const invoices: Invoice[] = [
    {
      id: "#001",
      date: "2025-08-20",
      total: 150,
      status: "مدفوعة",
      statusColor: "text-green-600",
      products: [
        { name: "Laptop", qty: 1, price: 120 },
        { name: "Mouse", qty: 2, price: 15 },
      ],
      shipping: "القاهرة، مدينة نصر، شارع 10",
      payment: "Visa",
    },
    {
      id: "#002",
      date: "2025-08-15",
      total: 200,
      status: "قيد المراجعة",
      statusColor: "text-yellow-600",
      products: [
        { name: "Phone", qty: 1, price: 200 },
      ],
      shipping: "الجيزة، فيصل، شارع 30",
      payment: "Cash",
    },
    {
      id: "#003",
      date: "2025-08-10",
      total: 300,
      status: "غير مدفوعة",
      statusColor: "text-red-600",
      products: [
        { name: "Tablet", qty: 1, price: 300 },
      ],
      shipping: "الإسكندرية، سيدي بشر",
      payment: "Fawry",
    },
        {
      id: "#0010",
      date: "2025-08-10",
      total: 300,
      status: "غير مدفوعة",
      statusColor: "text-red-600",
      products: [
        { name: "Tablet", qty: 1, price: 300 },
      ],
      shipping: "الإسكندرية، سيدي بشر",
      payment: "Fawry",
    },
        {
      id: "#004",
      date: "2025-08-10",
      total: 300,
      status: "غير مدفوعة",
      statusColor: "text-red-600",
      products: [
        { name: "Tablet", qty: 1, price: 300 },
      ],
      shipping: "الإسكندرية، سيدي بشر",
      payment: "Fawry",
    },
        {
      id: "#005",
      date: "2025-08-10",
      total: 300,
      status: "غير مدفوعة",
      statusColor: "text-red-600",
      products: [
        { name: "Tablet", qty: 1, price: 300 },
      ],
      shipping: "الإسكندرية، سيدي بشر",
      payment: "Fawry",
    },
        {
      id: "#006",
      date: "2025-08-10",
      total: 300,
      status: " مدفوعة",
      statusColor: "text-green-600",
      products: [
        { name: "Tablet", qty: 1, price: 300 },
      ],
      shipping: "الإسكندرية، سيدي بشر",
      payment: "Fawry",
    },

  ];

  return (
    <div className="font-cairo space-y-8 w-full mb-10">
      {/* الهيدر */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">فواتيرك</h2>

        <div className="flex flex-row gap-2 md:flex-row md:gap-4">
          <Link href='/categories'>
        <button className="inline-flex text-md items-center px-4 py-2 gap-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer">
          تصفح المنتجات
          <Boxes />
        </button>
          </Link>
          <button className="inline-flex items-center px-4 py-2 gap-2 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-900 transition">
        تحميل 
        <Download />
          </button>
        </div>
      </div>
      {/* جدول الفواتير */}
      <div className="overflow-x-auto rounded-xl border shadow-sm mb-5">
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
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-800">
                <td className="p-3 border-b">{invoice.id}</td>
                <td className="p-3 border-b">{invoice.date}</td>
                <td className="p-3 border-b">${invoice.total}</td>
                <td className={`p-3 border-b ${invoice.statusColor}`}>
                  {invoice.status}
                </td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => setOpenInvoice(invoice)}
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

      {/* Dialog التفاصيل */}
      {openInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className=" rounded-xl shadow-lg bg-background w-[500px] max-w-full p-6 space-y-4">
            <h3 className="text-xl font-bold mb-4">
              تفاصيل الفاتورة {openInvoice.id}
            </h3>

            <div className="space-y-2">
              <p>
                <strong>التاريخ:</strong> {openInvoice.date}
              </p>
              <p>
                <strong>المبلغ الكلي:</strong> ${openInvoice.total}
              </p>
              <p>
                <strong>الحالة:</strong>{" "}
                <span className={openInvoice.statusColor}>
                  {openInvoice.status}
                </span>
              </p>
              <p>
                <strong>طريقة الدفع:</strong> {openInvoice.payment}
              </p>
              <p>
                <strong>عنوان الشحن:</strong> {openInvoice.shipping}
              </p>
            </div>

            <h4 className="text-lg font-semibold mt-4">المنتجات:</h4>
            <table className="w-full text-center border border-gray-800 rounded-lg">
              <thead className="">
                <tr>
                  <th className="p-2 border-b">المنتج</th>
                  <th className="p-2 border-b">الكمية</th>
                  <th className="p-2 border-b">السعر</th>
                </tr>
              </thead>
              <tbody>
                {openInvoice.products.map((p, idx) => (
                  <tr key={idx} className="">
                    <td className="p-2 border-b">{p.name}</td>
                    <td className="p-2 border-b">{p.qty}</td>
                    <td className="p-2 border-b">${p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-500"
                onClick={() => setOpenInvoice(null)}
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
};