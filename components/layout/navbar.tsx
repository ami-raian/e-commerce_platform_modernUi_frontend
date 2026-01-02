"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Moon, Sun, Search, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Check if a route is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setIsOpen(false);
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container-xl flex items-center justify-between py-4">
        <Link href="/" className="flex items-center">
          {theme === "dark" ? (
            <Image
              src="/dark-mode-logo.png"
              alt="Marqen"
              height={50}
              width={50}
              priority
              className="h-10 w-auto"
            />
          ) : (
            <Image
              src="/light-mode-logo.png"
              alt="Marqen"
              height={50}
              width={50}
              priority
              className="h-10 w-auto"
            />
          )}
          {/* {mounted && (
            <Image
              src={
                theme === "dark"
                  ? "/dark-mode-logo.png"
                  : "/light-mode-logo.png"
              }
              alt="Marqen"
              width={150}
              height={50}
              priority
              className="h-10 w-auto"
            />
          )} */}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className={`transition-colors font-medium ${
              isActive("/products")
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-foreground hover:text-primary"
            }`}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className={`transition-colors font-medium ${
              isActive("/categories")
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-foreground hover:text-primary"
            }`}
          >
            Categories
          </Link>
          <Link
            href="/about"
            className={`transition-colors font-medium ${
              isActive("/about")
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-foreground hover:text-primary"
            }`}
          >
            About
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-lg transition-colors ${
              showSearch
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
            aria-label="Search"
          >
            <Search size={20} className={showSearch ? "stroke-[2.5]" : ""} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors text-foreground hover:bg-primary/10 hover:text-primary"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "light" ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )
            ) : (
              <Moon size={20} />
            )}
          </button>

          <Link
            href="/cart"
            className={`p-2 rounded-lg transition-colors relative ${
              isActive("/cart")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <ShoppingCart
              size={20}
              className={isActive("/cart") ? "stroke-[2.5]" : ""}
            />
            {mounted && cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin Links - Desktop */}
          {mounted && isAdmin && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/dashboard"
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isActive("/dashboard")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                title="Dashboard"
              >
                <LayoutDashboard size={20} className={isActive("/dashboard") ? "stroke-[2.5]" : ""} />
              </Link>
              <Link
                href="/admin"
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isActive("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                title="Admin Panel"
              >
                <ShieldCheck size={20} className={isActive("/admin") ? "stroke-[2.5]" : ""} />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-colors text-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isOpen
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={20} className="stroke-[2.5]" />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="border-t border-border p-3 bg-card">
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto flex gap-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="flex-1 px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="px-4 py-1.5 text-sm border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border p-4 flex flex-col gap-4">
          <Link
            href="/products"
            className={`transition-colors font-medium ${
              isActive("/products")
                ? "text-primary font-semibold"
                : "text-foreground hover:text-primary"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className={`transition-colors font-medium ${
              isActive("/categories")
                ? "text-primary font-semibold"
                : "text-foreground hover:text-primary"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Categories
          </Link>
          <Link
            href="/about"
            className={`transition-colors font-medium ${
              isActive("/about")
                ? "text-primary font-semibold"
                : "text-foreground hover:text-primary"
            }`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>

          {/* Admin Links - Mobile */}
          {mounted && isAdmin && (
            <>
              <div className="border-t border-border pt-4 mt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                  Admin Menu
                </p>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors font-medium ${
                    isActive("/dashboard")
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors font-medium mt-2 ${
                    isActive("/admin")
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <ShieldCheck size={18} />
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-2 px-3 rounded-lg transition-colors font-medium text-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 mt-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
