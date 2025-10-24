"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryList from "@/components/categories/category-list";
import ProductCard from "@/components/common/CommonCard";
import { PackageX, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsData {
  data: [
    {
      id: number;
      barcode: null;
      name: string;
      name_ar: string;
      description: null;
      description_ar: null;
      unitType: "piece_only" | "pack_only" | "piece_or_pack" | string;
      piecePrice: null;
      packPrice: null;
      piecesPerPack: null;
      factoryId: number;
      imageUrl: null;
      image_public_id: null;
      minOrderQuantity: null;
      discountAmount: null;
      discountType: "percentage" | "fixed_amount" | string;
    }
  ];
  meta: {
    from: number;
    to: number;
    page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

interface CategoryData {
  data: [
    {
      id: number;
      name: string;
      name_ar: string;
      parentId: null;
      imageUrl: null;
      image_public_id: null;
      children: [
        {
          id: number;
          name: string;
          name_ar: string;
          parentId: null;
          imageUrl: null;
          image_public_id: null;
        }
      ];
    }
  ];
  meta: {
    from: number;
    to: number;
    page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export default function SpecialOffers() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const tp = useTranslations("specialProducts");
  const tb = useTranslations("buttons");
  const tn = useTranslations("noProducts");
  const to = useTranslations("orders");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search") || "";
  const [productsData, setProductsData] = useState<ProductsData>();
  const [categoriesData, setCategoriesData] = useState<CategoryData>();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("products");
  const [language, setLanguage] = useState("en");
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || "en";
    setLanguage(lang);
  }, [pathname]);
  const fetchProducts = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/public/products?categoryId=&factoryId=&search=${searchValue}&page=${pageNum}&limit=`
      );
      const json = await res.json();
      if (res.ok) {
        setProductsData(json);
        setPage(pageNum);
      } else {
        toast.error("something went wrong please try to show more");
      }
    } catch (err) {
      console.error("something went wrong", err);
      const errorMsg =
        t("errorMessage") || "something went wrong, try again later please.";
      setErrorMessage(errorMsg);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/public/categories?limit=&page=&search=${searchValue}`
      );
      const json = await res.json();
      setCategoriesData(json);
    } catch (err) {
      console.error("something went wrong", err);
      const errorMsg =
        t("errorMessage") || "something went wrong, try again later please.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
    //eslint-disable-next-line
  }, [searchValue]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (productsData?.meta.last_page || 1)) {
      fetchProducts(newPage);
    }
  };

  const getPageNumbers = () => {
    const currentPage = page;
    const lastPage = productsData?.meta.last_page || 1;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(lastPage - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < lastPage - 1) {
      rangeWithDots.push("...", lastPage);
    } else {
      rangeWithDots.push(lastPage);
    }

    return rangeWithDots.filter((x, i, a) => a.indexOf(x) === i);
  };

  if (loading) {
    return (
      <section className="py-12 rounded-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  const hasProducts = productsData?.data && productsData.data.length > 0;
  const hasCategories = categoriesData?.data && categoriesData.data.length > 0;

  if (!hasProducts && !hasCategories) {
    return (
      <section className="py-12 rounded-lg">
        <div className="w-full flex flex-col items-center justify-center py-12">
          <div className="w-full flex justify-center mb-4">
            <PackageX className="w-20 h-20 text-muted-foreground" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            {tn("title") || "لا توجد أي تصنيفات أو منتجات بهذا الاسم"}
          </h2>
          <p className="mt-2 text-muted-foreground text-center max-w-md">
            {tn("subTitle") ||
              "لا توجد أي تصنيفات أو منتجات بهذا الاسم جرب البحث بكلمة مختلفة مثل: حليب"}
          </p>
        </div>
      </section>
    );
  }
  if (hasProducts && !hasCategories) {
    return (
      <section className="py-12 rounded-lg">
        <h1 className="text-2xl font-bold mr-5 ml-5 mb-6">
          {" "}
          {tc("searchFor")} :{searchValue}
        </h1>
        <Card className="border-0">
          <CardContent className="p-6 border-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsData.data.map((product) => (
                <ProductCard
                  idx={product.id}
                  product={product}
                  key={product.id}
                  type="productGrid"
                  language={language}
                  t={tp}
                  tb={tb}
                  tc={tc}
                />
              ))}
            </div>

            {/* Pagination */}
            {productsData.meta.last_page === 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div className="text-sm text-muted-foreground">
                  {to("page")} {page} {to("of")} {productsData.meta.last_page}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {to("previous")}
                  </Button>

                  <div className="flex gap-1 mx-2">
                    {getPageNumbers().map((pageNum, index) =>
                      pageNum === "..." ? (
                        <span key={`dots-${index}`} className="px-2 py-1">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum as number)}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === productsData.meta.last_page}
                    className="flex items-center gap-1"
                  >
                    {to("next")}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!hasProducts && hasCategories) {
    return (
      <section className="py-12 rounded-lg">
        <h1 className="text-2xl font-bold mr-5 ml-5 mb-6">
          {tc("searchFor")} : {searchValue}
        </h1>
        <CategoryList search={String(searchValue)} />
      </section>
    );
  }

  return (
    <section className="py-12 rounded-lg p-5">
      <h1 className="text-2xl font-bold mb-6">
        {" "}
        {tc("searchFor")} :{searchValue}
      </h1>

      <Tabs
        defaultValue="categories"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">{t("tabsCategories")}</TabsTrigger>
          <TabsTrigger value="products">{t("tabsProducts")}</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <CategoryList search={String(searchValue)} />
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardContent className="p-6">
              <div
                dir={language === "ar" ? "rtl" : "ltr"}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {productsData?.data.map((product) => (
                  <ProductCard
                    idx={product.id}
                    product={product}
                    key={product.id}
                    language={language}
                    type="productGrid"
                    t={tp}
                    tb={tb}
                    tc={tc}
                  />
                ))}
              </div>

              {productsData?.meta.last_page &&
                productsData.meta.last_page === 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                    <div className="text-sm text-muted-foreground">
                      {to("page")} {page} {to("of")}{" "}
                      {productsData.meta.last_page}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {to("previous")}
                      </Button>

                      <div className="flex gap-1 mx-2">
                        {getPageNumbers().map((pageNum, index) =>
                          pageNum === "..." ? (
                            <span key={`dots-${index}`} className="px-2 py-1">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handlePageChange(pageNum as number)
                              }
                              className="min-w-[40px]"
                            >
                              {pageNum}
                            </Button>
                          )
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === productsData.meta.last_page}
                        className="flex items-center gap-1"
                      >
                        {to("next")}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
