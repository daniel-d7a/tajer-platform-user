"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Factory {
  id: number;
  name: string;
  name_ar: string;
  discountAmount: number;
  discountType: string | null;
  imageUrl: string | null;
  image_public_id: string | null;
}

export default function Factories() {
  const [loading, setLoading] = useState(true);
  const [factories, setFactories] = useState<Factory[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const locale = pathname.split("/")[1] || "en";
  const isRTL = locale === "ar";

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const response = await fetch(
          "https://tajer-platform-api.eyadabdou862.workers.dev/api/admin/factories/all_factories"
        );
        const data = await response.json();
        setFactories(data || []);
        if (response.ok) {
          setLoading(false);
        } else {
          setLoading(true);
        }
      } catch (error) {
        console.error("Error fetching factories:", error);
        toast.error("something went wrong please try again");
      }
    };
    fetchFactories();
  }, []);

  const duplicatedFactories = [...factories, ...factories, ...factories];

  useEffect(() => {
    if (!scrollRef.current || factories.length === 0) return;

    const scrollContainer = scrollRef.current;
    let animationFrameId: number;
    const scrollSpeed = 1.5; // سرعة ثابتة واحدة

    const animateScroll = () => {
      if (isRTL) {
        scrollContainer.scrollLeft -= scrollSpeed;
        if (scrollContainer.scrollLeft <= 0) {
          scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
        }
      } else {
        scrollContainer.scrollLeft += scrollSpeed;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animateScroll();

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleMouseLeave = () => {
      animateScroll();
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [factories.length, isRTL, pathname]);

  return (
    <section className="py-12" dir="ltr">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto hide-scrollbar gap-6 px-4 py-4"
            >
              {duplicatedFactories.map((factory, index) => (
                <Link
                  key={`${factory.id}-${index}`}
                  href={`/companies/${factory.id}`}
                  passHref
                >
                  <motion.div
                    className="flex-shrink-0 opacity-70 hover:opacity-100 rounded-lg flex items-center justify-center p-2 cursor-pointer transition-all duration-300"
                    whileHover={{
                      transition: { duration: 0.3 },
                    }}
                  >
                    {factory.imageUrl ? (
                      <div className="relative w-32 min-w-20 h-20">
                        <Image
                          src={factory.imageUrl}
                          alt={factory.name_ar || factory.name}
                          fill
                          quality={100}
                          sizes="80px"
                          className="object-contain transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <Truck
                        size={48}
                        className="text-muted-foreground opacity-50"
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
