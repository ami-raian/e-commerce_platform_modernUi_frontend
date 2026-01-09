"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProductStore } from "@/lib/product-store";
import { ProductCard } from "@/components/products/product-card";
import { getImageUrl } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const searchProducts = useProductStore((state) => state.searchProducts);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (query.trim()) {
      const searchResults = searchProducts(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
    setIsLoading(false);
  }, [query, searchProducts]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-xl">
        <div>
          {/* Back Button */}
          <Link
            href="/products"
            className="flex items-center gap-2 text-primary hover:underline mb-6"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>

          {/* Search Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2">
              Search Results
            </h1>
            <p className="text-muted-foreground">
              {query ? (
                <>
                  Found{" "}
                  <span className="font-semibold text-foreground">
                    {results.length}
                  </span>{" "}
                  products for "
                  <span className="font-semibold text-foreground">{query}</span>
                  "
                </>
              ) : (
                "Enter a search term to find products"
              )}
            </p>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <div key={product._id}>
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    mainPrice={product.mainPrice}
                    price={product.price}
                    discountPercent={product.discountPercent}
                    image={getImageUrl(product.images?.[0] || product.image)}
                    category={product.category}
                    rating={product.rating}
                    sizes={product.sizes}
                  />
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">
                No products found for "{query}"
              </p>
              <p className="text-muted-foreground mb-6">
                Try a different search term or browse all products
              </p>
              <Link href="/products" className="btn-primary inline-block">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">
                Enter a search term to find products
              </p>
              <Link href="/products" className="btn-primary inline-block">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background py-12">
          <div className="container-xl">Loading...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
