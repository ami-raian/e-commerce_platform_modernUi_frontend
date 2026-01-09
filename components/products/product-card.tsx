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
              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">👕</span>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Select Size <span className="text-red-500">*</span>
                  </p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Click on a size below to continue with your purchase
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelection(size)}
                      className="py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg font-bold text-base hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Chart */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700/50 border border-blue-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                  <span>📏</span>
                  Size Chart (inches)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/60 dark:bg-gray-900/40">
                        <th className="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white rounded-tl-md">Size</th>
                        <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-white">Width</th>
                        <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-white rounded-tr-md">Length</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/40 dark:bg-gray-900/20">
                      <tr className="hover:bg-blue-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">M</td>
                        <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">40</td>
                        <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">26</td>
                      </tr>
                      <tr className="hover:bg-blue-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">L</td>
                        <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">41</td>
                        <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">27</td>
                      </tr>
                      <tr className="hover:bg-blue-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">XL</td>
                        <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">42</td>
                        <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">28</td>
                      </tr>
                      <tr className="hover:bg-blue-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-2 px-3 font-medium text-gray-900 dark:text-white rounded-bl-md">XXL</td>
                        <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">44</td>
                        <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300 rounded-br-md">29</td>
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
