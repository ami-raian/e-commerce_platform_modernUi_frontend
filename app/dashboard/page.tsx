"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { apiClient } from "@/lib/api/config";
import { ShoppingBag, Package, User } from "lucide-react";

interface OrderStats {
  totalItems: number;
  totalOrders: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch order statistics from API
  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        setStatsLoading(true);
        const response = await apiClient.get("/orders/total-items");
        if (response.data.success) {
          setOrderStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch order stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    // Only fetch when user is authenticated AND hydration is complete
    if (user && hasHydrated && !authLoading) {
      fetchOrderStats();
    }
  }, [user, hasHydrated, authLoading]);

  useEffect(() => {
    // Wait for zustand to rehydrate from storage AND auth loading to finish
    if (!hasHydrated || authLoading) return;

    if (!user) {
      router.push("/login");
    } else {
      // Scroll to top when dashboard loads
      window.scrollTo(0, 0);
    }
  }, [user, authLoading, hasHydrated, router]);

  // Show loading spinner while checking authentication or waiting for rehydration
  if (!hasHydrated || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-xl">
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Account Type Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-lg text-white">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Account Type</p>
                  <p className="text-2xl font-bold capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-lg text-white">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Orders</p>
                  {statsLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl font-bold">
                      {orderStats?.totalOrders ?? 0}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Total Items Ordered Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-lg text-white">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Items Ordered</p>
                  {statsLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl font-bold">
                      {orderStats?.totalItems ?? 0}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Full Name</p>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Member Since</p>
                <p className="text-lg font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Account Status</p>
                <p className="text-lg font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
