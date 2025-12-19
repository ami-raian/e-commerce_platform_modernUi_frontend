"use client";

/**
 * ProductViewTracker Component
 * Tracks ViewContent event when a product detail page is viewed
 *
 * Usage: Import and use in app/product/[id]/page.tsx
 */

import { useEffect } from "react";
import { trackViewContent } from "@/lib/metaPixel";

interface Product {
  id: string | number;
  name: string;
  price: number;
  category?: string;
  discountPercentage?: number;
}

interface ProductViewTrackerProps {
  product: Product;
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    if (!product || !product.id || !product.name) return;

    // Calculate actual price after discount
    const actualPrice = product.discountPercentage
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

    // Track ViewContent event
    trackViewContent({
      content_name: product.name,
      content_category: product.category || "Uncategorized",
      content_ids: [String(product.id)],
      content_type: "product",
      value: actualPrice,
      currency: "BDT",
    });

    console.log("[Meta Pixel] ViewContent tracked for:", product.name);
  }, [
    product.id,
    product.name,
    product.price,
    product.category,
    product.discountPercentage,
  ]);

  // This component doesn't render anything
  return null;
}
