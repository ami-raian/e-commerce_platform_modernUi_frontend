'use client';

/**
 * OrderTracker Component
 * Tracks OrderPlaced (custom event) or Purchase (standard event) when order is confirmed
 *
 * IMPORTANT: Includes deduplication logic to prevent double-firing on page refresh
 *
 * Usage: Import and use in app/order-confirmation/page.tsx
 */

import { useEffect } from 'react';
import { trackOrderPlaced, trackPurchase, trackEventOnce } from '@/lib/metaPixel';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderTrackerProps {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: 'bkash' | 'nagad' | 'rocket' | 'cod';
  /**
   * Set to true if you want to fire the standard "Purchase" event instead of "OrderPlaced"
   * Use this ONLY if payment is confirmed (not for manual payment methods)
   */
  usePurchaseEvent?: boolean;
}

export function OrderTracker({
  orderId,
  items,
  totalAmount,
  paymentMethod = 'cod',
  usePurchaseEvent = false,
}: OrderTrackerProps) {
  useEffect(() => {
    if (!orderId || items.length === 0) {
      console.warn('[OrderTracker] Missing orderId or items. Event not tracked.');
      return;
    }

    // Prepare tracking data
    const contentIds = items.map((item) => item.productId);
    const contents = items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
      item_price: item.price,
    }));
    const numItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Track with deduplication (prevents double-firing on refresh)
    const eventKey = `order_${orderId}`;

    if (usePurchaseEvent) {
      // Fire standard Purchase event (for confirmed payments only)
      trackEventOnce(
        eventKey,
        () => {
          trackPurchase({
            order_id: orderId,
            content_ids: contentIds,
            contents: contents,
            num_items: numItems,
            value: totalAmount,
            currency: 'BDT',
          });
        },
        60 // TTL: 60 minutes
      );
    } else {
      // Fire custom OrderPlaced event (for manual payment methods)
      trackEventOnce(
        eventKey,
        () => {
          trackOrderPlaced({
            order_id: orderId,
            payment_method: paymentMethod,
            content_ids: contentIds,
            num_items: numItems,
            value: totalAmount,
            currency: 'BDT',
          });
        },
        60 // TTL: 60 minutes
      );
    }
  }, []); // Only run once on mount

  // This component doesn't render anything
  return null;
}
