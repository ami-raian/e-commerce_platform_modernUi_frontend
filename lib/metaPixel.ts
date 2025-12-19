/**
 * Meta (Facebook) Pixel Integration Library
 * Production-ready TypeScript wrapper for fbq events
 *
 * @see https://developers.facebook.com/docs/meta-pixel
 */

// Extend Window interface to include fbq
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: (...args: any[]) => void;
  }
}

// Meta Pixel Standard Event Types
export type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration';

// Meta Pixel Custom Event Types for your e-commerce
export type MetaCustomEvent =
  | 'OrderPlaced' // For manual payment (bKash/Nagad/Rocket)
  | 'PaymentMethodSelected'
  | 'PromoCodeApplied'
  | 'CategoryViewed'
  | 'FlashSaleViewed';

// Event parameter types
export interface BaseEventParams {
  currency?: string;
  value?: number;
}

export interface ViewContentParams extends BaseEventParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: 'product' | 'product_group';
}

export interface AddToCartParams extends BaseEventParams {
  content_name?: string;
  content_ids?: string[];
  content_type?: 'product';
  num_items?: number;
}

export interface InitiateCheckoutParams extends BaseEventParams {
  content_ids?: string[];
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
  num_items?: number;
}

export interface PurchaseParams extends BaseEventParams {
  content_ids?: string[];
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
  num_items?: number;
  order_id?: string;
}

export interface OrderPlacedParams extends BaseEventParams {
  order_id: string;
  payment_method?: 'bkash' | 'nagad' | 'rocket' | 'cod';
  content_ids?: string[];
  num_items?: number;
}

// Utility to check if fbq is available
const isFbqAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};

/**
 * Initialize Meta Pixel (called automatically by MetaPixel component)
 */
export const initMetaPixel = (pixelId: string): void => {
  if (!isFbqAvailable()) {
    console.warn('[Meta Pixel] fbq not available. Pixel not initialized.');
    return;
  }

  try {
    window.fbq('init', pixelId);
    console.log('[Meta Pixel] Initialized:', pixelId);
  } catch (error) {
    console.error('[Meta Pixel] Initialization error:', error);
  }
};

/**
 * Track Standard Events
 */
export const trackStandardEvent = (
  eventName: MetaStandardEvent,
  params?: Record<string, any>
): void => {
  if (!isFbqAvailable()) {
    console.warn(`[Meta Pixel] fbq not available. Event "${eventName}" not tracked.`);
    return;
  }

  try {
    window.fbq('track', eventName, params);
    console.log(`[Meta Pixel] Event tracked: ${eventName}`, params);
  } catch (error) {
    console.error(`[Meta Pixel] Error tracking ${eventName}:`, error);
  }
};

/**
 * Track Custom Events
 */
export const trackCustomEvent = (
  eventName: MetaCustomEvent,
  params?: Record<string, any>
): void => {
  if (!isFbqAvailable()) {
    console.warn(`[Meta Pixel] fbq not available. Custom event "${eventName}" not tracked.`);
    return;
  }

  try {
    window.fbq('trackCustom', eventName, params);
    console.log(`[Meta Pixel] Custom event tracked: ${eventName}`, params);
  } catch (error) {
    console.error(`[Meta Pixel] Error tracking custom ${eventName}:`, error);
  }
};

/**
 * Track PageView (automatically handled by MetaPageView component)
 */
export const trackPageView = (): void => {
  trackStandardEvent('PageView');
};

/**
 * Track ViewContent (Product Detail Page)
 */
export const trackViewContent = (params: ViewContentParams): void => {
  trackStandardEvent('ViewContent', {
    currency: 'BDT',
    ...params,
  });
};

/**
 * Track AddToCart
 */
export const trackAddToCart = (params: AddToCartParams): void => {
  trackStandardEvent('AddToCart', {
    currency: 'BDT',
    ...params,
  });
};

/**
 * Track InitiateCheckout
 */
export const trackInitiateCheckout = (params: InitiateCheckoutParams): void => {
  trackStandardEvent('InitiateCheckout', {
    currency: 'BDT',
    ...params,
  });
};

/**
 * Track Purchase (Use this ONLY if you want to fire on order success)
 * For manual payment, use trackOrderPlaced instead
 */
export const trackPurchase = (params: PurchaseParams): void => {
  trackStandardEvent('Purchase', {
    currency: 'BDT',
    ...params,
  });
};

/**
 * Track OrderPlaced (Custom Event for Manual Payment)
 * This is fired when order is placed with bKash/Nagad/Rocket
 */
export const trackOrderPlaced = (params: OrderPlacedParams): void => {
  trackCustomEvent('OrderPlaced', {
    currency: 'BDT',
    ...params,
  });
};

/**
 * Track CompleteRegistration (User Sign-up)
 */
export const trackCompleteRegistration = (): void => {
  trackStandardEvent('CompleteRegistration');
};

/**
 * Track Search
 */
export const trackSearch = (searchString: string): void => {
  trackStandardEvent('Search', {
    search_string: searchString,
  });
};

// ============================================================================
// DEDUPLICATION UTILITIES
// ============================================================================

const PIXEL_STORAGE_PREFIX = 'meta_pixel_';

/**
 * Check if an event has already been tracked (prevents double-firing on refresh)
 * @param eventKey Unique identifier for the event (e.g., "order_123456")
 * @param ttlMinutes Time-to-live in minutes (default: 60)
 */
export const hasEventBeenTracked = (
  eventKey: string,
  ttlMinutes: number = 60
): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const storageKey = `${PIXEL_STORAGE_PREFIX}${eventKey}`;
    const stored = localStorage.getItem(storageKey);

    if (!stored) return false;

    const { timestamp } = JSON.parse(stored);
    const now = Date.now();
    const ttlMs = ttlMinutes * 60 * 1000;

    // Check if event is still within TTL
    if (now - timestamp < ttlMs) {
      return true;
    }

    // Expired, remove it
    localStorage.removeItem(storageKey);
    return false;
  } catch (error) {
    console.error('[Meta Pixel] Deduplication check error:', error);
    return false;
  }
};

/**
 * Mark an event as tracked
 * @param eventKey Unique identifier for the event
 */
export const markEventAsTracked = (eventKey: string): void => {
  if (typeof window === 'undefined') return;

  try {
    const storageKey = `${PIXEL_STORAGE_PREFIX}${eventKey}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('[Meta Pixel] Error marking event as tracked:', error);
  }
};

/**
 * Track an event with automatic deduplication
 * @param eventKey Unique identifier (e.g., "order_123456")
 * @param trackFn Function to execute if event hasn't been tracked
 * @param ttlMinutes Time-to-live in minutes
 */
export const trackEventOnce = (
  eventKey: string,
  trackFn: () => void,
  ttlMinutes: number = 60
): void => {
  if (hasEventBeenTracked(eventKey, ttlMinutes)) {
    console.log(`[Meta Pixel] Event already tracked: ${eventKey}`);
    return;
  }

  trackFn();
  markEventAsTracked(eventKey);
};

/**
 * Clean up old tracking records (run periodically or on app init)
 */
export const cleanupOldTrackingRecords = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PIXEL_STORAGE_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const { timestamp } = JSON.parse(stored);
          const now = Date.now();
          const ttlMs = 60 * 60 * 1000; // 1 hour

          if (now - timestamp >= ttlMs) {
            keysToRemove.push(key);
          }
        }
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    if (keysToRemove.length > 0) {
      console.log(`[Meta Pixel] Cleaned up ${keysToRemove.length} old tracking records`);
    }
  } catch (error) {
    console.error('[Meta Pixel] Cleanup error:', error);
  }
};
