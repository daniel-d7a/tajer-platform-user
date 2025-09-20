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
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import Toast from '../dashboard/settings/toast';
import { usePathname } from 'next/navigation';

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
  factory: Factory;
  discountType?: string;
  discountAmount?: number;
}

interface Factory {
  name: string;
  name_ar: string;
}

interface CartItem {
  id: number;
  cartId?: number;
  productId: number;
  quantity: number;
  product: Product;
  factory: Factory;
}

interface ApiResponse {
  data?: {
    cart?: object;
    items?: CartItem[];
  };
  meta?: object;
}

export default function CartPage() {
  const [isAuthentication, setIsAuthenticated] = useState<boolean | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const [message, setMessage] = useState('');
    const [language, setLanguage] = useState('en');
    const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
    useEffect(() => {
      const segments = pathname.split("/").filter(Boolean);
      const lang = segments[0] || 'en';
      setLanguage(lang);
    }, [pathname]);
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
 
  const removeAllCart = async() => {
    if(window.confirm(t('confirmDeleteAll') || 'هل حقا ترغب في حذف سله المشتريات كامله')){
      try {
        await fetch('https://tajer-backend.tajerplatform.workers.dev/api/cart', {
          credentials: "include",
          method: "DELETE"
        });
        setCartItems([]);
      } catch (error) {
        console.error('Error deleting cart:', error);
      }
    }
  };

  const removeItem = async(id: number) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
    try {
      await fetch(`https://tajer-backend.tajerplatform.workers.dev/api/cart/items/${id}`, {
        credentials: "include",
        method: "DELETE"
      });
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleCheckOut = async () => {
    if (!isAuthenticated) { 
      router.push('/login');
      return null;
    }
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
        setMessage(t('checkoutError') || 'حصل خطا اثناء اضافه الطلبات يرجي المحاوله مره أخري لاحقا');
      } else {
        setMessage(t('checkoutSuccess') || 'تمت اضافه المنتجات الي قائمه الإنتظار سيتم توصيل طلبك في اسرع وقت');
        setCartItems([]);
      }
    } catch  {
      setMessage(t('checkoutError') || 'حصل خطا اثناء اضافه الطلبات يرجي المحاوله مره أخري لاحقا');
    }
  };

  const calculateDiscountedPrice = (product: Product) => {
    const originalPrice = product.piecePrice ?? product.price ?? 0;
    
    if (!product.discountAmount || product.discountAmount <= 0) return originalPrice;
    
    if (product.discountType === 'percentage') {
      return originalPrice * (1 - product.discountAmount / 100);
    } else {
      return Math.max(0, originalPrice - product.discountAmount);
    }
  };

  const isProductOnSale = (product: Product) => {
    return product.isOnSale || (product.discountAmount && product.discountAmount > 0);
  };

  const getItemPrice = (item: CartItem) => {
    return calculateDiscountedPrice(item.product);
  };

  const getOriginalItemPrice = (item: CartItem) => {
    return item.product.originalPrice ?? item.product.piecePrice ?? item.product.price ?? 0;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getItemPrice(item) * (item.quantity ?? 0),
    0
  );

  const originalSubtotal = cartItems.reduce(
    (acc, item) => acc + getOriginalItemPrice(item) * (item.quantity ?? 0),
    0
  );

  const savings = cartItems.reduce((acc, item) => {
    const originalPrice = getOriginalItemPrice(item);
    const discountedPrice = getItemPrice(item);
    if (originalPrice > discountedPrice) {
      return acc + (originalPrice - discountedPrice) * (item.quantity ?? 0);
    }
    return acc;
  }, 0);

  const total = subtotal;

  if (isAuthentication === null || loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('loading') || 'جاري تحميل سلة المشتريات...'}</p>
        </div>
      </div>
    );
  }

  if (!isAuthentication) return null;

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
          {cartItems.length > 0 && 
            <Button
              onClick={removeAllCart}
              variant="ghost" 
              className="mb-4 bg-destructive hover:bg-destructive/100 text-white"
            >
              {t('deleteAll') || 'Delete All Cart Item'}
              <Trash2 className="h-4 w-4 ml-2" />
            </Button>
          }
        </div>

        <h1 className="text-3xl font-bold">{t('cart')}</h1>
        <p className="text-muted-foreground mt-2">
          {cartItems.length > 0 
            ? t('itemsInCart', { count: cartItems.length })
            : t('emptyCartDesc') || "ابدا بتصفح المنتجات واضافتها الي السله الآن"
          }
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
            {cartItems.map(item => {
              const isOnSale = isProductOnSale(item.product);
              const originalPrice = getOriginalItemPrice(item);
              const discountedPrice = getItemPrice(item);
              const itemSavings = isOnSale ? (originalPrice - discountedPrice) * item.quantity : 0;
              
              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.product?.imageUrl ?? '/placeholder.svg'}
                          alt={item.product?.name ?? 'product'}
                          fill
                          className="object-cover"
                        />
                        {isOnSale && (
                          <Badge className="absolute -top-1 -right-1 bg-primary text-xs">
                            {item.product.discountType === 'percentage' 
                              ? `${item.product.discountAmount}% ${tc('offer')}` 
                              : `${item.product.discountAmount} ${tc('coins')} ${tc('offer')}`}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-semibold hover:text-primary cursor-pointer">
                            {language === "ar" ?  item.product?.name_ar : item.product?.name ?? 'No product'}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? item.product?.factory.name_ar : item.product.factory.name ?? ''}
                        </p>

                        <div className="flex space-x-2 flex-col space-x-reverse mt-2">
                          {isOnSale ? (
                            <div>
                              <span className="font-bold text-primary">
                                {discountedPrice.toFixed(2)} {tc('coins')}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                {originalPrice.toFixed(2)} {tc('coins')}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold">
                              {originalPrice.toFixed(2)} {tc('coins')}
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground">
                        {t('UnitType')} : {item.product.unitType === "piece_only" ? t('pieceOnly') : item.product.unitType === "pack_only" ? t('packOnly') : t('pieceOrPack')}
                          </span>
                        </div>
                        {isOnSale && itemSavings > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            {t('saved') || 'You saved'} {(itemSavings).toFixed(2)} {tc('coins')}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('minOrder')}
                          {item.product.minOrderQuantity}
                          {t('pieces')}
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
                          {isOnSale ? (
                            <>
                              <p className="font-bold">
                                {(discountedPrice * item.quantity).toFixed(2)} {tc('coins')}
                              </p>
                              <p className="text-sm text-muted-foreground line-through">
                                {(originalPrice * item.quantity).toFixed(2)} {tc('coins')}
                              </p>
                            </>
                          ) : (
                            <p className="font-bold">
                              {(originalPrice * item.quantity).toFixed(2)} {tc('coins')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span>{subtotal.toFixed(2)} {tc('coins')}</span>
                </div>
                {savings > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>{t('saved') || 'You saved'}</span>
                      <span>-{savings.toFixed(2)} {tc('coins')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('originalTotal') || 'Original total'}</span>
                      <span className="line-through">{originalSubtotal.toFixed(2)} {tc('coins')}</span>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('total')}</span>
                  <span>{total.toFixed(2)} {tc('coins')}</span>
                </div>
                {message && <Toast message={message}/>}
                <Button 
                  onClick={handleCheckOut}
                  className="w-full bg-secondary hover:bg-secondary/90" 
                  size="lg"
                >
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