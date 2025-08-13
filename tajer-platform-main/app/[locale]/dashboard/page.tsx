"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">جاري تحويلك لصفحة تسجيل الدخول...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1>
      <p className="text-gray-700">مرحباً، {user?.name || "مستخدم"}</p>
    </div>
  );
}
