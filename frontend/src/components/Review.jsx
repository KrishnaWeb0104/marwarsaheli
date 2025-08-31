// src/components/Review.jsx
import { useEffect } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useReviewStore } from "@/store/useReviewStore.js";

const Stars = ({ value = 0, className = "text-xl" }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f-${i}`} className="text-yellow-400" />
      ))}
      {half ? <FaStarHalfAlt className="text-yellow-400" /> : null}
      {Array.from({ length: empty }).map((_, i) => (
        <FaStar key={`e-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};

const Review = ({ productId: propProductId }) => {
  const routeId = useParams()?.id; // fallback if used under /product/:id
  const productId = propProductId || routeId;

  const { reviews, loading, averageRating, totalReviews, fetchReviews } =
    useReviewStore();

  useEffect(() => {
    if (productId) fetchReviews(productId);
  }, [productId, fetchReviews]);

  return (
    <div className="mt-10 p-6 rounded-xl">
      {/* Top Section (no graph) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-1">What our customers say</h2>
          <p className="text-gray-600">
            Hear it from those who matter most—our valued customers!
          </p>
        </div>

        <div className="text-center min-w-[140px]">
          <h1 className="text-5xl font-bold text-[#FAB437]">
            {averageRating.toFixed(1)}
          </h1>
          <Stars
            value={averageRating}
            className="justify-center text-xl mt-1"
          />
          <p className="text-md font-medium mt-2 text-gray-700">
            {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
          </p>
        </div>
      </div>

      {/* Customer reviews */}
      {loading && <div className="text-gray-500">Loading reviews…</div>}

      {!loading && reviews.length === 0 && (
        <div className="text-gray-600">No reviews yet.</div>
      )}

      {!loading &&
        reviews.map((r) => (
          <div key={r._id} className="flex gap-4 mt-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
              {(r.userId?.name || r.user?.name || "U")
                .slice(0, 1)
                .toUpperCase()}
            </div>
            <div>
              <p className="font-bold">
                {r.userId?.name || r.user?.name || "Anonymous"}
              </p>
              <Stars value={Number(r.rating) || 0} className="text-md mb-1" />
              {r.title ? <p className="font-semibold mb-1">{r.title}</p> : null}
              <p className="text-gray-700 text-sm leading-relaxed">
                {r.comment || ""}
              </p>
              {r.createdAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Review;
