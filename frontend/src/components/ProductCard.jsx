// src/components/ProductCard.jsx
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const {
    _id,
    image_url,        // Cloudinary URL or your image field
    name,         // product name/title
    description,  // short description
    price,        // number
  } = product || {};

  return (
    <div className="relative group max-w-sm w-full mx-auto sm:mx-4 mb-16 min-h-[520px]">
      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden mb-4">
        <Link to={`/product/${_id}`} aria-label={`Open ${name}`}>
          <img
            src={image_url}
            alt={name}
            className="w-full h-[450px] sm:h-[457px] object-cover"
          />
        </Link>

        {/* Play Overlay (kept, optional) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition"
            aria-hidden
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="text-center sm:text-start pt-12 px-4">
        <Link to={`/product/${_id}`}>
          <p className="text-gray-700 text-sm sm:text-md mb-3 leading-tight line-clamp-2 hover:underline">
            {description || name}
          </p>
        </Link>

        {/* Rating (static demo) */}
        <div className="flex items-center justify-center sm:justify-start mb-3">
          <div className="flex text-yellow-400 text-md">★ ★ ★ ★ ★</div>
          <span className="text-md text-gray-600 ml-2">(24,200 reviews)</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-center sm:justify-start gap-4">
          <span className="text-xl sm:text-xl font-bold text-gray-800">
            {typeof price === "number" ? `₹${price.toFixed(2)}` : price}
          </span>
          <button className="p-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition-colors">
            <FiShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
