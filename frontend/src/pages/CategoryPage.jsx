import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useCategoryStore } from "../store/useCategoryStore";
import TrendingProdCard from "../components/TrendingProdCard.jsx"; // NEW

const slugify = (label) =>
  encodeURIComponent(label.trim().toLowerCase().replace(/\s+/g, "-"));

const pretty = (slug) =>
  decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function CategoryPage() {
  const { slug } = useParams();
  const readable = useMemo(() => pretty(slug), [slug]);

  const { categories, fetchCategories } = useCategoryStore();
  const { products, fetchProducts, isLoading } = useProductStore();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // ensure categories exist
      if (!categories?.length) await fetchCategories();

      // find the matching category by slug
      const match = (categories || []).find((c) => slugify(c.name) === slug);

      if (!mounted) return;
      if (!match) {
        setNotFound(true);
        return;
      }

      setNotFound(false);
      // 🔑 if your backend expects categoryId, pass match._id
      await fetchProducts({ page: 1, category: match._id });
    })();

    return () => {
      mounted = false;
    };
  }, [slug]); // re-run when slug changes

  if (notFound) {
    return (
      <div className="px-4 py-16 text-center">
        No such category: <b>{readable}</b>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Category: {readable}
      </h1>

      {isLoading ? (
        <div className="py-10 text-center">Loading…</div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* ...existing code... */}
          {products.map((p) => (
            <TrendingProdCard key={p._id || p.id} product={p} />
          ))}
          {/* ...existing code... */}
        </div>
      ) : (
        <div className="py-10 text-center">
          No products found in {readable}.
        </div>
      )}
    </div>
  );
}
