'use client';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface Product {
  id: number;
  name: string;
  name_ar?: string;
  imageUrl?: string;
  price?: number;
  piecePrice?: number;
  originalPrice?: number;
  isOnSale?: boolean;
  discountType?: string;
  discountAmount?: number;
  factory: {
    name: string;
    name_ar: string;
  };
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cartItems: CartItem[];
  total: number;
  loading?: boolean;
}



export default function CheckoutPopup({
  isOpen,
  onClose,
  onConfirm,
  cartItems,
  total,
  loading = false
}: CheckoutPopupProps) {
  const t = useTranslations('cart');
  const tc = useTranslations('common');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{t('confirmCheckout') || 'تأكيد الطلب'}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[60vh] p-4">
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">{t('orderSummary')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('itemsCount') || 'عدد المنتجات'}</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('totalItems') || 'إجمالي القطع'}</span>
                  <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t">
                  <span>{t('total')}</span>
                  <span>{total.toFixed(2)} {tc('coins')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

        
        </div>

        <div className="flex gap-3 p-4 border-t bg-muted/20">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            {t('cancel') || 'إلغاء'}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-secondary hover:bg-secondary/90"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                {t('processing') || 'جاري المعالجة...'}
              </div>
            ) : (
              `${t('confirmCheckout') || 'تأكيد الشراء'} = ${total.toFixed(2)} ${tc('coins')}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};