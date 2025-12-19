'use client';

/**
 * CheckoutTracker Component
 * Tracks InitiateCheckout event when checkout page is viewed
 *
 * Usage: Import and use in app/checkout/page.tsx
 */

import { useEffect } from 'react';
import { trackInitiateCheckout } from '@/lib/metaPixel';
import { useCartStore } from '@/lib/cart-store';

export function CheckoutTracker() {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  useEffect(() => {
    if (items.length === 0) return;

    // Prepare contents data
    const contents = items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
      item_price: item.price,
    }));

    const contentIds = items.map((item) => item.productId);

    // Track InitiateCheckout event
    trackInitiateCheckout({
      content_ids: contentIds,
      contents: contents,
      num_items: getItemCount(),
      value: getTotal(),
      currency: 'BDT',
    });
  }, []); // Only track once on mount

  // This component doesn't render anything
  return null;
}
