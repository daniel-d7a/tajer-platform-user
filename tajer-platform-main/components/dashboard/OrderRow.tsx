"use client"
import { useState } from "react";
import OpenOrder from "@/components/invoices/openOrder";
import { useTranslations } from "next-intl";
type OrderRowProps = {
  id: number;
  merchant: string;
  totalValue: number;
  status: string;
  createdAt: string | null;
  text_id:string;
};


const statusColor: Record<string, string> = {
  DELIVERED: "text-green-600 font-semibold",
  PROCESSING: "text-yellow-600 font-semibold",
  OUT_FOR_DELIVERY: "text-blue-600 font-semibold",
  PENDING: "text-yellow-600 font-semibold",
};

export const OrderRow: React.FC<OrderRowProps> = ({
  id,
  text_id,
  merchant,
  totalValue,
  status,
  createdAt,
}) => {
    const to = useTranslations('orders');
    const tc = useTranslations('common')
  const statusMapping: Record<string, string> = {
  DELIVERED: to('status.Delivered'),
  PROCESSING: to('status.PROCESSING'),
  OUT_FOR_DELIVERY: to('status.OUT_FOR_DELIVERY'),
  PENDING: to('status.PENDING'),
};
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US").replace(/\//g, '-')
    : tc('noData');
  const [openOrderDetails,setOpenOrderDetails] = useState(false)
  return (
    <tr className="border-b hover:bg-muted/40 duration-200">
      <td className="p-3">{text_id}</td>
      <td className="p-3">{merchant}</td>
      <td className="p-3">{tc('coins')} {totalValue.toFixed(2)}</td>
      <td className={`p-3 ${statusColor[status] || ""}`}>
        {statusMapping[status] || status}
      </td>
      <td className="p-3">{formattedDate}
      </td>
      <td className="p-3">
      <button
      className="px-3 py-1 text-xs w-fit bg-primary text-white rounded-md lg:text-sm hover:bg-primary/90"
      onClick={() => setOpenOrderDetails(true)}>
        {to('showDetails')}
      </button>
      </td>
      {openOrderDetails && <OpenOrder text_id={text_id} Id={id} onClose={() => setOpenOrderDetails(false)}/>}
    </tr>
  );
};