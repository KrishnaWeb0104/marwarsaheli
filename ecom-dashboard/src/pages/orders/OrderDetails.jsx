// src/pages/dashboard/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";
import { Button } from "../../components/ui/button";

const statuses = ["pending", "processing", "shipped", "delivered"];

const OrderDetails = () => {
  const { orderId } = useParams(); // ✅ match route param
  const navigate = useNavigate();
  const { currentOrder, fetchOrderById, updateOrderStatus, isLoading } =
    useOrderStore();
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (orderId) fetchOrderById(orderId);
  }, [orderId]); // keep deps minimal

  useEffect(() => {
    if (currentOrder) setSelectedStatus(currentOrder.status);
  }, [currentOrder]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    await updateOrderStatus(orderId, newStatus); // ✅ use orderId
    fetchOrderById(orderId); // re-sync after update
  };

  if (isLoading && !currentOrder) {
    return (
      <div className="text-center py-10 font-medium text-gray-600">
        Loading order details...
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="text-center py-10 font-medium text-gray-600">
        No order found.
      </div>
    );
  }

  const { userId, items, totalAmount, orderDate, shippingAddress } = currentOrder;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📄 Order Details</h2>
        <Button onClick={() => navigate(-1)}>⬅️ Back</Button>
      </div>

      <div className="border rounded-lg p-4 shadow-sm bg-white space-y-2">
        <p>
          <strong>Customer:</strong> {" "}
          {userId?.fullName || userId?.userName || userId?.email || "N/A"}
        </p>
        <p className="flex items-center gap-2">
          <strong>Status:</strong>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="border rounded px-2 py-1"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </p>
        <p><strong>Order Date:</strong> {new Date(orderDate).toLocaleString()}</p>
        <p><strong>Total Amount:</strong> ₹{parseFloat(totalAmount).toFixed(2)}</p>
      </div>

      <div className="border rounded-lg p-4 shadow-sm bg-white">
        <h3 className="text-lg font-semibold mb-3">🛒 Items</h3>
        <ul className="space-y-3">
          {items.map((item, i) => {
            const p = item?.productId || {};
            const mainImg = p.image_url;
            const gallery = Array.isArray(p.additional_images)
              ? p.additional_images
              : [];
            return (
              <li key={i} className="border-b pb-3 flex gap-4">
                {mainImg ? (
                  <img
                    src={mainImg}
                    alt={p.name || "Product image"}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 border rounded grid place-items-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    <strong>Product:</strong> {p.name || "Product Deleted"}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{p.price ?? "N/A"}
                  </p>
                  {gallery.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {gallery.slice(0, 6).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Additional ${idx + 1}`}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {shippingAddress?.address ? (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">📍 Shipping Address</h3>
          <p>{shippingAddress?.address?.street}</p>
          <p>
            {shippingAddress?.address?.city}, {shippingAddress?.address?.state}
          </p>
          <p>
            {shippingAddress?.address?.zipCode}, {shippingAddress?.address?.country}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 shadow-sm bg-white text-gray-500 italic">
          No shipping address provided.
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
