"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useProductStore, type Product } from "@/lib/product-store";
import {
  Trash2,
  Plus,
  Edit,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const products = useProductStore((state) => state.products);
  const pagination = useProductStore((state) => state.pagination);
  const loading = useProductStore((state) => state.loading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const softDeleteProduct = useProductStore((state) => state.softDeleteProduct);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Wait for zustand to rehydrate from storage AND auth loading to finish
    if (!hasHydrated || authLoading) return;

    if (!user || user.role !== "admin") {
      router.push("/login");
    } else {
      // Fetch products when admin dashboard loads with pagination
      fetchProducts({
        page: currentPage,
        limit: 10,
      });
    }
  }, [user, authLoading, hasHydrated, router, fetchProducts, currentPage]);

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleAddProduct = () => {
    router.push("/admin/products/create");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleSoftDelete = async () => {
    if (!productToDelete) return;

    const success = await softDeleteProduct(productToDelete._id);
    if (success) {
      toast.success("Product moved to trash");
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } else {
      toast.error("Failed to delete product");
    }
  };

  const handleHardDelete = async () => {
    if (!productToDelete) return;

    const success = await deleteProduct(productToDelete._id);
    if (success) {
      toast.success("Product permanently deleted");
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } else {
      toast.error("Failed to delete product");
    }
  };

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

  // Don't render anything if not authenticated (will redirect)
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-xl">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your products and inventory
              </p>
            </div>
            <button
              onClick={handleAddProduct}
              className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>

          {/* Products Table - Desktop */}
          <div className="hidden lg:block bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/10 dark:bg-primary/20 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 bg-muted rounded-md"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-muted rounded w-32"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-muted rounded w-20"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-muted rounded w-10"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-muted rounded w-16"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-muted rounded w-12"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <div className="w-8 h-8 bg-muted rounded-lg"></div>
                            <div className="w-8 h-8 bg-muted rounded-lg"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {product.images && product.images[0] ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMG_URL}/${product.images[0]}`}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover rounded-md border border-border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground border border-border">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">
                        {product.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-sm text-foreground">
                          {product.category}
                        </span>
                        {product.subCategory && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.subCategory})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        <span
                          className={
                            product.stock < 10
                              ? "text-red-600 dark:text-red-400 font-semibold"
                              : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-foreground font-medium">
                          ৳{product.price.toLocaleString("en-BD")}
                        </div>
                        {product.discountPercent > 0 && (
                          <div className="text-xs text-green-600 dark:text-green-400">
                            Save {product.discountPercent}%
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {product.discountPercent > 0
                          ? `${product.discountPercent}%`
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-md font-medium inline-block w-fit ${
                              product.isActive
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                          {product.isFlashSale && (
                            <span className="text-xs px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 font-medium inline-block w-fit">
                              Flash Sale
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product._id)}
                            className="p-2 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-200"
                            title="Edit product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="p-2 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Products Cards - Mobile/Tablet */}
          <div className="lg:hidden space-y-4">
            {loading ? (
              // Loading skeleton for mobile
              Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-4 shadow-sm animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-md shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted rounded w-16"></div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-9 bg-muted rounded flex-1"></div>
                        <div className="h-9 bg-muted rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              products.map((product) => (
              <div
                key={product._id}
                className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="shrink-0">
                    {product.images && product.images[0] ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMG_URL}/${product.images[0]}`}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover rounded-md border border-border"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground border border-border">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 truncate">
                      {product.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="capitalize text-foreground">
                          {product.category}
                          {product.subCategory && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({product.subCategory})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Stock:</span>
                        <span
                          className={`font-medium ${product.stock < 10 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}
                        >
                          {product.stock}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            ৳{product.price.toLocaleString("en-BD")}
                          </div>
                          {product.discountPercent > 0 && (
                            <div className="text-xs text-green-600 dark:text-green-400">
                              Save {product.discountPercent}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex gap-2 mt-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-md font-medium ${
                          product.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      {product.isFlashSale && (
                        <span className="text-xs px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 font-medium">
                          Flash Sale
                        </span>
                      )}
                      {product.discountPercent > 0 && (
                        <span className="text-xs px-2 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 font-medium">
                          {product.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8">
              {/* Results Count */}
              <div className="flex items-center justify-center mb-4">
                <p className="text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-semibold text-foreground">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {pagination.total}
                  </span>{" "}
                  products
                </p>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (page === 1 || page === pagination.pages)
                          return true;
                        if (Math.abs(page - currentPage) <= 1) return true;
                        return false;
                      })
                      .map((page, index, array) => {
                        // Add ellipsis
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <div key={page} className="flex items-center gap-1">
                            {showEllipsis && (
                              <span className="px-2 text-muted-foreground">
                                ...
                              </span>
                            )}
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="min-w-10"
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      })}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Product
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <div>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{productToDelete?.name}</span>
                  ?
                </div>
                <div className="text-sm">
                  Choose how you want to delete this product:
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-1">Soft Delete</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Move to trash. Can be restored later.
              </p>
              <Button
                variant="outline"
                onClick={handleSoftDelete}
                className="w-full"
              >
                Move to Trash
              </Button>
            </div>

            <div className="p-4 border border-red-200 rounded-lg">
              <h4 className="font-semibold mb-1 text-red-600">
                Permanent Delete
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Delete forever. This cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={handleHardDelete}
                className="w-full"
              >
                Delete Forever
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
