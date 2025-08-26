"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Offer = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  expiresAt: string;
};

export default function SpecialOffers() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  const [offersData, setOffersData] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, SetErrorMessage] = useState("");
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(
          "https://tajer-backend.tajerplatform.workers.dev/api/public/products?categoryId=&search=&page='"
        );
        const json = await res.json();
        setOffersData(
          json.data.filter((offer: Offer) =>
            offer.imageUrl.includes("https://loremflickr.com") ? false : true
          )
        );
      } catch (err) {
        console.error("something went wrong", err);
        SetErrorMessage("something went wrong, try again later please.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);
  return (
    <section className="py-12 bg-muted/30 rounded-lg">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">{t("specialOffers")}</h2>
        <p className="mt-2 text-muted-foreground">{t("specialOffersDesc")}</p>
      </div>
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 16 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse h-64" />
          ))
        ) : offersData.length > 0 ? (
          offersData.map((offer) => (
            <Link
              className="w-[100%]"
              key={offer.id}
              href={`/products/${offer.id}`}
            >
              <Card className="overflow-hidden w-[100%] transition-all hover:shadow-md h-[90%] flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={offer.imageUrl || "/placeholder.svg"}
                    alt={offer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="pt-4 flex-grow">
                  <h3 className="font-semibold text-lg">{offer.name}</h3>
                  <h3>{offer.description}</h3>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground border-t pt-4 flex flex-col gap-4">
                  <button className="w-full text-white p-2.5 text-center rounded-2xl cursor-pointer hover:bg-secondary hover:text-white border-solid border-1 duration-300 border-light-blue-500">
                    Order Now
                  </button>

                  {tc("ExpiresAt")}
                  {"  "}
                  {new Date(offer.expiresAt).toLocaleDateString("ar-JO")}
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            no offers yet
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
