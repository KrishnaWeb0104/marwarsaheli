// src/sections/HandmadeTreasure.jsx
import { useEffect } from "react";
// import ProductCard from "@/components/ProductCard.jsx";
import TrendingProdCard from "@/components/TrendingProdCard.jsx";
import { useProductStore } from "@/store/useProductStore.js";

export default function HandmadeTreasure() {
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    // pull 4 items for this section (tweak filters as your API supports)
    fetchProducts({ page: 1, limit: 4 });
  }, []);

  return (
    <div className="relative py-12 px-4 sm:px-6 bg-gray-50">
      {/* Header */}
      <div className="text-center sm:text-left mb-12 max-w-3xl mx-auto sm:mx-0">
        <h1 className="font-bold text-2xl sm:text-4xl text-red-600 mb-2">
          Handmade Treasures Crafted With Love
        </h1>
        <p className="text-gray-700 text-sm sm:text-lg font-medium">
          Admired by Hearts and Skilled Hands
        </p>
      </div>

      {/* Decorative */}
      <img
        src="/HandMade-Top-Right.webp"
        alt="Decorative"
        className="hidden sm:block absolute top-4 right-4 w-48 h-48 z-10"
      />

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-[520px] bg-gray-200 rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {(products || []).slice(0, 4).map((p) => (
              <TrendingProdCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
