'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';

const fakeCartItems = [
  {
    id: 1,
    productId: 1,
    name: 'زيت زيتون فاخر',
    image: '/placeholder.svg?height=100&width=100',
    price: 65.0,
    originalPrice: 75.0,
    unit: 'لتر',
    quantity: 12,
    minOrder: 6,
    company: 'شركة الزيوت العالمية',
    isOnSale: true,
  },
  {
    id: 2,
    productId: 2,
    name: 'أرز بسمتي',
    image: '/placeholder.svg?height=100&width=100',
    price: 120.0,
    unit: 'كيس 5 كجم',
    quantity: 20,
    minOrder: 10,
    company: 'شركة الغذاء الوطنية',
    isOnSale: false,
  },
  {
    id: 3,
    productId: 4,
    name: 'مناديل ورقية',
    image: '/placeholder.svg?height=100&width=100',
    price: 10.0,
    originalPrice: 12.0,
    unit: 'عبوة',
    quantity: 30,
    minOrder: 20,
    company: 'شركة النظافة العالمية',
    isOnSale: true,
  },
];

export default function CartPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [cartItems, setCartItems] = useState(fakeCartItems);
  const router = useRouter();

  const t = useTranslations('cart');
  const tc = useTranslations('common');

  useEffect(() => {
    const checkAuth = () => {
      // Simulate an authentication check

      // const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsAuthenticated(true);

      // if (!isLoggedIn) {
      //   router.push('/login?redirect=/cart');
      // }
    };

    checkAuth();
  }, [router]);

  const updateQuantity = (id: number, newQuantity: number) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    if (newQuantity < item.minOrder) {
      alert(t('minOrder', { minOrder: item.minOrder, unit: item.unit }));
      return;
    }

    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.isOnSale && item.originalPrice) {
        return total + (item.originalPrice - item.price) * item.quantity;
      }
      return total;
    }, 0);
  };

  if (isAuthenticated === null) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>جاري التحقق من حالة تسجيل الدخول...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const subtotal = calculateSubtotal();
  const savings = calculateSavings();
  const deliveryFee = 15.0;
  const total = subtotal + deliveryFee;

  return (
    <div className="w-[90%] mx-auto py-8">
      <div className="mb-6">
        <Link href="/categories">
          <Button variant="ghost" className="mb-4">
            <ArrowRight className="h-4 w-4 ml-2" />
            {t('continueShopping')}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t('cart')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('itemsInCart', { count: cartItems.length })}
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
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      {item.isOnSale && (
                        <Badge className="absolute -top-1 -right-1 bg-primary text-xs">
                          {tc('offer')}
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-semibold hover:text-primary cursor-pointer">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.company}
                      </p>

                      <div className="flex items-center space-x-2 space-x-reverse mt-2">
                        {item.isOnSale && item.originalPrice ? (
                          <>
                            <span className="font-bold text-primary">
                              {item.price.toFixed(2)} JD
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {item.originalPrice.toFixed(2)} JD
                            </span>
                          </>
                        ) : (
                          <span className="font-bold">
                            {item.price.toFixed(2)} JD
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          / {item.unit}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        {t('minOrder', {
                          minOrder: item.minOrder,
                          unit: item.unit,
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(item.minOrder, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= item.minOrder}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={e =>
                            updateQuantity(
                              item.id,
                              Number.parseInt(e.target.value) || item.minOrder
                            )
                          }
                          className="w-16 text-center"
                          min={item.minOrder}
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
                          {(item.price * item.quantity).toFixed(2)} JD
                        </p>
                        {item.isOnSale && item.originalPrice && (
                          <p className="text-xs text-secondary">
                            {t('saved')}
                            {(
                              (item.originalPrice - item.price) *
                              item.quantity
                            ).toFixed(2)}{' '}
                            JD
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
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

                <div className="flex justify-between">
                  <span>{t('deliveryFee')}</span>
                  <span>{deliveryFee.toFixed(2)} JD</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>{t('total')}</span>
                  <span>{total.toFixed(2)} JD</span>
                </div>

                <Button
                  className="w-full bg-secondary hover:bg-secondary/90"
                  size="lg"
                >
                  {t('checkout')}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>{t('deliveryTime')}</p>
                  <p>{t('codAvailable')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
