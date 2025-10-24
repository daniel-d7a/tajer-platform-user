"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import ProductGrid from "@/components/products/product-grid";
import { useTranslations } from "next-intl";
interface factoryNames {
  name: string;
  name_ar: string;
}
export default function Page() {
  const t = useTranslations("factories");
  const { name } = useParams();
  const pathname = usePathname();
  const [language, setLanguage] = useState<string>("");
  const [loadings, setLoading] = useState(true);
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0];
    setLanguage(lang);
  }, [pathname]);
  const [factoryName, setFactoryName] = useState<factoryNames>();
  const fetchFactoryName = async () => {
    try {
      const response = await fetch(
        "https://tajer-backend.tajerplatform.workers.dev/api/admin/factories/" +
          name,
        { credentials: "include" }
      );
      const data = await response.json();
      setFactoryName(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFactoryName();
    //eslint-disable-next-line
  }, []);
  return (
    <div className="p-6 flex flex-col gap-10">
      {loadings ? (
        <div className="col-span-5 flex items-center h-full justify-center gap-2">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <h2 className="text-4xl font-bold text-center">
            {" "}
            {t("factoryProducts")}{" "}
            {language === "ar" ? factoryName?.name_ar : factoryName?.name}{" "}
          </h2>
          <ProductGrid factoryId={Number(name)} categoryId={0} />
        </>
      )}
    </div>
  );
}
