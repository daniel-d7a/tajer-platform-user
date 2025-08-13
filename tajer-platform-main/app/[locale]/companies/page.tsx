"use client";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

export default function Companies() {
  const companies = [
    {
      name: "شركة النور للتقنية",
      logo: "/library.jpg",
      description: "حلول تقنية متكاملة للأعمال والشركات.",
      link: "/companies/nour-tech"
    },
    {
      name: "مطعم الأكلات الشرقية",
      logo: "/restaurant.jpg",
      description: "أفضل المأكولات الشرقية بأجود المكونات.",
      link: "/companies/sharqy-food"
    },
    {
      name: "بقاله",
      logo: "/supermarket2.jpg",
      description: "توصيل مجموعة متنوعة من المنتجات الغذائية.",
      link: "/companies/fashion-store"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">الشركات المسجلة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {companies.map((company, i) => (
          <div
            key={i}
            className="bg-background border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center animate-fadeIn"
            style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
          >
            <Avatar className="w-full h-full mb-4">
              <AvatarImage className="w-full h-full object-cover rounded-lg" src={company.logo} alt={company.name} />

            </Avatar>

            <h3 className="text-xl font-semibold text-center mb-2">{company.name}</h3>

            <p className="text-gray-600 text-center mb-4">{company.description}</p>

            <Link
              href={company.link}
              className="bg-primary w-full text-center text-white px-4 py-2 rounded-md transition-colors"
            >
              عرض التفاصيل
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};