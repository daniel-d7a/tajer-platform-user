"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface BannersType {
  id: number;
  imageUrl: string;
  link: string;
  headline: string;
}

export default function Hero() {
  const [banners, setBanners] = useState<BannersType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://tajer-backend.tajerplatform.workers.dev/api/admin/banners"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch banners: ${response.status}`);
      }

      const data = await response.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("فشل في تحميل البانرات");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length === 0) return;
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (banners.length === 0) return;
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    },
    [banners.length, currentSlide]
  );

  const handleManualNavigation = useCallback(
    (navigationFunction: () => void) => {
      setAutoPlay(false);
      navigationFunction();

      const timeout = setTimeout(() => {
        setAutoPlay(true);
      }, 10000);

      return () => clearTimeout(timeout);
    },
    []
  );

  useEffect(() => {
    if (!autoPlay || banners.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, banners.length, nextSlide]);

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="relative overflow-hidden h-[50vh] lg:h-[70vh] w-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        <span className="sr-only">جاري التحميل...</span>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="relative overflow-hidden h-[50vh] lg:h-[70vh] w-full flex items-center justify-center bg-gray-100 flex-col gap-4">
        <p className="text-lg text-gray-600">{error}</p>
        <Button onClick={fetchBanners} variant="outline">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  // إذا لم توجد بانرات
  if (banners.length === 0) {
    return (
      <div className="relative overflow-hidden h-[50vh] lg:h-[70vh] w-full flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">لا توجد بانرات متاحة</p>
      </div>
    );
  }

  return (
    <motion.div
      dir="ltr"
      className="relative overflow-hidden h-[50vh] lg:h-[70vh] w-full "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative h-full w-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{
              x: direction > 0 ? "100%" : "-100%",
              opacity: 1,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction < 0 ? "100%" : "-100%",
              opacity: 1,
            }}
            transition={{
              x: {
                type: "tween",
                ease: "easeInOut",
                duration: 0.4,
              },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <Link
              href={banners[currentSlide].link || "#"}
              className="block w-full h-full relative"
            >
              <div className="relative w-full h-full max-w-7xl mx-auto">
                <Image
                  src={banners[currentSlide].imageUrl || "/placeholder.svg"}
                  alt={banners[currentSlide].headline || "Banner image"}
                  quality={99}
                  fill
                  className="object-contain md:object-cover"
                  priority={currentSlide === 0}
                  sizes="(max-width: 2000px) 100vw, (max-width: 1200px) 100vw, 1200px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 border rounded-full p-3 shadow-lg transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 cursor-pointer"
            onClick={() => handleManualNavigation(prevSlide)}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">السابق</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 border rounded-full p-3 shadow-lg transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 cursor-pointer"
            onClick={() => handleManualNavigation(nextSlide)}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">التالي</span>
          </Button>
        </>
      )}

      {/* نقاط التحديد */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-background scale-110"
                  : "bg-background/50 hover:bg-background/70"
              }`}
              onClick={() => {
                setAutoPlay(false);
                goToSlide(index);
                setTimeout(() => setAutoPlay(true), 10000);
              }}
              aria-label={`شريحة ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
