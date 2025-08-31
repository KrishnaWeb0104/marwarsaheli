// src/pages/ProductsList.jsx
import React, { useEffect, useMemo, useState } from "react";
import TrendingProdCard from "../components/TrendingProdCard";
import { useProductStore } from "@/store/useProductStore.js";
import { useCategoryStore } from "@/store/useCategoryStore.js";

const USE_SLUG = true; // if backend filters by slug; set false to use _id

const ProductsList = () => {
  const { products, fetchProducts, isLoading, pagination } = useProductStore();
  const {
    dropdownCategories,
    fetchDropdownCategories,
    isLoading: isCatLoading,
  } = useCategoryStore();

  // Multi-select categories (array of keys: slug or id)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [stock, setStock] = useState({ in: false, out: false });
  const [page, setPage] = useState(1);
  const [limit] = useState(9); // 3 x 3 grid

  useEffect(() => {
    fetchDropdownCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build params for API
  const params = useMemo(() => {
    const selectedSet = new Set(selectedCategories);

    // Find selected category objects for ids
    const selectedObjs = dropdownCategories.filter((c) =>
      selectedSet.has(USE_SLUG ? c.slug : String(c._id))
    );

    const catKeys = selectedObjs.map((c) =>
      USE_SLUG ? c.slug : String(c._id)
    );
    const catIds = selectedObjs.map((c) => String(c._id));

    const inStock =
      stock.in && !stock.out
        ? true
        : !stock.in && stock.out
          ? false
          : undefined;

    const p = {
      page,
      limit,
      ...(inStock !== undefined && { inStock }),
    };

    // Send multiple variants to be backend-friendly
    if (catKeys.length > 0) {
      p.category = catKeys; // array
      p.categories = catKeys; // array
      p.categoryIn = catKeys.join(","); // csv
      // id variants too
      p.categoryId = catIds; // array
      p.category_id = catIds; // array
      p.categoryIds = catIds.join(","); // csv
      p.category_ids = catIds.join(","); // csv
    }

    return p;
  }, [page, limit, stock, selectedCategories, dropdownCategories]);

  // Fetch products on param change
  useEffect(() => {
    fetchProducts(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Client-side filter (category + stock) to ensure only matching cards show
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? products : [];

    // Category filter
    if (selectedCategories.length > 0) {
      const selectedSet = new Set(selectedCategories);
      list = list.filter((p) => {
        const cat = p?.category || {};
        const slug = cat?.slug;
        const id = String(cat?._id || "");
        const key = USE_SLUG ? slug : id;
        return key && selectedSet.has(key);
      });
    }

    // Stock filter
    if (stock.in && !stock.out) {
      list = list.filter((p) =>
        typeof p.inStock === "boolean"
          ? p.inStock
          : Number(p.stock_quantity) > 0
      );
    } else if (!stock.in && stock.out) {
      list = list.filter((p) =>
        typeof p.inStock === "boolean"
          ? !p.inStock
          : Number(p.stock_quantity) <= 0
      );
    }

    return list;
  }, [products, selectedCategories, stock]);

  // Paginate filtered list
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / limit));
  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, page, limit]);

  // Toggle a single category selection
  const toggleCategory = (key) => {
    setPage(1);
    setSelectedCategories((prev) => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key);
      else s.add(key);
      return Array.from(s);
    });
  };

  // Remove a chip (category)
  const removeCategoryChip = (key) => {
    setPage(1);
    setSelectedCategories((prev) => prev.filter((k) => k !== key));
  };

  // Remove a stock chip
  const removeStockChip = (which) => {
    setPage(1);
    setStock((s) => ({ ...s, [which]: false }));
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setStock({ in: false, out: false });
    setPage(1);
  };

  // Helpers to render labels for selected categories
  const nameByKey = (key) => {
    const found = dropdownCategories.find((c) =>
      USE_SLUG ? c.slug === key : String(c._id) === key
    );
    return found?.name || key;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 px-6 py-10">
      {/* ✅ Filters Section */}
      <aside className="w-full md:w-1/4 bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Applied Filters (chips) */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Applied Filters</p>
          <div className="flex gap-2 flex-wrap">
            {selectedCategories.map((key) => (
              <span
                key={key}
                className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center gap-1"
              >
                {nameByKey(key)}
                <button
                  onClick={() => removeCategoryChip(key)}
                  className="ml-1 text-gray-500 hover:text-red-600"
                  aria-label="Remove category filter"
                >
                  ✕
                </button>
              </span>
            ))}

            {stock.in && (
              <span className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center gap-1">
                In Stock
                <button
                  onClick={() => removeStockChip("in")}
                  className="ml-1 text-gray-500 hover:text-red-600"
                  aria-label="Remove In Stock"
                >
                  ✕
                </button>
              </span>
            )}
            {stock.out && (
              <span className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center gap-1">
                Out of Stock
                <button
                  onClick={() => removeStockChip("out")}
                  className="ml-1 text-gray-500 hover:text-red-600"
                  aria-label="Remove Out of Stock"
                >
                  ✕
                </button>
              </span>
            )}

            {(selectedCategories.length > 0 || stock.in || stock.out) && (
              <button className="text-red-500 text-xs" onClick={clearAll}>
                clear all
              </button>
            )}
          </div>
        </div>

        {/* Category (dynamic, multi-select) */}
        <div className="mb-4">
          <p className="font-medium text-sm mb-2">Category</p>

          {isCatLoading && (
            <span className="text-xs text-gray-500">Loading categories…</span>
          )}

          {!isCatLoading && (
            <div className="flex flex-col gap-2 text-sm max-h-[320px] overflow-auto pr-1">
              {dropdownCategories.map((c) => {
                const key = USE_SLUG ? c.slug : String(c._id);
                const checked = selectedCategories.includes(key);
                return (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(key)}
                    />
                    {c.name}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div>
          <p className="font-medium text-sm mb-2">Availability</p>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={stock.in}
                onChange={() => {
                  setPage(1);
                  setStock((s) => ({ ...s, in: !s.in }));
                }}
              />
              In Stock
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={stock.out}
                onChange={() => {
                  setPage(1);
                  setStock((s) => ({ ...s, out: !s.out }));
                }}
              />
              Out of Stock
            </label>
          </div>
        </div>
      </aside>

      {/* ✅ Products Grid */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-6">
          Showing Filtered Products
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-4 bg-white/80 animate-pulse h-60"
              />
            ))}
          </div>
        ) : paginated.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((p) => (
              <TrendingProdCard
                key={p._id}
                product={p}
                onAddToCart={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            No products found for selected filters.
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const n = idx + 1;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-1 rounded ${
                  page === n
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
