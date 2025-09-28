"use client";
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  name_ar: string;
  piecePrice: number;
  originalPrice?: number;
  isOnSale?: boolean;
  discountType?: string;
  discountAmount?: number;
  factory: {
    name: string;
    name_ar: string;
  };
}

interface Item {
  id: number;
  product: Product;
}

const statusColor: Record<string, string> = {
  DELIVERED: "text-green-600 font-semibold",
  PROCESSING: "text-yellow-600 font-semibold",
  OUT_FOR_DELIVERY: "text-blue-600 font-semibold",
  PENDING: "text-yellow-600 font-semibold",
};

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
    text_id: string;
  };
  items: Item[];
};

interface OpenOrderProps {
  Id: number;
  text_id: string;
  onClose: () => void;
};

const calculateDiscountedPrice = (product: Product): number => {
  const originalPrice = product.piecePrice;
  
  if (!product.discountAmount || product.discountAmount <= 0) return originalPrice;
  
  if (product.discountType === 'percentage') {
    return originalPrice * (1 - product.discountAmount / 100);
  } else {
    return Math.max(0, originalPrice - product.discountAmount);
  }
};

const isProductOnSale = (product: Product): boolean => {
  return product.isOnSale || (product.discountAmount && product.discountAmount > 0) || false;
};

export default function OpenOrder({ Id, onClose, text_id }: OpenOrderProps) {
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const tod = useTranslations('orderDetails');
  const tc = useTranslations('common');
  const [language, setLanguage] = useState('en');
  const pathname = usePathname();
  
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0]; 
    setLanguage(lang);
  }, [pathname]);

  const to = useTranslations('orders');

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
    <div className="fixed inset-0 bg-black/80 z-50">
      <div className="rounded-xl shadow-lg bg-background w-[90%] max-w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {errorMessage && (
          <div className='flex items-center w-full justify-between'>
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
              <h2 className='text-sm lg:text-xl'>{tod('orderdetails')} : #{text_id}</h2>
              <button onClick={onClose}>
                <X />
              </button>
            </div>
            <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
              <p className='text-right'>{tod('commercialName')} : {data.order.merchant?.commercialName ?? "-"}</p>
              <p className={'text-right flex flex-row gap-2 ' + (language === 'ar' ? 'justify-start' : 'justify-end')}>
                {tod('status')}: 
                <p className={statusColor[data.order.status] || ""}>
                  {
                    data.order.status === 'OUT_FOR_DELIVERY' ? to('status.OUT_FOR_DELIVERY')
                    : data.order.status === 'PENDING' ? to('status.PENDING')
                    : data.order.status === 'PROCESSING' ? to('status.PROCESSING')
                    : data.order.status === 'DELIVERED' ? to('status.Delivered')
                    : data.order.status
                  }  
                </p>
              </p>
              <p className='text-right'>{tod('value')} : {data.order.totalValue?.toFixed(2)} <strong>{tc('coins')}</strong></p>
              <p className='text-right'>
                {tod('orderDate')} : {
                  data.order.createdAt
                    ? new Date(data.order.createdAt).toLocaleDateString("ar-EG").replace(/\//g, '-')
                    : tc('noData')
                }
              </p>
              <p className='text-right'>{tod('orderProducts')} : {data.items?.length ?? 0} {tc('products')}</p>
            </div>
            <div className='border border-black-100 rounded-md p-5'>
              <h2 className='text-right'>{tod('Demandproducts')}</h2>
              <div className='overflow-auto h-full'>
                {data.items && data.items.length > 0 ? (
                  data.items.map((item) => {
                    const isOnSale = isProductOnSale(item.product);
                    const originalPrice = item.product.piecePrice;
                    const discountedPrice = calculateDiscountedPrice(item.product);
                    
                    return (
                      <div
                        key={item.id}
                        className="w-full flex flex-col sm:flex-row items-center sm:justify-between border-b border-gray-200 p-2 gap-3"
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                          <div className="relative w-30 h-30 rounded-md overflow-hidden">
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                            {isOnSale && (
                              <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg">
                                {item.product.discountType === 'percentage' 
                                  ? `${item.product.discountAmount}% ${tc('offer')}`
                                  : `${item.product.discountAmount} ${tc('coins')} ${tc('offer')}`}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-center sm:items-start gap-2">
                            <p className="text-center sm:text-right">
                              {language === "en" ? item.product.name : item.product.name_ar}
                            </p>
                            <p className="text-center sm:text-right text-sm opacity-70">
                              {language === "en"
                                ? item.product.factory?.name ?? "-"
                                : item.product.factory.name_ar}
                            </p>
                          </div>
                        </div>

                        <div className="text-center sm:text-right w-full sm:w-auto">
                          {isOnSale ? (
                            <div className="flex flex-col items-end">
                              <p className="font-bold text-green-600">
                                {discountedPrice.toFixed(2)} {tc("coins")}
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                {originalPrice.toFixed(2)} {tc("coins")}
                              </p>
                            </div>
                          ) : (
                            <p>
                              {originalPrice.toFixed(2)} {tc("coins")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
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