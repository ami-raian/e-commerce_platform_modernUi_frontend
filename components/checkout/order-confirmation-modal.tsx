"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Phone, User, Package } from "lucide-react";
import type { CartItem, ShippingLocation } from "@/lib/cart-store";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  cartItems: CartItem[];
  total: number;
  paymentMethod: string;
  shippingLocation: ShippingLocation;
  isProcessing: boolean;
}

export function OrderConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  phone,
  address,
  city,
  cartItems,
  total,
  paymentMethod,
  shippingLocation,
  isProcessing,
}: OrderConfirmationModalProps) {
  const fullAddress = `${address}, ${city}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Confirm Your Order
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Please review your order details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer Information */}
          <div className="bg-accent/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Customer Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[80px]">Name:</span>
                <span className="font-medium">{customerName}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground min-w-[74px]">Phone:</span>
                <span className="font-medium">{phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground min-w-[74px]">Address:</span>
                <span className="font-medium">{fullAddress}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[80px]">Area:</span>
                <span className="font-medium">
                  {shippingLocation === "inside-dhaka"
                    ? "Inside Dhaka"
                    : "Outside Dhaka"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-accent/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Items
            </h3>
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size || "no-size"}-${index}`}
                  className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.name}
                      {item.size ? (
                        <span className="text-muted-foreground ml-1">
                          (Size: {item.size})
                        </span>
                      ) : null}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-primary">
                    ৳{(item.price * item.quantity).toLocaleString("en-BD")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Total */}
          <div className="bg-primary/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Method:</span>
              <span className="font-semibold">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-primary/20">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">
                ৳{total.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-center text-blue-900 dark:text-blue-100">
              Your order will be delivered via courier service within{" "}
              <span className="font-semibold">
                {shippingLocation === "inside-dhaka" ? "1 day" : "2-3 days"}
              </span>.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {isProcessing ? "Processing..." : "Confirm Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
