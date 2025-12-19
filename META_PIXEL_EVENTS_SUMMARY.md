# Meta Pixel Events - Implementation Summary

## ✅ Implemented Events

### 1. **PageView** (Standard Event)

- **Location:** Automatic on all pages
- **File:** `components/providers/meta-pixel-provider.tsx`
- **Triggers:** Every page load
- **Status:** ✅ Working (35+ events tracked)

### 2. **ViewContent** (Standard Event)

- **Location:** Product detail pages
- **File:** `app/product/[id]/page.tsx`
- **Component:** `ProductViewTracker`
- **Triggers:** When user views a product
- **Data Tracked:**
  - Product ID
  - Product name
  - Price (after discount)
  - Category
  - Currency (BDT)
- **Status:** ✅ Working (4+ events tracked)

### 3. **AddToCart** (Standard Event)

- **Location:** Product pages, Cart page
- **File:** `components/tracking/checkout-tracker.tsx`
- **Triggers:** When user adds item to cart
- **Data Tracked:**
  - Product ID
  - Product name
  - Price
  - Quantity
  - Currency (BDT)
- **Status:** ✅ Working (9+ events tracked)

### 4. **InitiateCheckout** (Standard Event)

- **Location:** Checkout page
- **File:** `components/tracking/checkout-tracker.tsx`
- **Triggers:** When user starts checkout process
- **Data Tracked:**
  - Cart items
  - Total value
  - Number of items
  - Currency (BDT)
- **Status:** ✅ Working (4+ events tracked)

### 5. **Purchase** (Standard Event) - RECOMMENDED ✅

- **Location:** Order confirmation page
- **File:** `app/order-confirmation/page.tsx`
- **Component:** `OrderTracker` with `usePurchaseEvent={true}`
- **Triggers:** When order is successfully placed
- **Data Tracked:**
  - Order ID
  - Products purchased
  - Total amount
  - Currency (BDT)
  - Payment method
- **Status:** ✅ Implemented and ready
- **Benefits:**
  - ✅ Meta automatically recognizes for conversion tracking
  - ✅ ROAS (Return on Ad Spend) calculation
  - ✅ Conversion API compatible
  - ✅ Best for ads optimization

### 6. **OrderPlaced** (Custom Event) - Alternative

- **Status:** Available but not recommended
- **Note:** Use only if you need to differentiate between payment types
- **To Enable:** Change `usePurchaseEvent={false}` in order-confirmation page

---

## 📊 Current Stats (As of Dec 20, 2025)

- **PageView:** 35 events
- **AddToCart:** 9 events
- **ViewContent:** 4 events
- **InitiateCheckout:** 4 events
- **Purchase:** Ready to track

---

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_META_PIXEL_ID=728163313674196
```

### Files Structure

```
components/
├── providers/
│   ├── meta-pixel-provider.tsx      # Pixel initialization
│   └── meta-page-view-provider.tsx  # PageView tracking
├── tracking/
│   ├── product-view-tracker.tsx     # ViewContent event
│   ├── checkout-tracker.tsx         # AddToCart & InitiateCheckout
│   └── order-tracker.tsx            # Purchase event
lib/
└── metaPixel.ts                     # Core tracking functions
```

---

## 🚀 Testing

### 1. Real-time Testing (Test Events)

1. Go to: https://business.facebook.com/events_manager
2. Click **"Test Events"** tab
3. Enter your website URL: `https://www.marqenbd.com`
4. Browse your site and see events in real-time

### 2. Browser Console Testing

1. Open browser Console (F12)
2. Look for logs:
   - `[Meta Pixel] Initialized and PageView tracked`
   - `[Meta Pixel] ViewContent tracked for: [Product Name]`
   - `[Meta Pixel] Event tracked: AddToCart`
   - `[Meta Pixel] Event tracked: Purchase`

### 3. Meta Pixel Helper Extension

- Install: [Chrome Web Store](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- Visit your site
- Click extension icon to see events

---

## 🎯 Event Flow (User Journey)

```
1. User visits site
   → PageView event

2. User views product
   → ViewContent event

3. User adds to cart
   → AddToCart event

4. User goes to checkout
   → InitiateCheckout event

5. User completes order
   → Purchase event (with order details)
```

---

## 📈 Conversion Tracking Setup

### In Meta Ads Manager:

1. Go to **Events Manager** → Your Pixel
2. Click **"Aggregated Event Measurement"**
3. Configure conversion events priority:
   - Priority 1: **Purchase** (highest value)
   - Priority 2: InitiateCheckout
   - Priority 3: AddToCart
   - Priority 4: ViewContent

### For Campaign Optimization:

- Use **Purchase** event as conversion goal
- Set proper value optimization
- Track ROAS in Ads Manager

---

## 🔒 Privacy & Compliance

- ✅ Pixel loads only on client-side
- ✅ Deduplication logic prevents double-firing
- ✅ Events stored in localStorage with TTL
- ⚠️ Consider adding Cookie Consent banner for GDPR compliance

---

## 🐛 Troubleshooting

### Events not showing in Events Manager?

- Wait 5-30 minutes for data processing
- Check Test Events tab for real-time data
- Verify Pixel ID in `.env.local`

### ViewContent not firing?

- Product must have valid `id`, `name`, and `price`
- Check browser console for errors
- Verify ProductViewTracker is rendered

### Purchase event not tracking?

- Clear localStorage: `localStorage.clear()`
- Use incognito window for fresh test
- Check OrderTracker component is rendered

---

## 📝 Future Enhancements (Optional)

### Additional Events to Consider:

- **Search** - Track product searches
- **CompleteRegistration** - Track new user signups
- **Lead** - Track contact form submissions

### Implementation:

```typescript
// Search Event
import { trackSearch } from "@/lib/metaPixel";
trackSearch(searchQuery);

// Registration Event
import { trackCompleteRegistration } from "@/lib/metaPixel";
trackCompleteRegistration();
```

---

## ✅ Summary

**All Major E-commerce Events Implemented:**

- ✅ Page views tracked automatically
- ✅ Product views tracked
- ✅ Add to cart tracked
- ✅ Checkout initiation tracked
- ✅ Purchase/Order completion tracked

**Meta Pixel is fully functional and ready for:**

- Facebook/Instagram Ads campaigns
- Conversion tracking
- Retargeting campaigns
- Lookalike audiences
- ROAS optimization

---

**Last Updated:** December 20, 2025
**Pixel ID:** 728163313674196
**Website:** www.marqenbd.com
