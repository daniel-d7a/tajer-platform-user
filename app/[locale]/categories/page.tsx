"use client";

import CategoryList from "@/components/categories/category-list";
import { useTranslations } from "next-intl";

export default function CategoriesPage() {
  const t = useTranslations("categories");
  return (
    <div className="w-[100%] py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6 ml-5 mr-5">{t("browseProducts")}</h1>
      <CategoryList search={""} />
    </div>
  );
}
