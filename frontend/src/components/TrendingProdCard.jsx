import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const TrendingProdCard = ({ product, onAddToCart = () => {} }) => {
  if (!product) return null;

  const { _id, image_url, name, description, price, discount } = product;

  // Handle Decimal128 | number | string
  const priceNum = (val) => {
    if (val && typeof val === "object" && "$numberDecimal" in val) {
      return parseFloat(val.$numberDecimal);
    }
    const n = Number(val ?? 0);
    return Number.isFinite(n) ? n : 0;
  };
  const safePrice = `₹${priceNum(price).toFixed(2)}`;

  return (
    <div className="rounded-xl p-4  shadow-sm hover:shadow-md transition">
      {/* Image */}
      <Link to={`/product/${_id}`} aria-label={`Open ${name}`}>
        <img
          src={image_url || "/placeholder.png"}
          alt={name}
          className="w-full h-54 object-cover object-top rounded-lg mb-4"
          loading="lazy"
        />
      </Link>

      {/* Name + Description */}
      <Link to={`/product/${_id}`}>
        <h3 className="text-base md:text-lg font-semibold text-zinc-900 mb-1 line-clamp-1 hover:underline">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-zinc-700 mb-3 leading-tight line-clamp-2">
            {description}
          </p>
        )}
      </Link>

      {/* Rating (static demo) */}
      <div className="flex items-center mb-2">
        <div className="flex text-[#FFAF19] text-2xl leading-none">
          ★ ★ ★ ★{" "}
        </div>
        <span className="text-sm font-medium text-black ml-2">
          (24,200 reviews)
        </span>
      </div>

      {/* Price Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {typeof discount === "number" && discount > 0 && (
            <span className="text-red-500 text-xs font-semibold">
              -{discount}%
            </span>
          )}
          <span className="text-xl font-bold text-gray-800">{safePrice}</span>
        </div>

        <button
          className="p-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition-colors"
          onClick={() => onAddToCart(product)}
          aria-label="Add to cart"
        >
          <FiShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TrendingProdCard;
