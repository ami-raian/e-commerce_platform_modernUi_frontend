"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { useSearchParams, useRouter } from "next/navigation";
import { useProductStore } from "@/lib/product-store";
import { getImageUrl } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, pagination, loading, fetchProducts } = useProductStore();
  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "popularity"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    searchParams.get("subCategory") || "all"
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subCategory: true,
    sort: true,
  });

  // Update URL params
  const updateURLParams = (
    category: string,
    subCategory: string,
    sort: string,
    page?: number
  ) => {
    const params = new URLSearchParams();

    if (category !== "all") {
      params.set("category", category);
    }

    if (subCategory !== "all" && category === "fashion") {
      params.set("subCategory", subCategory);
    }

    if (sort !== "popularity") {
      params.set("sort", sort);
    }

    if (page && page > 1) {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/products", {
      scroll: false,
    });
  };

  // Fetch products on mount and when URL params change
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1");
    const categoryFromUrl = searchParams.get("category") || "all";
    const subCategoryFromUrl =
      searchParams.get("subCategory") ||
      searchParams.get("subcategory") ||
      "all";
    const sortFromUrl = searchParams.get("sort") || "popularity";

    // Update local state to match URL
    setCurrentPage(pageFromUrl);
    setSelectedCategory(categoryFromUrl);
    setSelectedSubCategory(subCategoryFromUrl);
    setSortBy(sortFromUrl);

    const filters = {
      page: pageFromUrl,
      limit: 12,
      category: categoryFromUrl !== "all" ? categoryFromUrl : undefined,
      subCategory:
        subCategoryFromUrl !== "all"
          ? (subCategoryFromUrl as "gents" | "ladies")
          : undefined,
      sort:
        sortFromUrl !== "popularity"
          ? (sortFromUrl as
              | "price-asc"
              | "price-desc"
              | "newest"
              | "rating"
              | "popularity")
          : undefined,
    };

    fetchProducts(filters);
  }, [searchParams, fetchProducts]);

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLParams(selectedCategory, selectedSubCategory, sortBy, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    // Reset subcategory when changing main category
    if (cat !== "fashion") {
      setSelectedSubCategory("all");
    }
    setCurrentPage(1);
    updateURLParams(
      cat,
      cat === "fashion" ? selectedSubCategory : "all",
      sortBy,
      1
    );
  };

  const handleSubCategoryChange = (subCat: string) => {
    setSelectedSubCategory(subCat);
    setCurrentPage(1);
    updateURLParams(selectedCategory, subCat, sortBy, 1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
    updateURLParams(selectedCategory, selectedSubCategory, sort, 1);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setSortBy("popularity");
    setCurrentPage(1);
    router.push("/products", { scroll: false });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const categories = [
    { value: "all", label: "All Products" },
    { value: "fashion", label: "Fashion" },
  ];

  const fashionSubCategories = [
    { value: "all", label: "All Fashion" },
    { value: "gents", label: "Gents" },
    { value: "ladies", label: "Ladies" },
  ];

  const sortOptions = [
    { value: "popularity", label: "Most Popular" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSubCategory !== "all" ? 1 : 0) +
    (sortBy !== "popularity" ? 1 : 0);

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-primary" />
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader className="py-4">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full"
          >
            <CardTitle className="text-base">Category</CardTitle>
            {expandedSections.category ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </CardHeader>
        {expandedSections.category && (
          <CardContent className="space-y-2 pb-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  selectedCategory === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <span className="capitalize font-medium">{cat.label}</span>
              </button>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Subcategory Filter (Fashion only) */}
      {selectedCategory === "fashion" && (
        <Card>
          <CardHeader className="py-4">
            <button
              onClick={() => toggleSection("subCategory")}
              className="flex items-center justify-between w-full"
            >
              <CardTitle className="text-base">Type</CardTitle>
              {expandedSections.subCategory ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </CardHeader>
          {expandedSections.subCategory && (
            <CardContent className="space-y-2 pb-4">
              {fashionSubCategories.map((subCat) => (
                <button
                  key={subCat.value}
                  onClick={() => handleSubCategoryChange(subCat.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedSubCategory === subCat.value
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <span className="font-medium">{subCat.label}</span>
                </button>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* Sort Options */}
      <Card>
        <CardHeader className="py-4">
          <button
            onClick={() => toggleSection("sort")}
            className="flex items-center justify-between w-full"
          >
            <CardTitle className="text-base">Sort By</CardTitle>
            {expandedSections.sort ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </CardHeader>
        {expandedSections.sort && (
          <CardContent className="space-y-2 pb-4">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  sortBy === option.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );

  return (
    <div className="container-xl py-8">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter size={18} />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-background shadow-lg overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              <FilterSidebar />
              <div className="mt-6 sticky bottom-0 bg-background pt-4 border-t">
                <Button
                  className="w-full"
                  onClick={() => setShowMobileFilters(false)}
                >
                  View {pagination?.total || products.length} Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-[105px] lg:self-start">
            <FilterSidebar />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    mainPrice={product.mainPrice}
                    price={product.price}
                    discountPercent={product.discountPercent}
                    image={getImageUrl(product.images[0])}
                    category={product.category}
                    rating={product.rating}
                  />
                ))}
              </div>

              {products.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Filter size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find what you're looking for
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="mt-12">
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
                        {Array.from(
                          { length: pagination.pages },
                          (_, i) => i + 1
                        )
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
                            const showEllipsis =
                              prevPage && page - prevPage > 1;

                            return (
                              <div
                                key={page}
                                className="flex items-center gap-1"
                              >
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductsPageSkeleton() {
  return (
    <div className="container-xl py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        {/* <aside className="hidden lg:block space-y-4">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
          <div className="h-48 bg-muted rounded animate-pulse" />
        </aside> */}

        {/* Products Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
