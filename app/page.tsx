"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/products/product-card";
import { getBestsellers, getImageUrl } from "@/lib/api";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero slides configuration
  const heroSlides = [
    {
      title: "FASHION STYLE",
      subtitle: "Discover Your Perfect Look",
      // image: "/hero-image1.jpeg",
      image: "/hero-images/hero-image1.png",
      gradient: "from-purple-600/80 via-primary/70 to-orange-600/80",
    },
    {
      title: "NEW COLLECTION",
      subtitle: "Trending This Season",
      image: "/hero-images/hero-image2.jpg",
      gradient: "from-blue-600/80 via-primary/70 to-purple-600/80",
    },
    {
      title: "PREMIUM QUALITY",
      subtitle: "Curated With Excellence",
      image: "/hero-images/hero-image3.jpg",
      gradient: "from-orange-600/80 via-primary/70 to-pink-600/80",
    },
  ];

  useEffect(() => {
    // Fetch bestsellers
    const fetchProducts = async () => {
      try {
        const products = await getBestsellers(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Auto-advance carousel every 5 seconds
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Full Width with Image Background */}
      <section className="relative h-[450px] md:h-[550px] lg:h-[650px] w-full overflow-hidden">
        {/* Hero Slide */}
        <div className="absolute inset-0">
          {/* Background Image */}
          <Image
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            fill
            priority
            className="object-cover"
            quality={90}
          />

          {/* Gradient Overlay */}
          {/* <div
            className={`absolute inset-0 bg-linear-to-br ${heroSlides[currentSlide].gradient}`}
          /> */}

          {/* <div className="absolute inset-0 bg-grid-pattern opacity-10"></div> */}

          {/* Optional: Add pattern overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <div className="space-y-4 md:space-y-6 lg:space-y-8 animate-fade-in max-w-5xl">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white/80 tracking-wider leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 font-light">
                {heroSlides[currentSlide].subtitle}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/80 text-primary rounded-lg font-semibold text-sm md:text-base lg:text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
              >
                <span className="hidden sm:inline">LOOK OUR PRODUCTS</span>
                <span className="sm:hidden">SHOP NOW</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 md:h-3 rounded-full transition-all ${index === currentSlide
                  ? "bg-white w-6 md:w-8"
                  : "w-2 md:w-3 bg-white/50 hover:bg-white/75"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container-xl py-10 md:py-14 lg:py-20">
        <div className="text-center mb-6 md:mb-10 space-y-3 md:space-y-4 px-4">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary/10 rounded-full text-primary text-xs md:text-sm font-medium">
            <Star className="w-3 h-3 md:w-4 md:h-4" />
            <span>Featured Collection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
            Shop Our Bestsellers
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the products that our customers love the most
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>Loading products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <div
                key={product._id}
                className="transform hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  mainPrice={product.mainPrice}
                  price={product.price}
                  discountPercent={product.discountPercent}
                  image={getImageUrl(product.images[0])}
                  category={product.category}
                  rating={product.rating}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>No products available</p>
            </div>
          )}
        </div>
        <div className="text-center mt-6 md:mt-8 px-4">
          <Link
            href="/products"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 text-sm md:text-base"
          >
            View All Products
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </section>

      {/* Promotional Cards Section */}
      <section className="container-xl py-6 md:py-10 lg:py-14 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="relative overflow-hidden group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all px-4 md:px-6">
            <Link href="/products?sale=true">
              <div className="relative h-48 md:h-64 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2 md:space-y-4">
                    <div className="relative">
                      <div className="text-4xl md:text-6xl font-bold text-primary">
                        50%
                      </div>
                      <div className="absolute -top-1 md:-top-2 -right-6 md:-right-8 bg-primary text-primary-foreground px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-bold rotate-12">
                        OFF
                      </div>
                    </div>
                    <div className="text-base md:text-xl font-semibold text-foreground">
                      Save up to
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="py-3 md:py-4">
                <h3 className="text-base md:text-lg font-bold text-center">
                  Special Sale
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground text-center mt-1">
                  Limited time offers
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="relative overflow-hidden group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all px-4 md:px-6">
            <Link href="/categories/summer-collection">
              <div className="relative h-48 md:h-64 bg-linear-to-br from-orange-100 to-yellow-100 dark:from-orange-950 dark:to-yellow-950 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2 md:space-y-4 px-4 md:px-6">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                      SUMMER 2024
                    </div>
                    <div className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-background/90 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold">
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      <span>New Arrivals</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="py-3 md:py-4">
                <h3 className="text-base md:text-lg font-bold text-center">
                  Summer Collection
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground text-center mt-1">
                  Fresh styles for the season
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="relative overflow-hidden group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all px-4 md:px-6">
            <Link href="/categories/accessories">
              <div className="relative h-48 md:h-64 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2 md:space-y-4 px-4 md:px-6">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground">
                      Spring
                    </div>
                    <div className="text-lg md:text-xl font-light italic text-foreground/80">
                      Calling
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Exclusive accessories
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="py-3 md:py-4">
                <h3 className="text-base md:text-lg font-bold text-center">
                  Premium Accessories
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground text-center mt-1">
                  Complete your look
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-accent/30 py-6 md:py-10 lg:py-14">
        <div className="container-xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            <div className="flex flex-col items-center text-center space-y-2 md:space-y-3 p-4 md:p-6 rounded-xl hover:bg-background/50 transition-colors">
              <div className="p-3 md:p-4 bg-primary/10 rounded-full">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">
                Free Shipping
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                On orders over ৳5,000
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 md:space-y-3 p-4 md:p-6 rounded-xl hover:bg-background/50 transition-colors">
              <div className="p-3 md:p-4 bg-primary/10 rounded-full">
                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">
                Secure Payment
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                100% secure transactions
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 md:space-y-3 p-4 md:p-6 rounded-xl hover:bg-background/50 transition-colors">
              <div className="p-3 md:p-4 bg-primary/10 rounded-full">
                <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">
                Easy Returns
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                30-day return policy
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 md:space-y-3 p-4 md:p-6 rounded-xl hover:bg-background/50 transition-colors">
              <div className="p-3 md:p-4 bg-primary/10 rounded-full">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">
                Premium Quality
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Carefully curated products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-xl mt-6 md:mt-10 lg:mt-14 mb-8 md:mb-12 lg:mb-16 px-4">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-br from-primary via-primary to-orange-700 text-white p-6 sm:p-8 md:p-12 lg:p-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative text-center space-y-4 md:space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs md:text-sm font-medium">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-tight">
              Get 20% Off Your First Order
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto px-2">
              Join thousands of happy customers across Bangladesh and experience
              premium shopping today. Use code{" "}
              <span className="font-bold bg-white/20 px-2 md:px-3 py-0.5 md:py-1 rounded-lg inline-block">
                WELCOME20
              </span>{" "}
              at checkout. Cash on Delivery available!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base lg:text-lg"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white/20 transition-colors text-sm md:text-base lg:text-lg"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
