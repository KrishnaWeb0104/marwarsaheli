// src/pages/account/MyOrders.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAccountStore } from "@/store/useAccountStore";

const STATUS_CURRENT = new Set(["pending", "processing", "shipped"]);
const STATUS_PAST = new Set(["delivered", "cancelled"]);

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState("current");
  const {
    orders,
    ordersLoading,
    ordersError,
    fetchOrders,
    cancelOrder,
    returnOrder,
  } = useAccountStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.filter((o) =>
      activeTab === "current"
        ? STATUS_CURRENT.has(o.status)
        : STATUS_PAST.has(o.status)
    );
  }, [orders, activeTab]);

  if (ordersLoading && orders.length === 0) {
    return <div className="p-4">Loading your orders…</div>;
  }

  // Show real errors except 403/Forbidden (treat those as empty state)
  if (ordersError) {
    const msg = String(ordersError || "").toLowerCase();
    const isForbidden =
      msg.includes("403") ||
      msg.includes("forbidden") ||
      msg.includes("unauthorized");
    if (!isForbidden) {
      return <div className="p-4 text-red-600">{ordersError}</div>;
    }
  }

  const onCancel = async (id) => {
    if (!confirm("Cancel this order?")) return;
    const res = await cancelOrder(id);
    if (!res.ok) alert(res.message || "Failed to cancel order.");
  };

  const onReturn = async (id) => {
    const reason = prompt("Reason for return? (optional)") || "";
    const res = await returnOrder(id, reason);
    if (!res.ok) alert(res.message || "Failed to request return.");
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("current")}
          className={`px-5 py-2 rounded-full font-medium ${
            activeTab === "current"
              ? "bg-yellow-100 text-yellow-600"
              : "text-black"
          }`}
        >
          Current Orders
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-5 py-2 rounded-full font-medium ${
            activeTab === "past"
              ? "bg-yellow-100 text-yellow-600"
              : "text-black"
          }`}
        >
          Past Orders
        </button>
      </div>

      {/* Table Headers */}
      <div className="hidden md:grid grid-cols-4 font-semibold border-b pb-2 text-gray-600 mb-4">
        <p>Product</p>
        <p className="text-center">Price</p>
        <p className="text-center">Quantity</p>
        <p className="text-end">Subtotal</p>
      </div>

      {/* Orders */}
      {filtered.length === 0 && (
        <div className="text-sm text-gray-500 p-4">
          You haven’t placed any {activeTab === "current" ? "current" : "past"}{" "}
          orders yet.
          <br />
          <Link to="/productsList" className="text-red-600 underline">
            Start shopping
          </Link>
        </div>
      )}

      {filtered.map((order) => {
        // each order may contain multiple items; show them as rows
        return order.items.map((item, idx) => {
          const product = item.productId || {}; // populated product
          const image =
            product.images?.[0] || product.image_url || "/Best-Seller.webp";
          const title = product.name || "Product";
          const price = Number(product.price ?? 0);
          const qty = Number(item.quantity ?? 1);
          const subtotal = price * qty || 0;

          // derive status pill
          const status = order.status;
          const isDelivered = status === "delivered";
          const isCancelable = status === "pending" || status === "processing";

          return (
            <div
              key={`${order._id}-${idx}`}
              className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 border-b py-4"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-center">
                <img
                  src={image}
                  alt={title}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm md:text-base">{title}</p>

                  {/* Order status pill */}
                  <span
                    className={`text-sm px-2 py-1 rounded w-fit ${
                      status === "cancelled"
                        ? "bg-gray-200 text-gray-700"
                        : isDelivered
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    Status : {status}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      to={`/account/orders/viewOrderDetails?id=${order._id}`}
                    >
                      <button className="text-red-600 text-sm underline">
                        View Order Details
                      </button>
                    </Link>

                    {isCancelable && (
                      <button
                        onClick={() => onCancel(order._id)}
                        className="text-sm underline text-gray-700"
                      >
                        Cancel
                      </button>
                    )}

                    {isDelivered && order.returnStatus !== "requested" && (
                      <button
                        onClick={() => onReturn(order._id)}
                        className="text-sm underline text-gray-700"
                      >
                        Return
                      </button>
                    )}
                    {order.returnStatus === "requested" && (
                      <span className="text-xs text-blue-600">
                        Return requested
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <p className="text-center font-semibold text-gray-800">
                ₹{price.toFixed(2)}
              </p>

              {/* Quantity */}
              <p className="text-center">{qty}</p>

              {/* Subtotal */}
              <div className="text-end">
                <p className="font-semibold text-gray-800">
                  ₹{subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}
