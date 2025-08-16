"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { House } from "lucide-react";

export default function Page() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
const userData = JSON.parse(localStorage.getItem("data"));

    useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }else{
      console.log(userData.commercialName)
    }
  }, [isAuthenticated]);
  if (!isAuthenticated) {

    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">جاري تحويلك لصفحة تسجيل الدخول...</p>
      </div>
    );
  }

  return (
    <div className="" dir="rtl">
        <div className="w-1/5  h-[100vh]"> {/* الشريط الجانبي من المشروع  */}
            <div className="flex flex-col bg-[var(--sideBar)] items-center p-4 h-[100%] rounded-tl-2xl ">
              <h2 className="text-2xl font-bold">Tajer Dashboard</h2>
                <div className="w-full h-[70%] ">
                  <button className="w-[100%] bg-background border  rounded-lg shadow-sm hover:shadow-lg hover:bg-[var(--primary)] duration-300 text-2xl flex p-2 items-center justify-center gap-5 ">
          
                     
                  </button>
                </div>
                <div className="w-full h-[30%]">

                </div>
              </div>
        </div>
    </div>
  );
};