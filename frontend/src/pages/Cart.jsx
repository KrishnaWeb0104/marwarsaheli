// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import TrendingProdCard from "@/components/TrendingProdCard";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore"; // NEW

const Cart = () => {
  const {
    cart,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isFetching,
    mutatingIds,
    resetCart, // NEW
  } = useCartStore();

  const { authUser } = useAuthStore(); // NEW
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    if (authUser) {
      fetchCart().catch(() => {});
    } else {
      // when logged out, empty the cart UI
      resetCart();
    }
  }, [authUser, fetchCart, resetCart]);

  // Prefer productId for updates; fallback to line _id if needed
  const getUpdateKey = (item) => {
    // server populated version: item.product is object
    if (item?.product && (item.product._id || item.productId)) {
      return item.product._id || item.productId;
    }
    // unpopulated shape
    return item.productId || item._id;
  };

  const priceNum = (val) => {
    if (val && typeof val === "object" && "$numberDecimal" in val) {
      return parseFloat(val.$numberDecimal);
    }
    const n = Number(val ?? 0);
    return Number.isFinite(n) ? n : 0;
  };

  const items = cart?.items || [];
  const hasItems = items.length > 0;

  const subTotal = hasItems
    ? items.reduce((acc, item) => {
        const unit =
          priceNum(item?.product?.price) || priceNum(item?.price) || 0;
        const qty = Number(item?.quantity || 0);
        return acc + unit * qty;
      }, 0)
    : 0;

  const shipping = hasItems ? 240 : 0;
  const taxes = hasItems ? 240 : 0;
  const discount = hasItems ? 40 : 0;
  const total = hasItems ? subTotal + shipping + taxes - discount : 0;

  const handleIncrement = async (item) => {
    const key = getUpdateKey(item);
    await updateCartItem(key, (item.quantity || 0) + 1);
  };

  const handleDecrement = async (item) => {
    const key = getUpdateKey(item);
    if ((item.quantity || 0) > 1) {
      await updateCartItem(key, (item.quantity || 0) - 1);
    } else {
      await removeFromCart(key);
    }
  };

  // While fetching the FIRST time, show a simple loader
  if (isFetching && !cart?.items?.length) {
    return <p className="text-center py-10">Loading cart…</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mt-10 flex flex-col lg:flex-row gap-10">
        {/* Cart Table */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-2xl">Your Cart</h2>
            {hasItems && (
              <button
                className="text-red-500 text-sm underline disabled:opacity-40"
                onClick={clearCart}
                disabled={isFetching}
              >
                Clear Shopping Cart
              </button>
            )}
          </div>

          {!hasItems ? (
            <p className="text-gray-500">Your cart is empty 🛒</p>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-4 font-semibold border-b pb-2 text-gray-600">
                <p>Product</p>
                <p className="text-center">Price</p>
                <p className="text-center">Quantity</p>
                <p className="text-end">Subtotal</p>
              </div>

              <div className="space-y-6 mt-4">
                {items.map((item) => {
                  const key = String(getUpdateKey(item));
                  const locked = mutatingIds?.has?.(key);
                  const product = item.product || item.productId || {};
                  const unitPrice =
                    priceNum(product.price) || priceNum(item.price) || 0;
                  const img =
                    product.image_url || product.image || "/placeholder.svg";
                  const title = product.name || "Product";

                  return (
                    <div
                      key={key}
                      className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 border-b pb-4 opacity-100"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={img}
                          alt={title}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder.svg")
                          }
                        />
                        <p className="font-medium tracking-tighter text-sm md:text-base">
                          {title}
                        </p>
                      </div>

                      <p className="text-center font-semibold text-gray-800">
                        ₹{unitPrice.toFixed(2)}
                      </p>

                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-7 h-7 text-sm"
                          disabled={locked}
                          onClick={() => handleDecrement(item)}
                          title={locked ? "Updating…" : "Decrease"}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className={locked ? "opacity-60" : ""}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-7 h-7 text-sm"
                          disabled={locked}
                          onClick={() => handleIncrement(item)}
                          title={locked ? "Updating…" : "Increase"}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>

                      <p className="text-end font-semibold text-gray-800">
                        ₹{(unitPrice * (item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-1/3 border p-6 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          {!hasItems ? (
            <div className="text-sm text-gray-500">
              <p>Your order summary will appear here once you add products.</p>
              {/* … (unchanged empty state) */}
            </div>
          ) : (
            <>
              <div
                className={`space-y-2 text-sm ${isFetching ? "opacity-70" : "opacity-100"} text-gray-700`}
              >
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span>₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 border px-3 py-2 text-sm rounded-md"
                  disabled={isFetching}
                />
                <Button
                  className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500"
                  disabled={isFetching}
                >
                  Apply
                </Button>
              </div>

              <Link to="/shippingDetails">
                <Button
                  className="mt-6 py-7 w-full bg-[#BD1A12] text-white hover:bg-red-700"
                  disabled={isFetching}
                >
                  Continue to Checkout
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Wishlist (unchanged) */}
      {/* <div className="mt-20 mb-10">
        <h2 className="font-bold text-3xl mb-6">Product in Wishlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, idx) => (
            <TrendingProdCard key={idx} />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Cart;
