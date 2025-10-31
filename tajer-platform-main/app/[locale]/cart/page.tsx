"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  House,
  TicketSlash,
  Settings,
  Truck,
  ShoppingCart,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import DeleteConfirmationPopup from "@/components/DeleteCart";
import ImageUpScale from "@/components/ImageUpScale";
import CheckoutPopup from "@/components/common/CheckoutPopup";
import SuccessPopup from "@/components/common/Success";

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
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItemsCount", count.toString());
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

// Utility functions
function getNormalizedPath(pathname: string) {
  const parts = pathname.split("/");
  if (["en", "ar"].includes(parts[1])) {
    return "/" + parts.slice(2).join("/");
  }
  return pathname;
}

function isActiveRoute(currentPath: string, linkHref: string) {
  const normalizedPath = getNormalizedPath(currentPath);
  if (linkHref === "/dashboard") {
    return normalizedPath === "/dashboard";
  }
  return normalizedPath === linkHref;
}

// Sidebar Button Component
const SidebarButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}> = ({ label, icon, href, active = false }) => {
  return (
    <Link
      href={href}
      className={`
        relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-base 
        hover:bg-muted/50 hover:text-secondary overflow-hidden
        ${
          active
            ? "text-primary bg-primary/10 shadow-sm shadow-primary/20"
            : "text-foreground"
        }
      `}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl" />
      )}

      {active && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full transition-all duration-300" />
      )}

      <span
        className={`relative z-10 w-5 h-5 flex items-center justify-center transition-transform duration-300 ${
          active ? "scale-110" : "scale-100"
        }`}
      >
        {icon}
      </span>

      <span
        className={`relative z-10 font-medium transition-all duration-300 ${
          active ? "translate-x-1" : "translate-x-0"
        }`}
      >
        {label}
      </span>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </Link>
  );
};

// Bottom Navigation Mobile Component
const BottomNavMobile: React.FC<{
  pathname: string | null;
  sidebarLinks: Array<{ label: string; icon: React.ReactNode; href: string }>;
  isAuthenticated: boolean;
}> = ({ pathname, sidebarLinks, isAuthenticated }) => {
  if (!isAuthenticated) return null;

  return (
    <nav className="fixed bg-background border-t flex lg:hidden justify-between px-2 py-3 shadow-lg w-full bottom-0 left-0 z-50">
      {sidebarLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            relative flex flex-col items-center flex-1 py-1 px-2 text-xs transition-all duration-300
            ${
              isActiveRoute(pathname || "", item.href)
                ? "text-primary font-semibold scale-110"
                : "text-muted-foreground"
            }
          `}
        >
          {isActiveRoute(pathname || "", item.href) && (
            <div className="absolute -top-3 w-full h-0.5 bg-primary rounded-full scale-105 transition-all duration-300" />
          )}

          <span
            className={`mb-1 transition-transform duration-300 ${
              isActiveRoute(pathname || "", item.href)
                ? "scale-110"
                : "scale-100"
            }`}
          >
            {item.icon}
          </span>

          <span className="text-[10px] leading-tight transition-all duration-300">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

// Dashboard Layout Component
const DashboardLayout: React.FC<{
  children: React.ReactNode;
  isAuthenticated: boolean;
}> = ({ children, isAuthenticated }) => {
  const tc = useTranslations("common");
  const td = useTranslations("dashboard");
  const pathname = usePathname();
  const [language, setLanguage] = useState("en");

  const sidebarLinks = [
    { label: td("labels.main"), icon: <House />, href: "/dashboard" },
    {
      label: td("labels.invoices"),
      icon: <TicketSlash />,
      href: "/dashboard/invoice",
    },
    { label: td("labels.cart"), icon: <ShoppingBag />, href: "/cart" },
    { label: td("labels.orders"), icon: <Truck />, href: "/dashboard/orders" },
    {
      label: td("labels.settings"),
      icon: <Settings />,
      href: "/dashboard/settings",
    },
  ];

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || "en";
    setLanguage(lang);
  }, [pathname]);

  return (
    <div
      className="flex min-h-screen w-full bg-background"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Sidebar - يظهر فقط لو مسجل دخول */}
      {isAuthenticated && (
        <div className="hidden lg:block w-64 bg-background border-r">
          <aside className="sticky top-0 h-fit w-64 p-6 font-cairo flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-2">{tc("DashboardTitle")}</h2>
            <nav className="flex-1 flex flex-col gap-2">
              {sidebarLinks.map((item) => (
                <SidebarButton
                  key={item.href}
                  label={item.label}
                  icon={item.icon}
                  href={item.href}
                  active={isActiveRoute(pathname, item.href)}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isAuthenticated ? "flex-1 min-w-0" : "w-full"}`}>
        <div className="p-4 md:p-6 space-y-6 pb-16 md:pb-0">
          {/* Page Content */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>

      {/* Bottom Navigation Mobile - يظهر فقط لو مسجل دخول */}
      <BottomNavMobile
        pathname={pathname}
        sidebarLinks={sidebarLinks}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

// Cart Content Component
function CartContent() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [open, setOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || "en";
    setLanguage(lang);
  }, [pathname]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://tajer-backend.tajerplatform.workers.dev/api/cart",
          { credentials: "include" }
        );
        const res: ApiResponse = await response.json();
        const items = res?.data?.items ?? [];
        setCartItems(items);
        updateCartItemsCount(items.length);
      } catch {
        setCartItems([]);
        updateCartItemsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems((prev) => {
      const updatedItems = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      );
      updateCartItemsCount(updatedItems.length);
      return updatedItems;
    });
  };

  const removeAllCart = async () => {
    setShowDeletePopup(true);
  };

  const confirmDeleteAll = async () => {
    try {
      await fetch("https://tajer-backend.tajerplatform.workers.dev/api/cart", {
        credentials: "include",
        method: "DELETE",
      });
      setCartItems([]);
      updateCartItemsCount(0);
      toast.success(t("deleteAllSuccess") || "تم حذف جميع العناصر بنجاح");
    } catch (error) {
      console.error("Error deleting cart:", error);
      toast.error(t("deleteAllError") || "حدث خطأ أثناء حذف العناصر");
    } finally {
      setShowDeletePopup(false);
    }
  };

  const removeItem = async (id: number) => {
    setCartItems((prev) => {
      const updatedItems = prev.filter((i) => i.id !== id);
      updateCartItemsCount(updatedItems.length);
      return updatedItems;
    });
    try {
      await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/cart/items/${id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      toast.success(t("itemRemoved") || "تم حذف العنصر بنجاح");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error(t("removeError") || "حدث خطأ أثناء حذف العنصر");
    }
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setShowCheckoutPopup(true);
  };

  const handleConfirmCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const response = await fetch(
        "https://tajer-backend.tajerplatform.workers.dev/api/orders/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems.map((cartItem) => ({
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              factoryStatus: "PENDING_FACTORY",
              factoryBatchId: null,
            })),
          }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error(
          t("checkoutError") ||
            "حصل خطا اثناء اضافه الطلبات يرجي المحاوله مره أخري لاحقا"
        );
      } else {
        toast.success(t("checkoutSuccess") || "تم اضافه الطلبات بنجاح");
        setCartItems([]);
        updateCartItemsCount(0);
        setShowCheckoutPopup(false);
        setShowSuccessPopup(true);
      }
    } catch {
      toast.error(
        t("checkoutError") ||
          "حصل خطا اثناء اضافه الطلبات يرجي المحاوله مره أخري لاحقا"
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const calculateDiscountedPrice = (product: Product) => {
    const originalPrice = product.piecePrice ?? product.price ?? 0;

    if (!product.discountAmount || product.discountAmount <= 0)
      return originalPrice;

    if (product.discountType === "percentage") {
      return originalPrice * (1 - product.discountAmount / 100);
    } else {
      return Math.max(0, originalPrice - product.discountAmount);
    }
  };

  const isProductOnSale = (product: Product) => {
    return (
      product.isOnSale || (product.discountAmount && product.discountAmount > 0)
    );
  };

  const getItemPrice = (item: CartItem) => {
    return calculateDiscountedPrice(item.product);
  };

  const getOriginalItemPrice = (item: CartItem) => {
    return (
      item.product.originalPrice ??
      item.product.piecePrice ??
      item.product.price ??
      0
    );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("loading") || "جاري تحميل سلة المشتريات..."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeleteConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={confirmDeleteAll}
        t={t}
      />

      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        autoCloseDelay={10000}
      />

      <CheckoutPopup
        isOpen={showCheckoutPopup}
        onClose={() => setShowCheckoutPopup(false)}
        onConfirm={handleConfirmCheckout}
        cartItems={cartItems}
        total={total}
        loading={checkoutLoading}
      />

      {cartItems.length === 0 ? (
        <div className="min-h-[60vh] flex items-center justify-center flex-col py-8 sm:py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <ShoppingBag className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
              {t("empty")}
            </h2>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              {t("emptyDesc")}
            </p>
            <Link href="/categories">
              <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base">
                {t("browseProducts")} <ShoppingCart className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <Link href="/categories" className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto bg-primary text-white hover:bg-primary/100 text-sm sm:text-base"
                >
                  <ArrowRight className="h-4 w-4 ml-2" />
                  {t("continueShopping")}
                </Button>
              </Link>
              {cartItems.length > 0 && (
                <Button
                  onClick={removeAllCart}
                  variant="ghost"
                  className="w-full sm:w-auto bg-destructive hover:bg-destructive/100 text-white text-sm sm:text-base"
                >
                  {t("deleteAll") || "Delete All Cart Item"}
                  <Trash2 className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mt-4">{t("cart")}</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {t("itemsInCart", { count: cartItems.length })}
            </p>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const isOnSale = isProductOnSale(item.product);
              const originalPrice = getOriginalItemPrice(item);
              const discountedPrice = getItemPrice(item);
              const itemSavings = isOnSale
                ? (originalPrice - discountedPrice) * item.quantity
                : 0;
              return (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative w-full sm:w-32 h-32 cursor-zoom-in sm:h-32 flex-shrink-0 overflow-hidden rounded-lg mx-auto sm:mx-0">
                        <Image
                          src={item.product?.imageUrl ?? "/placeholder.svg"}
                          alt={item.product?.name ?? "product"}
                          fill
                          onClick={() => {
                            setOpen(true);
                            setSelectedImage(
                              item.product?.imageUrl ?? "/placeholder.svg"
                            );
                          }}
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 128px"
                        />
                        {isOnSale && (
                          <Badge className="absolute top-1 right-1 bg-primary text-xs">
                            {item.product.discountType === "percentage"
                              ? `${item.product.discountAmount}% ${tc("offer")}`
                              : `${item.product.discountAmount} ${tc(
                                  "coins"
                                )} ${tc("offer")}`}
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-semibold hover:text-primary cursor-pointer text-base sm:text-lg line-clamp-2">
                            {language === "ar"
                              ? item.product?.name_ar
                              : item.product?.name ?? "No product"}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === "ar"
                            ? item.product?.factory.name_ar
                            : item.product.factory.name ?? ""}
                        </p>

                        <div className="mt-3 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {isOnSale ? (
                              <>
                                <span className="font-bold text-primary text-base">
                                  {discountedPrice.toFixed(2)} {tc("coins")}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {originalPrice.toFixed(2)} {tc("coins")}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-base">
                                {originalPrice.toFixed(2)} {tc("coins")}
                              </span>
                            )}
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground block">
                            {t("UnitType")} :{" "}
                            {item.product.unitType === "piece_only"
                              ? t("pieceOnly")
                              : item.product.unitType === "pack_only"
                              ? t("packOnly")
                              : t("pieceOrPack")}
                          </span>
                          {isOnSale && itemSavings > 0 && (
                            <p className="text-xs text-green-600">
                              {t("saved") || "You saved"}{" "}
                              {itemSavings.toFixed(2)} {tc("coins")}
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground">
                            {t("minOrder")} {item.product.minOrderQuantity}{" "}
                            {t("pieces")}
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
                                  Math.max(
                                    item.product?.minOrderQuantity ?? 1,
                                    item.quantity - 1
                                  )
                                )
                              }
                              disabled={
                                item.quantity <=
                                (item.product?.minOrderQuantity ?? 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  Number(e.target.value) ||
                                    (item.product?.minOrderQuantity ?? 1)
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
                                  {(discountedPrice * item.quantity).toFixed(2)}{" "}
                                  {tc("coins")}
                                </p>
                                <p className="text-xs text-muted-foreground line-through">
                                  {(originalPrice * item.quantity).toFixed(2)}{" "}
                                  {tc("coins")}
                                </p>
                              </>
                            ) : (
                              <p className="font-bold text-sm sm:text-base">
                                {(originalPrice * item.quantity).toFixed(2)}{" "}
                                {tc("coins")}
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

          {/* Order Summary - Moved to bottom */}
          <div className="mt-8">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">
                  {t("orderSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>{t("subtotal")}</span>
                  <span>
                    {subtotal.toFixed(2)} {tc("coins")}
                  </span>
                </div>
                {savings > 0 && (
                  <>
                    <div className="flex justify-between text-green-600 text-sm sm:text-base">
                      <span>{t("saved") || "You saved"}</span>
                      <span>
                        -{savings.toFixed(2)} {tc("coins")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                      <span>{t("originalTotal") || "Original total"}</span>
                      <span className="line-through">
                        {originalSubtotal.toFixed(2)} {tc("coins")}
                      </span>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>{t("total")}</span>
                  <span>
                    {total.toFixed(2)} {tc("coins")}
                  </span>
                </div>
                <Button
                  onClick={handleCheckoutClick}
                  className="w-full bg-secondary hover:bg-secondary/90 text-sm sm:text-base"
                  size="lg"
                >
                  {t("checkout")}
                </Button>
              </CardContent>
            </Card>

            <p className="mt-4 opacity-60 text-sm mb-5">{t("note")}</p>
          </div>
        </div>
      )}

      {open && selectedImage && (
        <ImageUpScale
          src={selectedImage}
          alt="cart items image"
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// Main Cart Page Component
export default function CartPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout isAuthenticated={isAuthenticated}>
      <CartContent />
    </DashboardLayout>
  );
}
