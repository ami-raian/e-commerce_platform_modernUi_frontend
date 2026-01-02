"use client";

import { useEffect, useState } from "react";
import { useProductStore, type Product } from "@/lib/product-store";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { getImageUrl } from "@/lib/api";

export default function AdminProductsPage() {
  const { user, hasHydrated } = useAuthStore();
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchProducts();
    }
  }, [user, fetchProducts]);

  // Show loading while rehydrating
  if (!hasHydrated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect if not admin
  if (user?.role !== "admin") {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You must be an administrator to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <ProductForm
              onSubmit={async (data, images) => {
                const result = await createProduct(data, images ?? []);
                if (result) {
                  toast.success("Product created successfully!");
                  setIsCreateDialogOpen(false);
                } else {
                  toast.error(error || "Failed to create product");
                }
              }}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p>Loading products...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id}>
            <CardHeader>
              <div className="aspect-square relative overflow-hidden rounded-md bg-gray-100 mb-4">
                <img
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Stock: {product.stock}
                </span>
              </div>
              {product.discountPercent > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  {Math.round(product.discountPercent)}% off
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Dialog
                open={isEditDialogOpen && selectedProduct?._id === product._id}
                onOpenChange={(open) => {
                  setIsEditDialogOpen(open);
                  if (!open) setSelectedProduct(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <ProductForm
                    product={selectedProduct}
                    onSubmit={async (data) => {
                      if (selectedProduct) {
                        const success = await updateProduct(
                          selectedProduct._id,
                          data
                        );
                        if (success) {
                          toast.success("Product updated successfully!");
                          setIsEditDialogOpen(false);
                          setSelectedProduct(null);
                        } else {
                          toast.error(error || "Failed to update product");
                        }
                      }
                    }}
                    onCancel={() => {
                      setIsEditDialogOpen(false);
                      setSelectedProduct(null);
                    }}
                  />
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the product and all its
                      images. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        const success = await deleteProduct(product._id);
                        if (success) {
                          toast.success("Product deleted successfully!");
                        } else {
                          toast.error(error || "Failed to delete product");
                        }
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({
  product,
  onSubmit,
  onCancel,
}: {
  product?: Product | null;
  onSubmit: (data: any, images?: File[]) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    mainPrice: product?.mainPrice || 0,
    price: product?.price || 0,
    category: product?.category || "electronics",
    stock: product?.stock || 0,
    isFlashSale: product?.isFlashSale || false,
    subCategory: product?.subCategory || null,
    gender: product?.gender || null,
  });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      if (fileArray.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      setImages(fileArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product && images.length === 0) {
      toast.error("Please select at least 1 image");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData, images);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {product ? "Edit Product" : "Create New Product"}
        </DialogTitle>
        <DialogDescription>
          {product
            ? "Update product details"
            : "Add a new product to your catalog (1-5 images required)"}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mainPrice">Original Price *</Label>
            <Input
              id="mainPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.mainPrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mainPrice: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Selling Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: any) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="electronics">Electronics</SelectItem> */}
                <SelectItem value="fashion">Fashion</SelectItem>
                {/* <SelectItem value="beauty">Beauty</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="home">Home</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value) })
              }
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="images">
            Product Images {!product && "*"} (1-5 images, JPEG/PNG/WEBP, max 5MB
            each)
          </Label>
          <Input
            id="images"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            required={!product}
          />
          {images.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {images.length} image(s) selected
            </p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
        </Button>
      </DialogFooter>
    </form>
  );
}
