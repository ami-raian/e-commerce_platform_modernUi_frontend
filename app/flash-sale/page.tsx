"use client";

import { ProductCard } from "@/components/products/product-card";
import { Zap, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useProductStore } from "@/lib/product-store";
import { getImageUrl } from "@/lib/api";

export default function FlashSalePage() {
  const { fetchFlashSaleProducts } = useProductStore();
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlashSales = async () => {
      try {
        const products = await fetchFlashSaleProducts();
        setFlashSaleProducts(products);
      } catch (error) {
        console.error("Failed to fetch flash sale products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFlashSales();
  }, [fetchFlashSaleProducts]);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { hours: prevTime.hours, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-full border border-red-500/30 shadow-lg mb-4">
            <Zap size={16} className="text-red-500 animate-pulse" />
            <span className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-semibold text-sm">
              Flash Sale - Limited Time Only!
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
            <span className="bg-linear-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Flash Sale
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Grab amazing discounts on premium products. Hurry up! Limited stock available.
          </p>

          {/* Countdown Timer */}
          <div className="inline-flex items-center gap-4 bg-card border-2 border-primary rounded-xl p-6 shadow-xl">
            <Clock size={24} className="text-primary" />
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="text-3xl font-bold">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
              <div className="text-3xl font-bold">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Loading flash sale products...</p>
          </div>
        ) : flashSaleProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {flashSaleProducts.map((product: any) => {
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
              return (
                <div key={product._id} className="relative">
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {product.discount}% OFF
                  </div>
                  <div className="relative">
                    <ProductCard
                      id={product._id}
                      name={product.name}
                      price={discountedPrice}
                      image={getImageUrl(product.images[0])}
                      category={product.category}
                      rating={product.rating}
                      sizes={product.sizes}
                    />
                    {/* Original Price */}
                    <div className="absolute top-[220px] left-8 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <span className="text-sm text-muted-foreground line-through">
                        ৳{product.price.toLocaleString('en-BD')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No flash sale products available at the moment. Check back soon!
            </p>
          </div>
        )}

        {/* Promo Code Section */}
        <div className="mt-16 bg-linear-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Use Promo Code for Extra Discount!
            </h2>
            <p className="text-muted-foreground mb-6">
              Apply promo code at checkout to get additional discount on your purchase
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-card border-2 border-primary rounded-lg px-6 py-3 shadow-lg">
                <div className="text-xs text-muted-foreground mb-1">5% Extra Discount</div>
                <div className="text-2xl font-bold text-primary">SAVE5</div>
              </div>
              <div className="bg-card border-2 border-secondary rounded-lg px-6 py-3 shadow-lg">
                <div className="text-xs text-muted-foreground mb-1">10% Extra Discount</div>
                <div className="text-2xl font-bold text-secondary">SAVE10</div>
              </div>
              <div className="bg-card border-2 border-accent rounded-lg px-6 py-3 shadow-lg">
                <div className="text-xs text-muted-foreground mb-1">15% Extra Discount</div>
                <div className="text-2xl font-bold text-accent">SAVE15</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
