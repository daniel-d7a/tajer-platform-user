"use client";
import  { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Truck, Shield, RefreshCw, Plus, Minus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {Link} from '@/i18n/navigation';
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProductGrid from "@/components/products/product-grid";
import toast from "react-hot-toast";
import ImageUpScale from "@/components/ImageUpScale";
import { useAuth } from "@/components/auth/auth-provider";
type Offer = { 
  id: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  imageUrl: string;
  expiresAt: string;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  unitType: string;
  piecePrice: number;
  packPrice: number;
  piecesPerPack: number;
  
  categories: { 
    id: number; 
    name: string;
    name_ar: string; 
  }[];
  manufacturer: string;
  factory: {
    name: string;
    name_ar: string;
  };
  discountType?: string;
  discountAmount?: number;
};
type AddCartParams = {
  id: string | number;
};


export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const tS = useTranslations("specialProducts");
  const {isAuthenticated} = useAuth()
  const tP = useTranslations('product');
  const tid = useTranslations('productId');
  const [language, setLanguage] = useState('en');
  const pathname = usePathname();
  const [offerData, setOfferData] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loadingCart, setLoadingCart] = useState(false);
  const [categoryIds, setCategoryIDS] = useState<number[]>([]);
  const [productData,setProductData] = useState([]);
  const [loadingProduct,setLoadingProduct] = useState(true);
  const [selectedImage,setSelectedImage] = useState('')
  const [open,setOpen] = useState(false)
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || 'en';
    setLanguage(lang);
  }, [pathname]);
const fetchProductById = async () => {
  try {
    const res = await fetch(
      `https://tajer-backend.tajerplatform.workers.dev/api/public/products?categoryId=${categoryIds}&factoryId=&search=&page=&limit=`
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const response = await res.json();
        if (response && response.data) {
      setProductData(response.data);
    } else {
      setProductData([]);
    };
  } catch {
    setProductData([]);
    setErrorMessage("Something went wrong. Please try again later.");
  } finally {
    setLoadingProduct(false);
  }
};
 const fetchOffer = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://tajer-backend.tajerplatform.workers.dev/api/public/products/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Offer = await res.json();
        setOfferData(data);
        setCategoryIDS(data?.categories?.map((category) => category.id));
      } catch {
        setOfferData(null);
        setErrorMessage("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    if (!id) return;
    fetchOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setQuantity(offerData?.minOrderQuantity ?? 1);
          fetchProductById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerData]);

const updateCartItemsCount = (count: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItemsCount', count.toString());
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

const handleAddCart = async ({ id }: AddCartParams) => {
  if(isAuthenticated) {
  try {
    setLoadingCart(true);
    const res = await fetch(
      "https://tajer-backend.tajerplatform.workers.dev/api/cart/items",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity: quantity,
        }),
      }
    );
    if (!res.ok) {
      toast.error(tP('errorMessage'));
      throw new Error(`HTTP error! status: ${res.status}`);
    } else {
      setLoadingCart(false);
      toast.success(tP('succesMessage'));
      
      const currentCount = getCartItemsCount();
      updateCartItemsCount(currentCount + 1); 
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error adding to cart:", err);
    setLoadingCart(false);
  }
  }else{
    router.push('/login')
  }
};
const getCartItemsCount = (): number => {
  if (typeof window !== 'undefined') {
    const count = localStorage.getItem('cartItemsCount');
    return count ? parseInt(count) : 0;
  }
  return 0;
};
  const calculateDiscountedPrice = (offer: Offer, isPack: boolean = false) => {
    const originalPrice = isPack ? offer.packPrice : offer.piecePrice;
    
    if (!offer.discountAmount || offer.discountAmount <= 0) return originalPrice;
    
    if (offer.discountType === 'percentage') {
      return originalPrice * (1 - offer.discountAmount / 100);
    } else {
      return Math.max(0, originalPrice - offer.discountAmount);
    }
  };

  const isProductOnSale = (offer: Offer) => {
    return offer.discountAmount && offer.discountAmount > 0;
  };
  return (
    <>
    <div dir={language === 'ar' ? "rtl" : "ltr"} className="flex flex-col gap-3">
      <Head>
        <title>{offerData?.name || "Product Details"}</title>
        <meta
          name="description" 
          content={offerData?.description || "Check out this amazing product."}
        />
      </Head>
      <section className="py-12 bg-muted/30 rounded-lg">
        <div className="w-full mx-auto gap-6">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 w-full">
              <Card className="animate-pulse h-[400px]" />
              <div className="space-y-4">
                <Card className="animate-pulse h-10 w-1/2" />
                <Card className="animate-pulse h-6 w-1/3" />
                <Card className="animate-pulse h-20 w-full" />
              </div>
            </div>
          ) : offerData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 w-full">
              <div className="relative pt-[100%] cursor-zoom-in">
                {isProductOnSale(offerData) && (
                  <Badge className="absolute top-2 right-2 bg-primary z-10">
                    {offerData.discountType === 'percentage' 
                      ? `${offerData.discountAmount}% ${tP('offer')}` 
                      : `${offerData.discountAmount} ${tid('coins')} ${tP('offer')}`}
                  </Badge>
                )}
                <Image
                  src={offerData.imageUrl || "/placeholder.jpg"}
                  alt={language === 'ar' ? offerData.name_ar : offerData.name || "Product image"}
                  fill
                  onClick={() =>{
                    setOpen(true)
                    setSelectedImage(offerData.imageUrl)
                  }}
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {language === 'ar' ? offerData.name_ar : offerData.name}
                  </h1>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? offerData.factory.name_ar : offerData.factory.name || "Unknown Manufacturer"}
                  </p>
                </div>
                <div className="flex items-center space-x-4 gap-1">
                  {isProductOnSale(offerData) ? (
                    <div className="flex gap-2 items-center">
                      <span className="text-3xl font-bold text-primary">
                        {calculateDiscountedPrice(offerData).toFixed(2)} {tid('coins')}
                      </span>
                      <span className="text-2xl text-muted-foreground line-through">
                        {(offerData.piecePrice).toFixed(2)} {tid('coins')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {calculateDiscountedPrice(offerData).toFixed(2)} {tid('coins')}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>{tid('MinimumOrderQuantity')}</strong>{" "}
                    {offerData.minOrderQuantity || 1}
                  </p>
                  {(offerData.unitType === "pack_only" || offerData.unitType === "piece_or_pack") && (
                    <p className="text-sm">
                      <strong>{tS('piecesPerPack')}: </strong>
                      <span className="text-secondary">
                        {offerData.piecesPerPack || "N/A"}
                      </span>
                    </p>
                  )}
                </div>
                    <h2 className="font-semibold mb-2">{tid('category')}</h2>
                    <div className="flex gap-2">
                    {offerData?.categories?.map((e) => (
                      <Link
                       href={`/categories/${e.id}`}
                       key={e.id}
                       className="text-sm  bg-primary/50 w-fit px-2  py-1 rounded-md hover:bg-primary/10"
                       >
                        {language === 'en' ? e.name : e.name_ar}
                        </Link>
                    ))}
                  </div>
                <Separator />
                <div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{tid('description')}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'en' ? offerData.description : offerData.description_ar || "No description available."}
                  </p>
                </div>
                <div className="font-semibold mb-2">
                  <h3 className="font-semibold mb-2">{tid('Specifications')}</h3>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted-foreground">
                      {tS('UnitType')}: {offerData.unitType === "piece_only" ? tS('pieceOnly') : offerData.unitType === "pack_only" ? tS('packOnly') : tS('pieceOrPack')}
                    </li>
                    {(offerData.unitType === "pack_only" || offerData.unitType === "piece_or_pack") && (
                      <div className="flex gap-2 flex-col">
                        <li className="text-sm text-muted-foreground">
                          {tS('PackPrice')}: {calculateDiscountedPrice(offerData, true).toFixed(2)} {tid('coins')}
                          {isProductOnSale(offerData) && (
                            <span className="line-through text-muted-foreground ml-2">
                              {offerData.packPrice.toFixed(2)} {tid('coins')}
                            </span>
                          )}
                        </li>
                        <li className="text-sm text-muted-foreground">
                          {tS('piecesPerPack')}: {offerData.piecesPerPack || "N/A"}
                        </li>
                      </div>
                    )}
                  </ul>
                </div>
                <div className="flex gap-2 items-center">
                  <p>{tid('Quantity')}</p>
                  <div className="flex items-center space-x-2 gap-1">
                    <Button
                      variant="outline"
                      size="icon"

                      disabled={quantity <= (offerData?.minOrderQuantity || 1) || loadingCart}
                      onClick={() => {
                        if (quantity > (offerData?.minOrderQuantity || 1)) {
                          setQuantity(quantity - 1);
                        };
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      min={offerData?.minOrderQuantity || 1}
                      disabled= {loadingCart}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= (offerData?.minOrderQuantity || 1)) {
                          setQuantity(value);
                        }
                      }}
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      disabled = {loadingCart}
                      onClick={() => {
                        setQuantity(quantity + 1);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                    onClick={() => {
                      handleAddCart({ id: offerData.id });
                    }}
                    disabled={loadingCart}
                  >
                    {loadingCart ? (
                      <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 ml-2" />
                        {tP('addToCart')}
                      </div>
                    )}
                  </Button>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Truck className="h-6 w-6 text-secondary" />
                      <span className="text-xs text-muted-foreground">
                        {tP('fastDelivery')}
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <Shield className="h-6 w-6 text-secondary" />
                      <span className="text-xs text-muted-foreground">
                        {tP('qualityGuarantee')}
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <RefreshCw className="h-6 w-6 text-secondary" />
                      <span className="text-xs text-muted-foreground">
                        {tP('returnable')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              {errorMessage || "No offer found."}
            </div>
          )}
        </div>
      </section>
       <section
      className="py-12 bg-muted/30 rounded-lg flex flex-col jusitfy-center items-center w-full"
      >
      {loadingProduct ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-[100%]">
      {Array.from({ length: 4 }).map((_, idx) => (
      <Card key={idx} className="animate-pulse h-full p-5">
        <Skeleton className="h-48 w-full" />
        <CardContent className="p-4 flex-grow">
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-6 w-1/4" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-8 w-full" />
        </CardFooter>
      </Card>
    ))}    
    </div>
      ) : productData.length > 0 ? (
        <div className="w-[95%] ">
          <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{tP("Browsemoreproducts")}</h2>
      </div>
        
            <ProductGrid  categoryId={categoryIds} factoryId={0}/>
        </div>
      ) : (
        <div className="col-span-full text-center text-muted-foreground">
          {tP('NoProduct')} {offerData?.name}
        </div>
      )}
      </section>
    </div>
      {open && selectedImage && (
        <ImageUpScale alt="image product"onClose = {() => setOpen(false)} src={selectedImage} />
      )}
        </>

  );
};