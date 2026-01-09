"use client";

import Link from "next/link";
import { Star, ShoppingCart, Zap, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";
import { getProductUrl } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  name: string;
  mainPrice: number;
  price: number;
  discountPercent: number;
  image: string;
  category: string;
  rating: number;
  sizes?: string[];
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
  sizes = [],
}: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const setDirectPurchaseItem = useCartStore((state) => state.setDirectPurchaseItem);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"buy" | "cart" | null>(null);

  const handleAddToCart = () => {
    if (sizes.length > 0) {
      setPendingAction("cart");
      setSizeModalOpen(true);
      return;
    }

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

  const handleBuyNow = () => {
    if (sizes.length > 0) {
      setPendingAction("buy");
      setSizeModalOpen(true);
      return;
    }

    setDirectPurchaseItem({
      productId: id,
      name,
      price,
      quantity: 1,
      image,
    });

    toast.success("Redirecting to checkout...", {
      duration: 1500,
    });

    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

  const handleSizeSelection = (size: string) => {
    setSizeModalOpen(false);

    if (pendingAction === "buy") {
      setDirectPurchaseItem({
        productId: id,
        name,
        price,
        quantity: 1,
        image,
        size: size,
      });

      toast.success("Redirecting to checkout...", {
        duration: 1500,
      });

      setTimeout(() => {
        router.push("/checkout");
      }, 500);
    } else if (pendingAction === "cart") {
      addItem({
        productId: id,
        name,
        price,
        quantity: 1,
        image,
        size: size,
      });

      toast.success(`${name} added to cart!`, {
        description: `৳${price.toLocaleString("en-BD")} - Quantity: 1 - Size: ${size}`,
        duration: 2000,
      });
    }

    setPendingAction(null);
  };

  return (
    <>
      <div className="group cursor-pointer relative">
        <Link href={getProductUrl(id, name)}>
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

              {/* Buy Now Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleBuyNow();
                }}
                className="w-full mt-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 text-sm flex items-center justify-center gap-2 rounded-lg transition-colors"
              >
                <Zap size={16} />
                Buy Now
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Size Selection Modal */}
      {sizeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSizeModalOpen(false)}
        >
          <div
            className="bg-background border border-border rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Select Your Size</h2>
              <button
                onClick={() => setSizeModalOpen(false)}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <img
                  src={image || "/placeholder.svg"}
                  alt={name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
                  <p className="text-primary font-bold">৳{price.toLocaleString("en-BD")}</p>
                </div>
              </div>

              {/* Size Buttons */}
              <div>
                <p className="text-sm font-medium mb-3 text-muted-foreground">
                  Choose a size to continue
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelection(size)}
                      className="py-4 border-2 border-border rounded-lg font-semibold text-lg hover:border-primary hover:bg-accent transition-all hover:scale-105 active:scale-95"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Chart */}
              <div className="bg-accent/30 border border-border rounded-lg p-5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>📏</span>
                  Size Chart (in inches)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left py-3 px-4 font-bold text-foreground">SIZE</th>
                        <th className="text-center py-3 px-4 font-bold text-foreground">WIDTH</th>
                        <th className="text-center py-3 px-4 font-bold text-foreground">LENGTH</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-lg">M</td>
                        <td className="text-center py-3 px-4 text-lg">40</td>
                        <td className="text-center py-3 px-4 text-lg">26</td>
                      </tr>
                      <tr className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-lg">L</td>
                        <td className="text-center py-3 px-4 text-lg">41</td>
                        <td className="text-center py-3 px-4 text-lg">27</td>
                      </tr>
                      <tr className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-lg">XL</td>
                        <td className="text-center py-3 px-4 text-lg">42</td>
                        <td className="text-center py-3 px-4 text-lg">28</td>
                      </tr>
                      <tr className="hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-lg">XXL</td>
                        <td className="text-center py-3 px-4 text-lg">44</td>
                        <td className="text-center py-3 px-4 text-lg">29</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Help Text */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  💡 <strong>Tip:</strong> Measure your favorite garment and compare with our size chart for the perfect fit!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
