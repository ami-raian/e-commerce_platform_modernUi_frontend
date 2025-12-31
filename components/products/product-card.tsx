"use client";

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";
import { getProductUrl } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  mainPrice: number;
  price: number;
  discountPercent: number;
  image: string;
  category: string;
  rating: number;
}

export function ProductCard({
  id,
  name,
  mainPrice,
  price,
  discountPercent,
  image,
  category,
  rating,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      price,
      quantity: 1,
      image,
    });
    toast.success(`${name} added to cart!`, {
      description: `৳${price.toLocaleString("en-BD")} - Quantity: 1`,
      duration: 2000,
    });
  };

  return (
    <Link href={getProductUrl(id, name)} className="group cursor-pointer">
      <div className="card overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="bg-accent h-48 flex items-center justify-center overflow-hidden rounded-lg mb-4 relative">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
              -{Math.round(discountPercent)}%
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1" title={name}>
            {name}
          </h3>

          <div className="flex items-center gap-1 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(rating)
                      ? "fill-primary text-primary"
                      : "text-border"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({rating})</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col gap-1">
              {discountPercent > 0 ? (
                <>
                  <span className="text-primary font-bold text-lg">
                    ৳{price.toLocaleString("en-BD")}
                  </span>
                  <span className="text-muted-foreground text-sm line-through">
                    ৳{mainPrice.toLocaleString("en-BD")}
                  </span>
                </>
              ) : (
                <span className="text-primary font-bold text-lg">
                  ৳{price.toLocaleString("en-BD")}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
