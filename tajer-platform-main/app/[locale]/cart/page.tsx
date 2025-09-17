'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Toast from '../dashboard/settings/toast';
interface Product {
  id: number;
  name: string;
  name_ar?: string;
  imageUrl?: string;
  price?: number;
  piecePrice?: number;
  originalPrice?: number;
  isOnSale?: boolean;
  company?: string;
  unitType?: string;
  minOrderQuantity?: number;
  factory:Factory;
}
interface Factory{
  name:string;
  name_ar:string;
}
interface CartItem {
  id: number;
  cartId?: number;
  productId: number;
  quantity: number;
  product: Product;
  factory:Factory;
}

interface ApiResponse {
  data?: {
    cart?: object;
    items?: CartItem[];
  };
  meta?: object;
}

export default function CartPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const [message,setMessage] = useState('')
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(true);
    };

    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://tajer-backend.tajerplatform.workers.dev/api/cart',
          { credentials: 'include' }
        );
        const res: ApiResponse = await response.json();
        const items = res?.data?.items ?? [];
        setCartItems(items);
      } catch  {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchCart();
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };
  const removeAllCart = async() =>{
    if(window.confirm('هل حقا ترغب في حذف سله المشتريات كامله')){
    try{
      await fetch('https://tajer-backend.tajerplatform.workers.dev/api/cart', {
        credentials: "include",
        method: "DELETE"
      });
    setCartItems([]);

    }finally{
      console.log('delete succes')
    }
    }
    
  }
  const removeItem = async(id: number) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
    try{
      await fetch(`https://tajer-backend.tajerplatform.workers.dev/api/cart/items/${id}`, {
        credentials: "include",
        method: "DELETE"
      });
    }catch(err){
      console.error('Error removing item:', err);
    }
  };
 const handleCheckOut = async () => {
  try {
    const response = await fetch(
      'https://tajer-backend.tajerplatform.workers.dev/api/orders/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((cartItem) => ({
            productId: cartItem.productId, 
            quantity: cartItem.quantity,
            factoryStatus: 'PENDING_FACTORY',
            factoryBatchId: null,
          })),
        }),
        credentials: 'include',
      }
    );

    if (!response.ok) {
        setMessage('حصل خطا اثناء اضافه الطلبات يرجي المحاوله مره أخري لاحقا ');

    }else{
      setMessage('تمت اضافه المنتجات الي قائمه الإنتظار سيتم توصيل طلبك في اسرع وقت ');
          setCartItems([]);

    };
  } catch  {
    setMessage('حصل خطا اثناء اضافه الطلبات يرجي المحاوله مره أخري لاحقا ');
  }
};

  const getItemPrice = (item: CartItem) =>
    item.product?.piecePrice ?? item.product?.price ?? 0;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getItemPrice(item) * (item.quantity ?? 0),
    0
  );

  const savings = cartItems.reduce((acc, item) => {
    const orig = item.product?.originalPrice ?? 0;
    const price = getItemPrice(item);
    if (orig > price) {
      return acc + (orig - price) * (item.quantity ?? 0);
    }
    return acc;
  }, 0);

  const total = subtotal ;

  if (isAuthenticated === null || loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري تحميل سلة المشتريات...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="w-[90%] mx-auto py-8">
      <div className="mb-6">
        <div className='flex justify-between items-center'>
            <Link href="/categories">
          <Button variant="ghost" className="mb-4 bg-primary hover:bg-primary/100">
            <ArrowRight className="h-4 w-4 ml-2" />
            {t('continueShopping')}
          </Button>
        </Link>
        {cartItems.length>0 && 
         <Button
        onClick={removeAllCart}
        variant="ghost" className="mb-4 bg-destructive hover:bg-destructive/100"
        >Delete All Cart Item
        <Trash2 className="h-4 w-4 ml-2" />
        </Button>}
       
        </div>

        <h1 className="text-3xl font-bold">{t('cart')}</h1>
        <p className="text-muted-foreground mt-2">
          {cartItems.length > 0 ? t('itemsInCart', { count: cartItems.length })
          : "ابدا بتصفح المنتجات واضافتها الي السله الآن " }
        </p>
      </div>
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{t('empty')}</h2>
          <p className="text-muted-foreground mb-6">{t('emptyDesc')}</p>
          <Link href="/categories">
            <Button className="bg-primary hover:bg-primary/90">
              {t('browseProducts')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.product?.imageUrl ?? '/placeholder.svg'}
                        alt={item.product?.name ?? 'product'}
                        fill
                        className="object-cover"
                      />
                      {item.product?.isOnSale && (
                        <Badge className="absolute -top-1 -right-1 bg-primary text-xs">
                          {tc('offer')}
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-semibold hover:text-primary cursor-pointer">
                          {item.product?.name ?? 'No product'}
                        </h3>
                      </Link>

                      <p className="text-sm text-muted-foreground">
                        {item.product?.factory.name ?? ''}
                      </p>

                      <div className="flex items-center space-x-2 space-x-reverse mt-2">
                        <span className="font-bold">
                          {getItemPrice(item).toFixed(2)} JD
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {item.product?.unitType ?? ''}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        {t('minOrder', {
                          minOrder: item.product?.minOrderQuantity ?? 1,
                          unit: item.product?.unitType ?? '',
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2 ">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center space-x-2 space-x-reverse gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(item.product?.minOrderQuantity ?? 1, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= (item.product?.minOrderQuantity ?? 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={e =>
                            updateQuantity(
                              item.id,
                              Number(e.target.value) || (item.product?.minOrderQuantity ?? 1)
                            )
                          }
                          className="w-16 text-center"
                          min={item.product?.minOrderQuantity ?? 1}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          {(getItemPrice(item) * item.quantity).toFixed(2)} JD
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span>{subtotal.toFixed(2)} JD</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>{t('savings')}</span>
                    <span>-{savings.toFixed(2)} JD</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('total')}</span>
                  <span>{total.toFixed(2)} JD</span>
                </div>
                {message && <Toast message={message}/>}

                <Button 
                onClick={handleCheckOut}
                className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                  {t('checkout')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};