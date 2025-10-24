"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}

export default function SuccessPopup({
  isOpen,
  onClose,
  autoCloseDelay = 3000,
}: SuccessPopupProps) {
  const t = useTranslations("cart");
  const [progress, setProgress] = useState(100);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setProgress(100);

      const intervalTime = 50;
      const decrement = 100 / (autoCloseDelay / intervalTime);

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return prev - decrement;
        });
      }, intervalTime);

      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => {
        clearInterval(timer);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isOpen, autoCloseDelay]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      setProgress(100);
    }, 300);
  };

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-background rounded-lg shadow-lg max-w-md w-full transform transition-all duration-300 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="w-full h-1 bg-muted rounded-t-lg overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-green-600">
            {t("orderSuccess") || "تم الطلب بنجاح"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <DotLottieReact
              src="/success.json"
              autoplay
              loop={true}
              style={{ height: "150px", width: "150px" }}
            />
          </div>

          <h3 className="text-xl font-bold text-green-600 mb-2">
            {t("thankYou") || "شكراً لك!"}
          </h3>

          <p className="text-muted-foreground mb-4">
            {t("successMessage") || "تم استلام طلبك بنجاح وسنتواصل معك قريباً"}
          </p>

          <div className="flex gap-3 mt-6">
            <Link href={"/categories"}>
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                {t("continueShopping") || "مواصلة التسوق"}
              </Button>
            </Link>
            <Link
              href={"/dashboard/orders"}
              className="flex-1  bg-primary rounded-md"
            >
              <Button onClick={handleClose}>
                {t("viewOrders") || "عرض الطلبات"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
