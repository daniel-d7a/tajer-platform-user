"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LoadingAnimation from "./Loading";

export default function GlobalLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background backdrop-blur-lg">
      <LoadingAnimation />
    </div>
  );
}
