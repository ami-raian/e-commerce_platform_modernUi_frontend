# Meta (Facebook) Pixel Setup Guide - Marqen E-Commerce

## 🎯 Overview

This guide explains how to use the production-ready Meta Pixel integration that has been installed in your Next.js e-commerce platform.

---

## 📦 What Has Been Installed

### Core Files Created

1. **`lib/metaPixel.ts`** - Main pixel tracking library with TypeScript types
2. **`components/providers/meta-pixel-provider.tsx`** - Base pixel script injector
3. **`components/providers/meta-page-view-provider.tsx`** - Automatic PageView tracking
4. **`components/tracking/product-view-tracker.tsx`** - Product ViewContent tracking
5. **`components/tracking/checkout-tracker.tsx`** - InitiateCheckout tracking
6. **`components/tracking/order-tracker.tsx`** - Order completion tracking with deduplication
7. **`app/layout.tsx`** - Updated with pixel integration

### Modified Files

- **`app/layout.tsx`** - Added MetaPixel and MetaPageView components
- **`lib/cart-store.ts`** - Added AddToCart tracking
- **`.env.local`** - Added NEXT_PUBLIC_META_PIXEL_ID variable

---

## 🚀 Quick Start

### Step 1: Get Your Meta Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Select your business or create a new pixel
3. Copy your Pixel ID (16-digit number, e.g., `1234567890123456`)

### Step 2: Add Pixel ID to Environment Variables

Open `.env.local` and replace `YOUR_PIXEL_ID_HERE`:

```env
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
```

### Step 3: Restart Your Development Server

```bash
npm run dev
```

### Step 4: Verify Installation

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper) Chrome extension
2. Visit your website
3. Click the extension icon - you should see your Pixel ID with a green checkmark

---

## 📊 Events Being Tracked

### ✅ Automatic Events (Already Working)

| Event | Description | Trigger | File |
|-------|-------------|---------|------|
| **PageView** | User views any page | Every route change | `meta-page-view-provider.tsx` |
| **AddToCart** | User adds item to cart | Click "Add to Cart" button | `cart-store.ts` |

### 🔧 Manual Integration Required

The following tracker components are ready but need to be added to your pages:

#### 1. **ViewContent** - Product Detail Page

**File to update:** `app/product/[id]/page.tsx`

Add this import and component:

```tsx
import { ProductViewTracker } from '@/components/tracking/product-view-tracker';

// Inside your component, after fetching product data:
<ProductViewTracker product={product} />
```

**Full example:**

```tsx
'use client';

import { ProductViewTracker } from '@/components/tracking/product-view-tracker';
import { useEffect, useState } from 'react';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Your existing product fetch logic
    fetchProduct(params.id).then(setProduct);
  }, [params.id]);

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <ProductViewTracker product={product} />
      {/* Your existing product UI */}
    </>
  );
}
```

---

#### 2. **InitiateCheckout** - Checkout Page

**File to update:** `app/checkout/page.tsx`

Add this import and component:

```tsx
import { CheckoutTracker } from '@/components/tracking/checkout-tracker';

// Inside your component:
<CheckoutTracker />
```

**Full example:**

```tsx
'use client';

import { CheckoutTracker } from '@/components/tracking/checkout-tracker';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export default function CheckoutPage() {
  return (
    <>
      <CheckoutTracker />
      <div className="container">
        <h1>Checkout</h1>
        <CheckoutForm />
      </div>
    </>
  );
}
```

---

#### 3. **OrderPlaced** - Order Confirmation Page

**File to update:** `app/order-confirmation/page.tsx`

Add this import and component:

```tsx
import { OrderTracker } from '@/components/tracking/order-tracker';

// Inside your component, after fetching order data:
<OrderTracker
  orderId={orderId}
  items={orderItems}
  totalAmount={totalAmount}
  paymentMethod="bkash" // or "nagad", "rocket", "cod"
  usePurchaseEvent={false} // Set to true only if payment is confirmed
/>
```

**Full example:**

```tsx
'use client';

import { OrderTracker } from '@/components/tracking/order-tracker';
import { useSearchParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Your existing order data
  const orderItems = [
    { productId: '123', name: 'T-Shirt', price: 500, quantity: 2 },
    { productId: '456', name: 'Jeans', price: 1200, quantity: 1 },
  ];
  const totalAmount = 2200;
  const paymentMethod = 'bkash';

  return (
    <>
      <OrderTracker
        orderId={orderId}
        items={orderItems}
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        usePurchaseEvent={false}
      />
      <div className="container">
        <h1>Order Confirmed!</h1>
        <p>Order ID: {orderId}</p>
      </div>
    </>
  );
}
```

---

## 🔐 Deduplication (Prevents Double-Firing)

The **OrderTracker** component includes automatic deduplication logic:

- Events are stored in `localStorage` with a 60-minute TTL
- If user refreshes the order confirmation page, the event won't fire again
- Uses `orderId` as the unique key

**How it works:**

```typescript
// Automatically handled inside OrderTracker
trackEventOnce(
  `order_${orderId}`, // Unique key
  () => trackOrderPlaced({ ... }), // Event to fire
  60 // TTL in minutes
);
```

---

## 🎨 Custom Events

You can track custom events using the library functions:

```typescript
import { trackCustomEvent } from '@/lib/metaPixel';

// Example: Track promo code usage
trackCustomEvent('PromoCodeApplied', {
  promo_code: 'SUMMER25',
  discount_amount: 100,
  currency: 'BDT',
});

// Example: Track flash sale view
trackCustomEvent('FlashSaleViewed', {
  sale_name: 'Eid Mega Sale',
  currency: 'BDT',
});
```

---

## 🧪 Testing & Verification

### Method 1: Meta Pixel Helper (Chrome Extension)

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper)
2. Visit your website
3. Click the extension icon
4. You should see:
   - ✅ Pixel loaded correctly (green checkmark)
   - Event list showing PageView, AddToCart, etc.

### Method 2: Events Manager Test Events

1. Go to [Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel
3. Click "Test Events" tab
4. Enter your website URL
5. Perform actions (add to cart, checkout, etc.)
6. Events should appear in real-time

### Method 3: Browser Console

Open browser DevTools → Console. You should see logs like:

```
[Meta Pixel] Initialized: 1234567890123456
[Meta Pixel] Event tracked: PageView
[Meta Pixel] Event tracked: AddToCart { content_name: "T-Shirt", value: 500, ... }
```

---

## 🐛 Debugging Tips

### Pixel Not Loading?

**Check 1:** Verify Pixel ID in `.env.local`
```bash
# Should be:
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456

# NOT:
NEXT_PUBLIC_META_PIXEL_ID=YOUR_PIXEL_ID_HERE
```

**Check 2:** Restart dev server after changing `.env.local`
```bash
npm run dev
```

**Check 3:** Check browser console for errors
- Look for `[Meta Pixel]` logs
- Check for script loading errors

---

### Events Not Firing?

**Check 1:** Ensure tracker components are mounted
- `ProductViewTracker` inside product page
- `CheckoutTracker` inside checkout page
- `OrderTracker` inside order confirmation page

**Check 2:** Verify data is available
```tsx
// Product must be loaded before tracker fires
if (!product) return <div>Loading...</div>;

return (
  <>
    <ProductViewTracker product={product} />
    {/* ... */}
  </>
);
```

**Check 3:** Check browser console
- Events should show `[Meta Pixel] Event tracked: ...`

---

### Events Firing Twice?

**Solution:** OrderTracker has built-in deduplication
- Events are tracked only once per orderId
- Uses localStorage with 60-minute TTL
- Automatic cleanup of old records

---

## 🎯 Event Types Reference

### Standard Events (Meta Predefined)

| Event | When to Fire | Parameters |
|-------|--------------|------------|
| `PageView` | Every page load | None |
| `ViewContent` | Product detail page | content_name, content_ids, value, currency |
| `AddToCart` | Add to cart action | content_name, content_ids, value, num_items |
| `InitiateCheckout` | Checkout page load | content_ids, contents, num_items, value |
| `Purchase` | Payment confirmed | order_id, content_ids, value, num_items |

### Custom Events (Your E-Commerce)

| Event | When to Fire | Parameters |
|-------|--------------|------------|
| `OrderPlaced` | Order placed (manual payment) | order_id, payment_method, value, num_items |
| `PromoCodeApplied` | Promo code used | promo_code, discount_amount |
| `FlashSaleViewed` | Flash sale page viewed | sale_name |
| `CategoryViewed` | Category page viewed | category_name |

---

## 🔄 OrderPlaced vs Purchase

### **OrderPlaced** (Custom Event) - DEFAULT

Use for **manual payment methods** (bKash, Nagad, Rocket, COD):

```tsx
<OrderTracker
  orderId="ORD-12345"
  items={orderItems}
  totalAmount={2200}
  paymentMethod="bkash"
  usePurchaseEvent={false} // Default
/>
```

**Why?** Payment is not confirmed when order is placed. Customer still needs to send money.

### **Purchase** (Standard Event) - OPTIONAL

Use ONLY when **payment is confirmed**:

```tsx
<OrderTracker
  orderId="ORD-12345"
  items={orderItems}
  totalAmount={2200}
  usePurchaseEvent={true} // Fire Purchase instead
/>
```

**When to use?**
- Online payment gateway integration (Stripe, PayPal)
- Payment verified via webhook
- You have a separate payment confirmation page

---

## 📈 Next Steps (Optional Improvements)

### 1. **Server-Side Tracking (Conversions API)**

For better tracking accuracy and iOS 14+ privacy:
- Set up Meta Conversions API (CAPI)
- Send events from backend
- Bypass ad blockers

**Resources:**
- [Meta Conversions API Docs](https://developers.facebook.com/docs/marketing-api/conversions-api)

### 2. **Advanced Matching**

Improve event matching by sending user data:

```typescript
trackPurchase({
  order_id: 'ORD-12345',
  value: 2200,
  // Advanced Matching
  em: hashEmail('user@example.com'), // SHA256 hashed email
  ph: hashPhone('+8801234567890'), // SHA256 hashed phone
  fn: 'John', // First name
  ln: 'Doe', // Last name
  ct: 'Dhaka', // City
  country: 'BD', // Country
});
```

### 3. **Custom Audiences**

Use tracked events to create custom audiences in Ads Manager:
- Users who viewed products but didn't purchase
- Users who abandoned cart
- Users who completed purchase

### 4. **Event Optimization**

In Ads Manager, optimize campaigns for specific events:
- Optimize for `AddToCart` (cart campaign)
- Optimize for `Purchase` (conversion campaign)
- Optimize for `OrderPlaced` (manual payment campaign)

---

## 🔍 Verification Checklist

Before going to production, verify:

- [ ] Pixel ID is correct in `.env.local`
- [ ] Meta Pixel Helper shows green checkmark
- [ ] PageView fires on route change
- [ ] AddToCart fires when adding product to cart
- [ ] ViewContent fires on product detail page (after manual integration)
- [ ] InitiateCheckout fires on checkout page (after manual integration)
- [ ] OrderPlaced fires on order confirmation (after manual integration)
- [ ] Events appear in Events Manager Test Events
- [ ] No console errors related to Meta Pixel
- [ ] Deduplication prevents double-firing on refresh

---

## 📝 File Reference

### Core Library
- `lib/metaPixel.ts` - Main tracking functions

### Providers (Auto-loaded)
- `components/providers/meta-pixel-provider.tsx` - Script injector
- `components/providers/meta-page-view-provider.tsx` - Auto PageView tracking

### Trackers (Manual integration)
- `components/tracking/product-view-tracker.tsx` - ViewContent event
- `components/tracking/checkout-tracker.tsx` - InitiateCheckout event
- `components/tracking/order-tracker.tsx` - OrderPlaced/Purchase events

### Configuration
- `.env.local` - Pixel ID configuration
- `app/layout.tsx` - Root layout with providers

---

## 🆘 Support & Resources

### Meta Documentation
- [Meta Pixel Overview](https://www.facebook.com/business/help/952192354843755)
- [Standard Events Reference](https://developers.facebook.com/docs/meta-pixel/reference)
- [Events Manager](https://business.facebook.com/events_manager)

### Tools
- [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper) - Chrome extension
- [Facebook for Developers](https://developers.facebook.com/docs/meta-pixel)

### Common Issues
- [Pixel Not Loading](https://www.facebook.com/business/help/1733705803609786)
- [Events Not Firing](https://www.facebook.com/business/help/404568130214036)
- [Duplicate Events](https://www.facebook.com/business/help/823677331451951)

---

## 🎉 You're All Set!

Your Meta Pixel is now integrated and ready to track conversions. Complete the manual integrations above and start collecting valuable e-commerce data!

**Need help?** Check the console logs or use Meta Pixel Helper to debug issues.
