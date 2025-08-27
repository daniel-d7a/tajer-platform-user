"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Truck, Shield, RefreshCw } from "lucide-react";

type Offer = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  expiresAt: string;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  unitType: string;
  piecePrice: number;
  packPrice: number;
  piecesPerPack: number;
  categories: { id: number; name: string }[];
  manufacturer: string;

};
type AddCartParams = {
  id: string | number; // حسب نوع الـ id عندك
};
export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [offerData, setOfferData] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pieceOrNot, setPieceOrNot] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOffer = async () => {
      try {
        const res = await fetch(
          `https://tajer-backend.tajerplatform.workers.dev/api/public/products/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch");

        const data: Offer = await res.json();
        setOfferData(data);

        if (data.unitType === "piece_only") {
          setPieceOrNot(false);
        } else {
          setPieceOrNot(true);
        }
      } catch (err) {
        console.error("Something went wrong", err);
        setErrorMessage("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [id]);

const handleAddCart = async ({ id }: AddCartParams) => {
  try {
    const res = await fetch(
      'https://tajer-backend.tajerplatform.workers.dev/api/cart/items',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error('Error adding to cart:', err);
  }
};
  return (
    <>
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
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image
                  src={offerData.imageUrl || "/placeholder.jpg"}
                  alt={offerData.name || "Product image"}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-muted-foreground">
                    {offerData?.categories?.[0]?.name || "Uncategorized"}
                  </h3>
                  <h1 className="text-4xl font-bold mb-2">
                    {offerData?.name || "Unnamed Product"}
                  </h1>
                  <p className="text-muted-foreground">
                    {offerData.manufacturer || "Unknown Manufacturer"}
                  </p>
                </div>
                    {pieceOrNot ? (   <div className="flex items-baseline space-x-4 space-x-reverse gap-4">
                  <span className="text-3xl font-bold text-primary">
                    {offerData.piecePrice
                      ? (offerData.packPrice / offerData.piecesPerPack).toFixed(2)
                      : "0.00"}{" "}
                    JD
                  </span>
                  <span className="text-2xl text-muted-foreground line-through">
                    {offerData.piecePrice?.toFixed(2) || "0.00"} JD
                  </span>
                </div>) : (   <div className="flex items-baseline space-x-4 space-x-reverse gap-4">
                  <span className="text-3xl font-bold text-primary">
                    {offerData.piecePrice
                      ? (offerData.piecePrice ).toFixed(2)
                      : "0.00"}{" "}
                    JD
                  </span>
               
                </div>)}

             

                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Minimum Order Quantity:</strong>{" "}
                    {offerData.minOrderQuantity || 1}
                  </p>
                  {pieceOrNot && (
                    <p className="text-sm">
                      <strong>In Stock : </strong>
                      <span className="text-secondary">
                        {offerData.packPrice && offerData.piecesPerPack
                          ? (
                              offerData.packPrice / offerData.piecesPerPack
                            ).toFixed(2)
                          : "0.00"}{" "}
                        Piece
                      </span>
                    </p>
                  )}
                </div>

                <Separator />
                <div>
                  <h3>Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {offerData.description || "No description available."}
                  </p>
                </div>

                <div className="font-semibold mb-2">
                  <h3 className="font-semibold mb-2">Specifications</h3>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted-foreground">
                      Unit Type: {offerData.unitType || "N/A"}
                    </li>
                    {pieceOrNot && (
                      <>
                        <li className="text-sm text-muted-foreground">
                          Pack Price: {offerData.packPrice || "N/A"}
                        </li>
                        <li className="text-sm text-muted-foreground">
                          Pieces Per Pack: {offerData.piecesPerPack || "N/A"}
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <Separator />
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                    onClick={() => {
                      handleAddCart({ id: offerData.id });
                    }}
                  >
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    Add to Cart
                  </Button>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Truck className="h-6 w-6 text-secondary" />
                      <span className="text-xs text-muted-foreground">
                        Fast Delivery
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <Shield className="h-6 w-6 text-secondary" />
                      <span className="text-xs text-muted-foreground">
                        Quality Guarantee
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <RefreshCw className="h-6 w-6 text-secondary" />
                      <span className="text-xs text-muted-foreground">
                        Returnable
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
    </>
  );
};