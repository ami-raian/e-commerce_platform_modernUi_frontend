"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, User, MapPin, Phone, Mail, Calendar, CreditCard, Truck } from "lucide-react";
import { OrderTracker } from "@/components/tracking/order-tracker";
import type { CartItem, ShippingLocation } from "@/lib/cart-store";

interface OrderData {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: CartItem[];
  subtotal: number;
  promoDiscount: number;
  appliedPromoCode?: string;
  shipping: number;
  shippingLocation: ShippingLocation;
  total: number;
  paymentMethod: string;
  orderDate: string;
}

export default function OrderConfirmationPage() {
  const [mounted, setMounted] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    setMounted(true);

    // Get order data from sessionStorage
    const storedOrder = sessionStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    }
  }, []);

  if (!mounted) return null;

  if (!orderData) {
    return (
      <div className="container-xl py-16 md:py-24">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <Package size={64} className="text-muted-foreground" />
          </div>
          <div>
            <h1 className="section-title mb-2">No Order Found</h1>
            <p className="text-lg text-muted-foreground">
              We couldn't find any recent order information.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/products" className="btn-primary">
              Continue Shopping
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderDate = new Date(orderData.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container-xl py-8 md:py-12">
      {/* Track order with Meta Pixel */}
      {orderData.orderNumber && orderData.items.length > 0 && (
        <OrderTracker
          orderId={orderData.orderNumber}
          items={orderData.items}
          totalAmount={orderData.total}
          paymentMethod={orderData.paymentMethod}
          usePurchaseEvent={false}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} className="text-success" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase, {orderData.customerName.split(' ')[0]}!
            </p>
          </div>
        </div>

        {/* Order Number Card */}
        <div className="card bg-primary/5 border-2 border-primary/20 text-center">
          <p className="text-sm text-muted-foreground mb-2">Order Number</p>
          <p className="text-3xl font-bold font-mono text-primary">{orderData.orderNumber}</p>
          <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            {orderDate}
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Customer Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Name</p>
                  <p className="font-medium">{orderData.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">{orderData.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">{orderData.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Shipping Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Delivery Address</p>
                  <p className="font-medium">{orderData.address}, {orderData.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Shipping Area</p>
                  <p className="font-medium">
                    {orderData.shippingLocation === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Payment Method</p>
                  <p className="font-medium">{orderData.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Order Items ({orderData.items.length})
          </h2>
          <div className="space-y-4">
            {orderData.items.map((item, index) => (
              <div
                key={`${item.productId}-${item.size || "no-size"}-${index}`}
                className="flex items-center gap-4 p-4 bg-accent/30 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  {item.size && (
                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">
                    ৳{(item.price * item.quantity).toLocaleString("en-BD")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ৳{item.price.toLocaleString("en-BD")} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">৳{orderData.subtotal.toLocaleString("en-BD")}</span>
            </div>

            {orderData.appliedPromoCode && orderData.promoDiscount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span className="text-muted-foreground">Discount ({orderData.appliedPromoCode})</span>
                <span className="font-medium">-৳{orderData.promoDiscount.toLocaleString("en-BD")}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">৳{orderData.shipping.toLocaleString("en-BD")}</span>
            </div>

            <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-primary text-2xl">৳{orderData.total.toLocaleString("en-BD")}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Delivery Timeline
          </h3>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Your order will be delivered via courier service within{" "}
            <span className="font-semibold">3-4 business days</span>.
            You will receive a confirmation email and tracking information shortly.
          </p>
        </div>

        {/* Email Confirmation Notice */}
        <div className="bg-accent/50 border border-border rounded-lg p-6 text-center">
          <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
          <p className="font-medium mb-1">Confirmation Email Sent!</p>
          <p className="text-sm text-muted-foreground">
            We've sent a detailed order confirmation to <span className="font-medium">{orderData.email}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
