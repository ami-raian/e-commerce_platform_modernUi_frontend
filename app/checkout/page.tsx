"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { usePromoStore } from "@/lib/promo-store"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { PromoInput } from "@/components/promo/promo-input"
import { CheckoutTracker } from "@/components/tracking/checkout-tracker"

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state) => state.items)
  const directPurchaseItem = useCartStore((state) => state.directPurchaseItem)
  const getTotal = useCartStore((state) => state.getTotal)
  const getShippingCost = useCartStore((state) => state.getShippingCost)
  const shippingLocation = useCartStore((state) => state.shippingLocation)
  const setShippingLocation = useCartStore((state) => state.setShippingLocation)
  const appliedCode = usePromoStore((state) => state.appliedCode)
  const calculateDiscount = usePromoStore((state) => state.calculateDiscount)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Use direct purchase item if available, otherwise use cart items
  const checkoutItems = directPurchaseItem ? [directPurchaseItem] : items

  if (checkoutItems.length === 0) {
    return (
      <div className="container-xl py-8">
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
          <Link href="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Calculate subtotal from checkout items
  const subtotal = checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const promoDiscount = calculateDiscount(subtotal)
  const shipping = getShippingCost()
  const total = subtotal - promoDiscount + shipping

  return (
    <div className="container-xl py-8">
      <CheckoutTracker />

      <div className="flex items-center gap-2 mb-8">
        <Link href="/cart" className="flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={20} />
          Back to Cart
        </Link>
      </div>

      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Location Selector */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Select Shipping Location</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <input
                  type="radio"
                  name="checkout-shipping"
                  value="inside-dhaka"
                  checked={shippingLocation === "inside-dhaka"}
                  onChange={(e) => setShippingLocation(e.target.value as any)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium">Inside Dhaka</div>
                  <div className="text-sm text-muted-foreground">৳60</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <input
                  type="radio"
                  name="checkout-shipping"
                  value="outside-dhaka"
                  checked={shippingLocation === "outside-dhaka"}
                  onChange={(e) => setShippingLocation(e.target.value as any)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium">Outside Dhaka</div>
                  <div className="text-sm text-muted-foreground">৳100</div>
                </div>
              </label>
            </div>
          </div>

          <PromoInput />
          <CheckoutForm
            total={total}
            cartItems={checkoutItems}
            subtotal={subtotal}
            promoDiscount={promoDiscount}
            appliedPromoCode={appliedCode || undefined}
            shipping={shipping}
            shippingLocation={shippingLocation}
          />
        </div>

        {/* Order Summary */}
        <div className="card h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-48 overflow-y-auto">
            {checkoutItems.map((item) => (
              <div key={`${item.productId}-${item.size || 'no-size'}`} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.name}{item.size ? ` (${item.size})` : ''} x{item.quantity}
                </span>
                <span className="font-medium">৳{(item.price * item.quantity).toLocaleString('en-BD')}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">৳{subtotal.toLocaleString('en-BD')}</span>
            </div>

            {appliedCode && promoDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span className="text-muted-foreground">Discount ({appliedCode})</span>
                <span className="font-medium">-৳{promoDiscount.toLocaleString('en-BD')}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Shipping ({shippingLocation === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"})
              </span>
              <span className="font-medium">৳{shipping.toLocaleString('en-BD')}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">৳{total.toLocaleString('en-BD')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
