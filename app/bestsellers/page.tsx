import Link from "next/link"
import { ProductCard } from "@/components/products/product-card"
import { getBestsellers, getImageUrl } from "@/lib/api"

export default async function BestsellersPage() {
  let bestsellers: any[] = [];
  try {
    bestsellers = await getBestsellers();
  } catch (error) {
    console.error("Failed to fetch bestsellers:", error);
  }

  return (
    <div className="container-xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="section-title mb-2">Bestsellers</h1>
          <p className="text-muted-foreground">Our most popular and highest-rated products</p>
        </div>

        {bestsellers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No bestsellers yet</p>
            <Link href="/products" className="btn-primary inline-block">
              Shop All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={getImageUrl(product.images[0])}
                category={product.category}
                rating={product.rating}
                sizes={product.sizes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
