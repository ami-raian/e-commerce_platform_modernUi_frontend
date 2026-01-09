"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { ArrowLeft, Star, ShoppingCart, Zap, Eye, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useProductStore, type Product } from "@/lib/product-store";
import Image from "next/image";
import { getImageUrl } from "@/lib/api";
import { toast } from "sonner";
import { ProductViewTracker } from "@/components/tracking/product-view-tracker";
import { extractIdFromSlug, getProductUrl } from "@/lib/utils";

export default function ProductPage({
  params,
}: {
  params: Promise<{ "slug-id": string }>;
}) {
  const { "slug-id": slugId } = use(params);
  const id = extractIdFromSlug(slugId);
  const router = useRouter();
  const { loading, fetchProductById } = useProductStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const p = await fetchProductById(id);
      if (!cancelled) {
        setProduct(p);
        setIsInitialLoad(false);
        // Update document title for SEO
        if (p) {
          document.title = `${p.name} - ৳${p.price.toLocaleString("en-BD")} | Margen`;
          
          // Redirect to proper SEO URL if user accessed with just ID
          const properUrl = getProductUrl(id, p.name);
          if (slugId === id && properUrl !== `/product/${slugId}`) {
            router.replace(properUrl);
          }
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchProductById, id, slugId, router]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"buy" | "cart" | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const setDirectPurchaseItem = useCartStore(
    (state) => state.setDirectPurchaseItem
  );

  const promoCodes: { [key: string]: number } = {
    SAVE5: 5,
    SAVE10: 10,
    SAVE15: 15,
    WELCOME20: 20,
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);
      setPromoMessage(`Promo code applied! ${promoCodes[code]}% discount`);
    } else {
      setDiscount(0);
      setPromoMessage("Invalid promo code");
    }
    setTimeout(() => setPromoMessage(""), 3000);
  };

  const calculateFinalPrice = () => {
    if (!product) return 0;
    // Apply promo code discount on top of the already discounted price
    if (discount > 0) {
      return product.price - (product.price * discount) / 100;
    }
    return product.price;
  };
  
  // Show skeleton during initial load
  if (isInitialLoad || (loading && !product)) {
    return (
      <div className="container-xl py-8">
        <div className="flex items-center gap-2 mb-8 animate-pulse">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Skeleton + Title/Description/Rating below */}
          <div className="space-y-3">
            {/* Main Image Skeleton */}
            <div className="relative bg-gray-200 h-96 rounded-lg overflow-hidden animate-pulse"></div>

            {/* Thumbnails Skeleton */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded bg-gray-200 animate-pulse"
                ></div>
              ))}
            </div>

            {/* Title, Description, Rating - Below images */}
            <div className="pt-6 space-y-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Title */}
              <div className="h-10 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Price Box */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-5 space-y-3 animate-pulse">
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
                <div className="h-12 w-32 bg-gray-300 rounded"></div>
              </div>
              <div className="bg-gray-200 rounded-md p-3 h-10"></div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-16 h-10 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 space-y-3 animate-pulse">
              <div className="h-5 w-40 bg-gray-300 rounded"></div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-24 h-10 bg-gray-300 rounded-lg"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="w-full h-14 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="w-full h-14 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show not found only after loading is complete
  if (!isInitialLoad && !loading && !product) {
    return (
      <div className="container-xl py-8">
        <Link
          href="/products"
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>
        <div className="text-center py-16">
          <h1 className="section-title mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link href="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // If still loading or no product yet, show skeleton
  if (!product) {
    return (
      <div className="container-xl py-8">
        <div className="flex items-center gap-2 mb-8 animate-pulse">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Validate size selection if product has sizes
    if (product.sizes.length > 0 && !selectedSize) {
      setPendingAction("cart");
      setSizeModalOpen(true);
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image:
        product.images?.[0] ?? (product as any).image ?? "/placeholder.svg",
      size: selectedSize || undefined,
    });

    const sizeInfo = selectedSize ? ` - Size: ${selectedSize}` : "";
    toast.success(`${product.name} added to cart!`, {
      description: `৳${product.price.toLocaleString("en-BD")} - Quantity: ${quantity}${sizeInfo}`,
      duration: 2000,
    });
  };

  const handleBuyNow = () => {
    // Validate size selection if product has sizes
    if (product.sizes.length > 0 && !selectedSize) {
      setPendingAction("buy");
      setSizeModalOpen(true);
      return;
    }

    // Set as direct purchase item (not added to cart)
    const purchaseItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image:
        product.images?.[0] ?? (product as any).image ?? "/placeholder.svg",
      size: selectedSize || undefined,
    };

    setDirectPurchaseItem(purchaseItem);

    // Show toast
    toast.success("Redirecting to checkout...", {
      duration: 1500,
    });

    // Redirect to checkout
    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    setSizeModalOpen(false);

    // Execute pending action
    if (pendingAction === "buy") {
      const purchaseItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image:
          product.images?.[0] ?? (product as any).image ?? "/placeholder.svg",
        size: size,
      };

      setDirectPurchaseItem(purchaseItem);

      toast.success("Redirecting to checkout...", {
        duration: 1500,
      });

      setTimeout(() => {
        router.push("/checkout");
      }, 500);
    } else if (pendingAction === "cart") {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image:
          product.images?.[0] ?? (product as any).image ?? "/placeholder.svg",
        size: size,
      });

      toast.success(`${product.name} added to cart!`, {
        description: `৳${product.price.toLocaleString("en-BD")} - Quantity: ${quantity} - Size: ${size}`,
        duration: 2000,
      });
    }

    setPendingAction(null);
  };

  return (
    <div className="container-xl py-8">
      <ProductViewTracker
        product={{
          id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          discountPercentage: product.discountPercent,
        }}
      />

      <Link
        href="/products"
        className="flex items-center gap-2 text-primary hover:underline mb-8"
      >
        <ArrowLeft size={20} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image - main + thumbnails (supports 1-5 images) */}
        <div className="space-y-3">
          <div className="relative bg-accent h-96 rounded-lg overflow-hidden flex items-center justify-center group">
            {/* Discount Badge - Top Right */}
            {product.discountPercent > 0 && (
              <div className="absolute top-3 right-3 z-20 bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-bold shadow-lg">
                -{Math.round(product.discountPercent)}% OFF
              </div>
            )}

            <button
              aria-label="Previous image"
              onClick={() => setSelectedImageIndex((i) => Math.max(0, i - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 text-white rounded-full hover:bg-black/40 cursor-pointer"
            >
              ‹
            </button>

            <Image
              src={getImageUrl(
                product.images?.[selectedImageIndex] ??
                  product.images?.[0] ??
                  "/placeholder.svg"
              )}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* View Icon on Hover */}
            <button
              onClick={() => {
                setLightboxImageIndex(selectedImageIndex);
                setLightboxOpen(true);
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
              aria-label="View image in full size"
            >
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Eye size={32} className="text-gray-800" />
              </div>
            </button>

            <button
              aria-label="Next image"
              onClick={() =>
                setSelectedImageIndex((i) =>
                  Math.min((product.images?.length ?? 1) - 1, i + 1)
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 text-white rounded-full hover:bg-black/40 cursor-pointer"
            >
              ›
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2">
            {(product.images ?? ["/placeholder.svg"])
              ?.slice(0, 5)
              .map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded overflow-hidden border cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-primary"
                      : "border-border"
                  }`}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`${product.name} ${idx + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </button>
              ))}
          </div>

          {/* Title and Description - Moved below images */}
          <div className="pt-6 space-y-4">
            {/* Rating - Moved above title */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "text-border"
                    }
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{product.rating} / 5</span>
            </div>

            <h1 className="text-4xl font-serif font-bold text-balance">
              {product.name}
            </h1>
            <div className="text-base leading-relaxed text-muted-foreground space-y-3">
              {product.description.split("\n").map((paragraph, idx) => {
                // Check if line starts with bullet point indicators
                if (
                  paragraph.trim().startsWith("•") ||
                  paragraph.trim().startsWith("-") ||
                  paragraph.trim().startsWith("*")
                ) {
                  return (
                    <li key={idx} className="ml-4 list-disc list-inside">
                      {paragraph.trim().replace(/^[•\-*]\s*/, "")}
                    </li>
                  );
                }
                // Check if it's a key-value pair (e.g., "Material: Cotton")
                else if (
                  paragraph.includes(":") &&
                  paragraph.split(":")[0].length < 30
                ) {
                  const [key, value] = paragraph.split(":");
                  return (
                    <p key={idx} className="flex gap-2">
                      <span className="font-semibold text-foreground">
                        {key.trim()}:
                      </span>
                      <span>{value?.trim()}</span>
                    </p>
                  );
                }
                // Regular paragraph
                else if (paragraph.trim()) {
                  return (
                    <p key={idx} className="text-foreground/90">
                      {paragraph.trim()}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">

          {/* Price */}
          <div className="bg-accent/30 border border-border rounded-lg p-5 space-y-3">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Price</p>
            <div className="flex items-center gap-4 flex-wrap">
              {product.discountPercent > 0 && (
                <p className="text-xl text-muted-foreground/60 line-through">
                  ৳{product.mainPrice.toLocaleString("en-BD")}
                </p>
              )}
              <p className="text-5xl font-bold text-primary">
                ৳{(discount > 0
                  ? calculateFinalPrice()
                  : product.price
                ).toLocaleString("en-BD")}
              </p>
            </div>
            {product.discountPercent > 0 && discount === 0 && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-md px-3 py-2">
                <p className="text-green-700 dark:text-green-400 font-semibold text-sm">
                  💰 You save ৳{(product.mainPrice - product.price).toLocaleString("en-BD")} ({Math.round(product.discountPercent)}% off)
                </p>
              </div>
            )}
            {discount > 0 && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-md px-3 py-2">
                <p className="text-green-700 dark:text-green-400 font-semibold text-sm">
                  🎉 Extra promo discount: ৳{(product.price - calculateFinalPrice()).toLocaleString("en-BD")} ({discount}% off with code)
                </p>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">
              {product.stock} in stock
            </span>
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Select Size</p>
                  {selectedSize && (
                    <span className="text-xs text-primary font-semibold">
                      Selected: {selectedSize}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSizeModalOpen(true)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  View Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border hover:border-primary hover:bg-accent"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center text-xl font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="bg-accent/50 border border-border rounded-lg p-4 space-y-3">
            <p className="font-semibold">Have a Promo Code?</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={applyPromoCode}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p
                className={`text-sm font-medium ${
                  promoMessage.includes("Invalid")
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {promoMessage}
              </p>
            )}
            {/* <div className="pt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                Available promo codes:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  SAVE5
                </span>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  SAVE10
                </span>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  SAVE15
                </span>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  WELCOME20
                </span>
              </div>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleBuyNow}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 text-lg flex items-center justify-center gap-2 rounded-lg transition-colors"
            >
              <Zap size={24} />
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart size={24} />
              Add to Cart
            </button>
            {/* {addedToCart && (
              <p className="text-center text-green-600 font-medium">
                Added to cart!
              </p>
            )} */}
            <div className="py-4">
              <Link
                href="/products"
                className="w-full btn-secondary text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t border-border pt-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Category
              </p>
              <p className="capitalize font-semibold">{product.category}</p>
            </div>
            {product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Available Sizes
                </p>
                <p className="font-semibold">{product.sizes.join(", ")}</p>
              </div>
            )}
            {/* <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                SKU
              </p>
              <p className="font-mono text-sm">{product._id}</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 cursor-pointer"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImageIndex((i) => Math.max(0, i - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-50 cursor-pointer"
            disabled={lightboxImageIndex === 0}
            aria-label="Previous image"
          >
            <span className="text-3xl">‹</span>
          </button>

          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getImageUrl(
                product.images?.[lightboxImageIndex] ??
                  product.images?.[0] ??
                  "/placeholder.svg"
              )}
              alt={`${product.name} - Image ${lightboxImageIndex + 1}`}
              width={1920}
              height={1920}
              className="max-w-full max-h-full object-contain rounded-lg cursor-default"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {lightboxImageIndex + 1} / {product.images?.length ?? 1}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImageIndex((i) =>
                Math.min((product.images?.length ?? 1) - 1, i + 1)
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-50 cursor-pointer"
            disabled={lightboxImageIndex === (product.images?.length ?? 1) - 1}
            aria-label="Next image"
          >
            <span className="text-3xl">›</span>
          </button>
        </div>
      )}

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
              {/* Size Buttons */}
              <div>
                <p className="text-sm font-medium mb-3 text-muted-foreground">
                  Choose a size to continue
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
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
    </div>
  );
}
