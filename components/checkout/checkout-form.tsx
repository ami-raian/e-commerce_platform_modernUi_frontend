"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCartStore,
  type CartItem,
  type ShippingLocation,
} from "@/lib/cart-store";
import { apiClient } from "@/lib/api/config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { OrderConfirmationModal } from "./order-confirmation-modal";

interface CheckoutFormProps {
  total: number;
  cartItems: CartItem[];
  subtotal: number;
  promoDiscount: number;
  appliedPromoCode?: string;
  shipping: number;
  shippingLocation: ShippingLocation;
}

export function CheckoutForm({
  total,
  cartItems,
  subtotal,
  promoDiscount,
  appliedPromoCode,
  shipping,
  shippingLocation,
}: CheckoutFormProps) {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const setDirectPurchaseItem = useCartStore(
    (state) => state.setDirectPurchaseItem
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    const isValid =
      newFormData.firstName.trim() &&
      newFormData.lastName.trim() &&
      newFormData.email.trim() &&
      newFormData.phone.trim() &&
      newFormData.address.trim() &&
      newFormData.city.trim();

    setIsFormValid(!!isValid);
  };

  const customerName = `${formData.firstName} ${formData.lastName}`;

  const paymentOptions = [
    {
      id: "bkash",
      name: "bKash",
      number: "01650-278889",
      logo: "💳",
      type: "mobile-money",
    },
    {
      id: "nagad",
      name: "Nagad",
      number: "01650-278889",
      logo: "💰",
      type: "mobile-money",
    },
    {
      id: "rocket",
      name: "Rocket",
      number: "01650-278889",
      logo: "🚀",
      type: "mobile-money",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      number: "",
      logo: "💵",
      type: "cod",
    },
  ];

  const handleInitiateOrder = () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    const paymentMethod = paymentOptions.find(
      (opt) => opt.id === selectedPayment
    );

    if (!paymentMethod) {
      toast.error("Invalid payment method selected");
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    const paymentMethod = paymentOptions.find(
      (opt) => opt.id === selectedPayment
    );

    if (!paymentMethod) return;

    setShowConfirmModal(false);
    setOrderPlaced(true);
    setSendingEmail(true);

    try {
      // Create order in backend API
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Map payment method to API format
      const paymentMethodMap: { [key: string]: string } = {
        bkash: "bkash",
        nagad: "nagad",
        rocket: "rocket",
        cod: "cash_on_delivery",
      };

      const orderPayload = {
        userInfo: {
          fullName: fullName,
          email: formData.email,
          phone: formData.phone,
        },
        orderItems: orderItems,
        shippingAddress: {
          fullName: fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
        },
        paymentMethod: paymentMethodMap[selectedPayment] || "cash_on_delivery",
      };

      try {
        await apiClient.post("/orders", orderPayload);
      } catch (orderError) {
        console.error("Error creating order in backend:", orderError);
        // Continue with the flow even if backend order creation fails
      }

      // Send order confirmation email
      const emailResponse = await fetch("/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          cartItems: cartItems,
          subtotal: subtotal,
          promoDiscount: promoDiscount,
          appliedPromoCode: appliedPromoCode,
          shipping: shipping,
          shippingLocation: shippingLocation,
          total: total,
          paymentMethod: paymentMethod.name,
          paymentNumber: paymentMethod.number,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error("Email sending failed:", errorData);
        toast.warning(
          "Order placed but email notification failed. We'll contact you shortly.",
          { duration: 5000 }
        );
      } else {
        // Different success messages for COD vs mobile money
        if (paymentMethod.type === "cod") {
          toast.success(
            `Order placed successfully! Check your email for confirmation. Pay ৳${total.toLocaleString(
              "en-BD"
            )} when you receive your order.`,
            {
              duration: 6000,
            }
          );
        } else {
          toast.success(
            `Order placed successfully! Check your email for confirmation. Please send ৳${total.toLocaleString(
              "en-BD"
            )} to ${paymentMethod.name}: ${paymentMethod.number}`,
            {
              duration: 6000,
            }
          );
        }
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.warning(
        "Order placed but email notification failed. We'll contact you shortly.",
        { duration: 5000 }
      );
    } finally {
      setSendingEmail(false);

      // Generate order number
      const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

      // Store order data in sessionStorage for the confirmation page
      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderNumber,
          customerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          items: cartItems,
          subtotal,
          promoDiscount,
          appliedPromoCode,
          shipping,
          shippingLocation,
          total,
          paymentMethod: paymentMethod.name,
          orderDate: new Date().toISOString(),
        })
      );

      setTimeout(() => {
        clearCart();
        setDirectPurchaseItem(null);
        router.push("/order-confirmation");
      }, 2000);
    }
  };

  return (
    <>
      {/* Shipping Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-6">Shipping Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Mobile Money Payment */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-6">Payment Method</h3>

        {isFormValid ? (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Select your preferred payment method to complete your order
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedPayment(option.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                    selectedPayment === option.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{option.logo}</span>
                    <div className="text-left">
                      <p className="font-bold text-lg">{option.name}</p>
                      {option.type === "mobile-money" ? (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Send Money to:
                          </p>
                          <p className="font-mono font-semibold text-primary">
                            {option.number}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedPayment && (
              <div className="bg-accent/50 border border-primary/20 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold text-lg">Payment Instructions:</h4>
                {paymentOptions.find((opt) => opt.id === selectedPayment)
                  ?.type === "cod" ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      You've selected Cash on Delivery
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        Click "Place Order" button below to confirm your order
                      </li>
                      <li>
                        Prepare exact amount:{" "}
                        <span className="font-bold text-foreground">
                          ৳{total.toLocaleString("en-BD")}
                        </span>
                      </li>
                      <li>
                        Pay the delivery person when you receive your order
                      </li>
                      <li>Make sure to check the product before payment</li>
                    </ul>
                  </div>
                ) : (
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>
                      Select{" "}
                      {
                        paymentOptions.find((opt) => opt.id === selectedPayment)
                          ?.name
                      }{" "}
                      from your mobile
                    </li>
                    <li>Choose "Send Money" option</li>
                    <li>
                      Enter the number:{" "}
                      <span className="font-mono font-bold text-foreground">
                        {
                          paymentOptions.find(
                            (opt) => opt.id === selectedPayment
                          )?.number
                        }
                      </span>
                    </li>
                    <li>
                      Enter amount:{" "}
                      <span className="font-bold text-foreground">
                        ৳{total.toLocaleString("en-BD")}
                      </span>
                    </li>
                    <li>Complete the transaction</li>
                    <li>Click "Place Order" button below</li>
                  </ol>
                )}
              </div>
            )}

            <button
              onClick={handleInitiateOrder}
              disabled={orderPlaced || sendingEmail}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingEmail
                ? "Sending confirmation email..."
                : orderPlaced
                  ? "Order Placed Successfully!"
                  : "Place Order"}
            </button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Having trouble? Contact customer support: +880 1650-278889</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-accent rounded-lg border border-border text-center">
            <p className="text-white">
              Please fill out all shipping information to proceed with payment
            </p>
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmOrder}
        customerName={customerName}
        phone={formData.phone}
        address={formData.address}
        city={formData.city}
        cartItems={cartItems}
        total={total}
        paymentMethod={
          paymentOptions.find((opt) => opt.id === selectedPayment)?.name || ""
        }
        shippingLocation={shippingLocation}
        isProcessing={sendingEmail}
      />
    </>
  );
}
