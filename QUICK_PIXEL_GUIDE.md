# 🚀 Meta Pixel - Quick Reference

## ✅ Setup Complete!

Your Meta Pixel is **fully integrated and ready to use**.

---

## 🎯 What's Tracking Now?

| Action | Event Fired | Automatic? |
|--------|-------------|------------|
| Visit any page | **PageView** | ✅ Yes |
| View product details | **ViewContent** | ✅ Yes |
| Add item to cart | **AddToCart** | ✅ Yes |
| Open checkout page | **InitiateCheckout** | ✅ Yes |
| Complete order | **OrderPlaced** | ✅ Yes |

---

## 🧪 Quick Test (5 Minutes)

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Install Meta Pixel Helper:**
   - Chrome: https://chrome.google.com/webstore/detail/meta-pixel-helper
   - Click the extension icon after installing

3. **Test the flow:**
   - Visit homepage → See **PageView** ✅
   - Click a product → See **ViewContent** ✅
   - Add to cart → See **AddToCart** ✅
   - Go to checkout → See **InitiateCheckout** ✅
   - Complete order → See **OrderPlaced** ✅

4. **Check browser console (F12):**
   ```
   [Meta Pixel] Initialized: 728163313674196
   [Meta Pixel] Event tracked: PageView
   [Meta Pixel] Event tracked: ViewContent {...}
   [Meta Pixel] Event tracked: AddToCart {...}
   ```

---

## 📊 Where to View Events?

**Facebook Events Manager:**
https://business.facebook.com/events_manager

- Select your Pixel ID: **728163313674196**
- Go to **"Test Events"** tab
- Perform actions on your site
- Events appear in real-time!

---

## 🎨 Track Custom Events (Advanced)

```typescript
import { trackCustomEvent } from '@/lib/metaPixel';

// Example: Track flash sale view
trackCustomEvent('FlashSaleViewed', {
  sale_name: 'Eid Sale 2025',
  currency: 'BDT',
});

// Example: Track promo code usage
trackCustomEvent('PromoCodeApplied', {
  promo_code: 'SAVE20',
  discount_amount: 200,
  currency: 'BDT',
});
```

---

## 🔧 Change Pixel ID

Edit `.env.local`:
```env
NEXT_PUBLIC_META_PIXEL_ID=YOUR_NEW_PIXEL_ID
```

Then restart server:
```bash
npm run dev
```

---

## 🐛 Troubleshooting

### Pixel not loading?
1. Check `.env.local` has the correct ID
2. Restart dev server
3. Clear browser cache

### Events not showing?
1. Install Meta Pixel Helper extension
2. Check browser console for errors
3. Visit Events Manager → Test Events

### Need help?
- Full guide: [META_PIXEL_SETUP.md](META_PIXEL_SETUP.md)
- Completion report: [PIXEL_INTEGRATION_COMPLETE.md](PIXEL_INTEGRATION_COMPLETE.md)

---

## ✅ You're All Set!

**No further action needed.** Your pixel is tracking all major e-commerce events automatically.

Start running Facebook ads and let the conversions roll in! 🚀
