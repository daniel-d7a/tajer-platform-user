"use client";
import { X } from 'lucide-react';
import  { useEffect, useState } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  piecePrice: number;
  factory: {
    name: string;
  };
}

interface Item {
  id: number;
  product: Product;
}

interface Merchant {
  commercialName?: string;
}

interface OrderData {
  order: {
    id: number;
    status: string;
    totalValue: number;
    createdAt: string | null;
    merchant: Merchant;
  };
  items: Item[];
}

interface OpenOrderProps {
  Id: number;
  onClose: () => void;
}

export default function OpenOrder({ Id, onClose }: OpenOrderProps) {
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const FetchOrderInfo = async () => {
    try {
      const response = await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/orders/orders/${Id}`,
        { credentials: 'include' }
      );
      const res = await response.json();
      if (!response.ok) {
        setErrorMessage('حدث خطا يرجي المحاوله مره اخري ');
        setData(null);
      } else {
        setData(res.data || null);
        setErrorMessage('');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
      setErrorMessage('حدث خطا يرجي المحاوله مره اخري ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchOrderInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="rounded-xl shadow-lg bg-background w-[90%] max-w-full p-6 space-y-4">
        {errorMessage && (
          <p className="text-red-600 font-bold">{errorMessage}</p>
        )}
        {loading ? (
          <h2>جاري تحميل تفاصيل الطلب...</h2>
        ) : data ? (
          <div className='flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
              <h2>تفاصيل الطلب : #{data.order.id}</h2>
              <button onClick={onClose}>
                <X />
              </button>
            </div>
            <div className='grid grid-cols-2 gap-5'>
              <p className='text-right'>اسم التاجر : {data.order.merchant?.commercialName ?? "-"}</p>
              <p className='text-right'>
                حاله الطلب : {
                  data.order.status === 'OUT_FOR_DELIVERY' ? "خرج للتوصيل"
                  : data.order.status === 'PENDING' ? "قيد الإنتظار"
                  : data.order.status === 'PROCESSING' ? "قيد التنفيذ"
                  : data.order.status === 'DELIVERED' ? "تم التسليم"
                  : data.order.status
                }
              </p>
              <p className='text-right'>قيمه الطلب : {data.order.totalValue?.toFixed(2)} JD</p>
              <p className='text-right'>
                تاريخ انشاء الطلب : {
                  data.order.createdAt
                    ? new Date(data.order.createdAt).toLocaleDateString("ar-EG")
                    : "لا يوجد تاريخ محدد"
                }
              </p>
              <p className='text-right'>عدد المنتجات : {data.items?.length ?? 0} منتجات</p>
            </div>
            <div className='border border-black-100 rounded-md p-5'>
              <h2 className='text-right'>منتجات الطلب</h2>
              <div className='overflow-auto h-full'>
                {data.items && data.items.length > 0 ? (
                  data.items.map((item) => (
                    <div key={item.id} className='flex items-center justify-between border-b border-gray-200 p-2'>
                      <div className='flex items-center gap-5'>
                        <div className="relative w-20 h-20 rounded-md overflow-hidden">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className='flex flex-col item-center gap-2'>
                          <p className='text-right'>{item.product.name}</p>
                          <p className='text-right text-sm opacity-70'>{item.product.factory?.name ?? "-"}</p>
                        </div>
                      </div>
                      <div>
                        <p>{item.product.piecePrice?.toFixed(2)} JD</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-5">لا يوجد منتجات في هذا الطلب.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600 py-8 font-bold">
            {errorMessage || "تعذر تحميل تفاصيل الطلب"}
          </div>
        )}
      </div>
    </div>
  );
}