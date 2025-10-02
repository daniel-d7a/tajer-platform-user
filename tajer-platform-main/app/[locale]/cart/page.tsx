'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag, Boxes } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import DeleteConfirmationPopup from '@/components/DeleteCart';

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

const updateCartItemsCount = (count: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItemsCount', count.toString());
    window.dispatchEvent(new Event('cartUpdated'));
  }
};



export default function CartPage() {
  const [isAuthentication, setIsAuthenticated] = useState<boolean | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const [checkoutLoading,setCheckoutLoading] = useState(false);
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
        updateCartItemsCount(items.length);
      } catch  {
        setCartItems([]);
        updateCartItemsCount(0);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchCart();
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(prev => {
      const updatedItems = prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      );
      updateCartItemsCount(updatedItems.length);
      return updatedItems;
    });
  };
 
  const removeAllCart = async() => {
    setShowDeletePopup(true);
  };

  const confirmDeleteAll = async () => {
    try {
      await fetch('https://tajer-backend.tajerplatform.workers.dev/api/cart', {
        credentials: "include",
        method: "DELETE"
      });
      setCartItems([]);
      updateCartItemsCount(0);
      toast.success(t('deleteAllSuccess') || 'تم حذف جميع العناصر بنجاح');
    } catch (error) {
      console.error('Error deleting cart:', error);
      toast.error(t('deleteAllError') || 'حدث خطأ أثناء حذف العناصر');
    } finally {
      setShowDeletePopup(false);
    }
  };

  const removeItem = async(id: number) => {
    setCartItems(prev => {
      const updatedItems = prev.filter(i => i.id !== id);
      updateCartItemsCount(updatedItems.length);
      return updatedItems;
    });
    try {
      await fetch(`https://tajer-backend.tajerplatform.workers.dev/api/cart/items/${id}`, {
        credentials: "include",
        method: "DELETE"
      });
      toast.success(t('itemRemoved') || 'تم حذف العنصر بنجاح');
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error(t('removeError') || 'حدث خطأ أثناء حذف العنصر');
    }
  };

  const handleCheckOut = async () => {
    if (!isAuthenticated) { 
      router.push('/login');
      return null;
    }
    try {
      setCheckoutLoading(true)
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
        toast.error(t('checkoutError') || 'حصل خطا اثناء اضافه الطلبات يرجي المحاوله مره أخري لاحقا');
      } else {
        toast.success(t('checkoutSuccess') || 'تم اضافه الطلبات بنجاح');
        setCartItems([]);
        updateCartItemsCount(0);
      }
    } catch  {
        toast.error(t('checkoutError') || 'حصل خطا اثناء اضافه الطلبات يرجي المحاوله مره أخري لاحقا');
    }finally{
      setCheckoutLoading(false)
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <DeleteConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={confirmDeleteAll}
        t={t}
      />
      
      {cartItems.length === 0 ? (
        <div className="min-h-[60vh] flex items-center justify-center flex-col py-8 sm:py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <ShoppingBag className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2">{t('empty')}</h2>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">{t('emptyDesc')}</p>
            <Link href="/categories">
              <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base">
                {t('browseProducts')} <Boxes className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-6">
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0'>
                <Link href="/categories" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full sm:w-auto bg-primary text-white hover:bg-primary/100 text-sm sm:text-base">
                    <ArrowRight className="h-4 w-4 ml-2" />
                    {t('continueShopping')}
                  </Button>
                </Link>
                {cartItems.length > 0 && 
                  <Button
                    onClick={removeAllCart}
                    variant="ghost" 
                    className="w-full sm:w-auto bg-destructive hover:bg-destructive/100 text-white text-sm sm:text-base"
                  >
                    {t('deleteAll') || 'Delete All Cart Item'}
                    <Trash2 className="h-4 w-4 ml-2" />
                  </Button>
                }
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mt-4">{t('cart')}</h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {t('itemsInCart', { count: cartItems.length })}
              </p>
            </div>

            {cartItems.map(item => {
              const isOnSale = isProductOnSale(item.product);
              const originalPrice = getOriginalItemPrice(item);
              const discountedPrice = getItemPrice(item);
              const itemSavings = isOnSale ? (originalPrice - discountedPrice) * item.quantity : 0;
              
              return (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative w-full sm:w-32 h-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-lg mx-auto sm:mx-0">
                        <Image
                          src={item.product?.imageUrl ?? '/placeholder.svg'}
                          alt={item.product?.name ?? 'product'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 128px"
                        />
                        {isOnSale && (
                          <Badge className="absolute top-1 right-1 bg-primary text-xs">
                            {item.product.discountType === 'percentage' 
                              ? `${item.product.discountAmount}% ${tc('offer')}` 
                              : `${item.product.discountAmount} ${tc('coins')} ${tc('offer')}`}
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-semibold hover:text-primary cursor-pointer text-base sm:text-lg line-clamp-2">
                            {language === "ar" ?  item.product?.name_ar : item.product?.name ?? 'No product'}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === 'ar' ? item.product?.factory.name_ar : item.product.factory.name ?? ''}
                        </p>

                        <div className="mt-3 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {isOnSale ? (
                              <>
                                <span className="font-bold text-primary text-base">
                                  {discountedPrice.toFixed(2)} {tc('coins')}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {originalPrice.toFixed(2)} {tc('coins')}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-base">
                                {originalPrice.toFixed(2)} {tc('coins')}
                              </span>
                            )}
                          </div>
                          
                          <span className="text-xs sm:text-sm text-muted-foreground block">
                            {t('UnitType')} : {item.product.unitType === "piece_only" ? t('pieceOnly') : item.product.unitType === "pack_only" ? t('packOnly') : t('pieceOrPack')}
                          </span>
                          
                          {isOnSale && itemSavings > 0 && (
                            <p className="text-xs text-green-600">
                              {t('saved') || 'You saved'} {(itemSavings).toFixed(2)} {tc('coins')}
                            </p>
                          )}
                          
                          <p className="text-xs text-muted-foreground">
                            {t('minOrder')} {item.product.minOrderQuantity} {t('pieces')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-3 w-full sm:w-auto">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive self-end"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(item.product?.minOrderQuantity ?? 1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= (item.product?.minOrderQuantity ?? 1)}
                            >
                              <Minus className="h-3 w-3" />
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
                              className="w-12 h-8 text-center text-sm"
                              min={item.product?.minOrderQuantity ?? 1}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right ml-2">
                            {isOnSale ? (
                              <>
                                <p className="font-bold text-sm sm:text-base">
                                  {(discountedPrice * item.quantity).toFixed(2)} {tc('coins')}
                                </p>
                                <p className="text-xs text-muted-foreground line-through">
                                  {(originalPrice * item.quantity).toFixed(2)} {tc('coins')}
                                </p>
                              </>
                            ) : (
                              <p className="font-bold text-sm sm:text-base">
                                {(originalPrice * item.quantity).toFixed(2)} {tc('coins')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4 sm:top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">{t('orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>{t('subtotal')}</span>
                  <span>{subtotal.toFixed(2)} {tc('coins')}</span>
                </div>
                {savings > 0 && (
                  <>
                    <div className="flex justify-between text-green-600 text-sm sm:text-base">
                      <span>{t('saved') || 'You saved'}</span>
                      <span>-{savings.toFixed(2)} {tc('coins')}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                      <span>{t('originalTotal') || 'Original total'}</span>
                      <span className="line-through">{originalSubtotal.toFixed(2)} {tc('coins')}</span>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>{t('total')}</span>
                  <span>{total.toFixed(2)} {tc('coins')}</span>
                </div>
                <Button 
                  onClick={handleCheckOut}
                  className={`w-full bg-secondary hover:bg-secondary/90 text-sm sm:text-base
                    ${checkoutLoading ? "opacity-60 cursor-not-allowed": "" }
                    `}
                  size="lg"
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-white"></div>
                      <span>جاري المعالجة...</span>
                    </div>
                  ) : t('checkout') }
                </Button>
              </CardContent>
            </Card>
          </div>
          <p className='w-60 lg:w-150 opacity-60 text-sm'>{t('note')}</p>
        </div>
      )}
    </div>
  );
}