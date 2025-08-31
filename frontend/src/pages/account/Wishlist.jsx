// src/pages/account/Wishlist.jsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiShoppingCart } from "react-icons/fi";
import { useAccountStore } from "@/store/useAccountStore";

export default function Wishlist() {
  const [activeTab, setActiveTab] = useState("all");
  const {
    wishlist,
    wishlistLoading,
    wishlistError,
    fetchWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useAccountStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const items = useMemo(() => {
    // backend populates products on GET /wishlist; if not populated, still handle minimal shape
    return Array.isArray(wishlist) ? wishlist : [];
  }, [wishlist]);

  const onRemove = async (id) => {
    const res = await removeFromWishlist(id);
    if (!res.ok) alert(res.message || "Failed to remove.");
  };

  const onClear = async () => {
    if (!confirm("Clear entire wishlist?")) return;
    const res = await clearWishlist();
    if (!res.ok) alert(res.message || "Failed to clear wishlist.");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">
          {wishlistLoading ? "Loading…" : `${items.length} Item${items.length !== 1 ? "s" : ""} in Wishlist`}
        </h2>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm underline text-gray-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Tabs (placeholder categories—hook up when you add collections) */}
      <div className="flex gap-4 mb-6">
        {["all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              activeTab === tab
                ? "bg-red-100 text-red-500 border-red-300"
                : "text-gray-600"
            }`}
          >
            All
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {wishlistError && (
        <div className="text-red-600 mb-4">{wishlistError}</div>
      )}
      {wishlistLoading && items.length === 0 && (
        <div className="text-sm text-gray-500">Fetching wishlist…</div>
      )}

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((p) => {
          // product may be populated doc or just an id
          const id = p._id || p.id || p;
          const title = p.name || p.title || "Product";
          const image =
            p.images?.[0] || p.image_url || "/Best-Seller.webp";
          const price = Number(p.price ?? 0);
          const discount = p.discount ?? 0;
          const rating = p.rating ?? 4;
          const reviews = p.reviews ?? "—";

          return (
            <div
              key={id}
              className="rounded-lg border p-4 shadow-sm hover:shadow-md transition"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <p className="text-sm text-zinc-800 mb-2 leading-tight">
                {title}
              </p>

              {/* Rating */}
              <div className="flex items-center text-yellow-500 text-sm mb-2">
                {"★ ".repeat(Math.max(1, Math.min(5, rating)))}
                <span className="ml-2 text-gray-700 font-semibold text-xs">
                  ({reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                {discount ? (
                  <span className="text-red-500 text-sm font-semibold">
                    -{discount}%
                  </span>
                ) : null}
                <span className="text-lg font-bold text-gray-800">
                  ₹{price.toFixed(2)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                  <FiShoppingCart className="mr-2" />
                  Move to Cart
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => onRemove(id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && !wishlistLoading && (
        <div className="text-sm text-gray-500 mt-6">No items in wishlist yet.</div>
      )}
    </div>
  );
}
