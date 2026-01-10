import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { type Product } from "@/type";
import { productQuery } from "@/api/query";

function Home() {
  const { data } = useSuspenseQuery(productQuery("?limit=8"));
  const products = Array.isArray(data) ? data : (data?.products ?? []);
  console.log(products);

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="relative flex h-48 items-center justify-center bg-gray-200">
        <span className="text-gray-400">Product Image</span>
        {product.inventory < 5 && (
          <span className="absolute top-2 right-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
            Low Stock
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          {/* <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
            {product.categoryId}
          </span> */}
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {product.description}
        </p>
        <div className="mb-4 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            <p className="mt-1 text-xs text-gray-500">
              {product.inventory} in stock
            </p>
          </div>
          <Button size="sm" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative bg-cover bg-center text-white"
        style={{ backgroundImage: "url(/house.webp)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Transform Your Space with Beautiful Furniture
            </h1>
            <p className="mb-8 text-xl text-blue-100 md:text-2xl">
              Discover our curated collection of modern and classic furniture
              pieces
            </p>
            <Link to="/product">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <Truck className="mx-auto mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-lg font-semibold">Free Delivery</h3>
              <p className="text-gray-600">Free shipping on orders over $500</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-lg font-semibold">Quality Guarantee</h3>
              <p className="text-gray-600">
                Premium materials and craftsmanship
              </p>
            </div>
            <div className="text-center">
              <RefreshCw className="mx-auto mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-lg font-semibold">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold">All Products</h2>
            <div className="text-sm text-gray-600">
              Showing {products.length} products
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/product">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Transform Your Space?
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Browse our collection and find the perfect pieces for your home
          </p>
          <Link to="/product">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
