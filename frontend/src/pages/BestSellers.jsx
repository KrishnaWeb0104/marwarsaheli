// src/sections/BestSellers.jsx
import React, { useEffect } from "react";
import TrendingProdCard from "@/components/TrendingProdCard";
import { useProductStore } from "@/store/useProductStore.js";
import { Link } from "react-router-dom";

const BestSellers = () => {
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    // hit your API; tweak filters as your backend supports (e.g., sort by sales)
    fetchProducts({ page: 1, limit: 4, sort: "bestseller" });
  }, []);

  const handleAddToCart = (product) => {
    // wire to your cart store / API
    console.log("Add to cart:", product?._id);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/Best-Seller-BG.webp"
          className="w-full h-full object-cover opacity-75"
          alt="Background"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-[#3E2B08] font-bold mb-4">
            Best Sellers
          </h1>
          <p className="text-lg text-white leading-relaxed max-w-4xl mx-auto px-6">
            Bring home the flavours Rajasthan swears by. Our most-loved spice
            blends, handcrafted by rural women, are perfect for every kitchen
            craving authenticity and tradition.
          </p>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 bg-white/80 animate-pulse h-60"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(products || []).slice(0, 4).map((p) => (
                <TrendingProdCard
                  key={p._id}
                  product={p}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* Explore Button */}
          <div className="flex justify-center mt-12">
            <Link to="/productsList">
              {" "}
              <button className="bg-[#543210] text-white py-3 px-12 rounded-lg font-semibold transition-colors shadow-lg cursor-pointer">
                Explore
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
