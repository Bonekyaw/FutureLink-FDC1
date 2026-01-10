import { useState, useEffect, useCallback, useRef } from "react";
import { Star, ShoppingCart, Loader2, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productApi, type Product } from "@/api/products";

const categories = [
  { id: "uuid1", name: "Living Room" },
  { id: "uuid2", name: "Bedroom" },
  { id: "uuid3", name: "Kitchen" },
  { id: "uuid4", name: "Office" },
  { id: "uuid5", name: "Outdoor" },
  { id: "uuid6", name: "Kids" },
  { id: "uuid7", name: "Dining" },
  { id: "uuid8", name: "Bathroom" },
];

function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await productApi.getProducts(page, 8);
      setProducts((prev) => [...prev, ...response.products]);
      setHasMore(response.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreProducts],
  );

  useEffect(() => {
    loadMoreProducts();
  }, [loadMoreProducts]);

  const ProductCard = ({
    product,
    ref,
  }: {
    product: Product;
    ref?: (node: HTMLDivElement | null) => void;
  }) => (
    <div
      ref={ref}
      className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
    >
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
          <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
            {product.categoryId}
          </span>
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
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <div className="fixed top-0 left-0 h-full w-64 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Categories</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowMobileFilter(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full rounded px-3 py-2 text-left transition-colors ${
                    selectedCategory === null
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full rounded px-3 py-2 text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="hidden md:block md:w-64">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full rounded px-3 py-2 text-left transition-colors ${
                      selectedCategory === null
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full rounded px-3 py-2 text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name
                  : "All Products"}
              </h1>
              <Button
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileFilter(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  ref={
                    index === products.length - 1 ? lastProductRef : undefined
                  }
                />
              ))}
            </div>

            <div className="py-8 text-center">
              {loading && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading more products...</span>
                </div>
              )}
              {!hasMore && products.length > 0 && (
                <p className="text-gray-600">
                  You've reached the end of our product list
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Product;
