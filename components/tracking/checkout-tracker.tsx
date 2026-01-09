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
  const directPurchaseItem = useCartStore((state) => state.directPurchaseItem);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  useEffect(() => {
    // Use direct purchase item if available, otherwise use cart items
    const checkoutItems = directPurchaseItem ? [directPurchaseItem] : items;

    if (checkoutItems.length === 0) return;

    // Prepare contents data
    const contents = checkoutItems.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
      item_price: item.price,
    }));

    const contentIds = checkoutItems.map((item) => item.productId);

    // Calculate total value
    const totalValue = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate total quantity
    const totalQuantity = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

    // Track InitiateCheckout event
    trackInitiateCheckout({
      content_ids: contentIds,
      contents: contents,
      num_items: totalQuantity,
      value: totalValue,
      currency: 'BDT',
    });

    console.log('[Meta Pixel] InitiateCheckout tracked:', {
      num_items: totalQuantity,
      value: totalValue,
      content_ids: contentIds,
    });
  }, []); // Only track once on mount

  // This component doesn't render anything
  return null;
}
