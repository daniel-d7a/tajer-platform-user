"use client";
import { X } from 'lucide-react';
import  { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
interface Product {
  id: number;
  name: string;
  imageUrl: string;
  name_ar:string;
  piecePrice: number;
  factory: {
    name: string;
    name_ar:string;
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
};
interface OpenOrderProps {
  Id: number;
  onClose: () => void;
};
export default function OpenOrder({ Id, onClose }: OpenOrderProps) {
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const tod = useTranslations('orderDetails')
  const tc = useTranslations('common')
    const [language,setLanguage] = useState('en')
    const pathname = usePathname();
    useEffect(() => {
      const segments = pathname.split("/").filter(Boolean);
      const lang = segments[0]; 
      setLanguage(lang)
    }, [pathname]);
  const to = useTranslations('orders')
  const FetchOrderInfo = async () => {
    try {
      const response = await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/orders/orders/${Id}`,
        { credentials: 'include' }
      );
      const res = await response.json();
      if (!response.ok) {
        setErrorMessage(tod('errorMessage'));
        setData(null);
      } else {
        setData(res.data || null);
        setErrorMessage('');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
        setErrorMessage(tod('errorMessage'));
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
          <div className='flex items-center w-full justify-between '>
          <p className="text-red-600 font-bold">{errorMessage}</p>
          <button onClick={onClose}>
                <X />
              </button>
          </div>
        )}
        {loading ? (
          <h2>{tod('loading')}</h2>
        ) : data ? (
          <div className='flex flex-col gap-5' dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className='flex items-center justify-between'>
              <h2> {tod('orderdetails')} : #{data.order.id}</h2>
              <button onClick={onClose}>
                <X />
              </button>
            </div>
       <div className='grid grid-cols-2 gap-5'>
              <p className='text-right'> {tod('commercialName')} : {data.order.merchant?.commercialName ?? "-"}</p>
              <p className='text-right'>
                 {tod('status')}: {
                  data.order.status === 'OUT_FOR_DELIVERY' ? to('status.OUT_FOR_DELIVERY')
                  : data.order.status === 'PENDING' ? to('status.PENDING')
                  : data.order.status === 'PROCESSING' ? to('status.PROCESSING')
                  : data.order.status === 'DELIVERED' ? to('status.Delivered')
                  : data.order.status
                }
              </p>
              <p className='text-right'>{tod('value')}  : {data.order.totalValue?.toFixed(2)} {tc('coins')}</p>
              <p className='text-right'>
                  {tod('orderDate')} : {
                  data.order.createdAt
                    ? new Date(data.order.createdAt).toLocaleDateString("ar-EG")
                    : tc('noData')
                }
              </p>
              <p className='text-right'> {tod('orderProducts')} : {data.items?.length ?? 0} {tc('products')}</p>
                  </div>

            <div className='border border-black-100 rounded-md p-5'>
              <h2 className='text-right'> {tod('Demandproducts')}</h2>
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
                          <p className='text-right'>{language === "en" ? item.product.name: item.product.name_ar }</p>
                          <p className='text-right text-sm opacity-70'>{language === 'en' ? item.product.factory?.name ?? "-" : item.product.factory.name_ar}</p>
                        </div>
                      </div>
                      <div>
                        <p>{item.product.piecePrice?.toFixed(2)} {tc('coins')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-5">{tod('noProducts')}</p>
                )}
              </div>
            </div>
           
          </div>
        ) : (
          <div className="text-center text-red-600 py-8 font-bold">
            {errorMessage || tod('errorMessage')}
          </div>
        )}
      </div>
    </div>
  );
};