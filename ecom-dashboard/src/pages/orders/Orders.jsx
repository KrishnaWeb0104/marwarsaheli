import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";

const statuses = ["pending", "processing", "shipped", "delivered"];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { orders, fetchOrders, updateOrderStatus, isLoading } = useOrderStore();
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const result = orders.filter((order) => {
        const name =
          typeof order.userId === "object"
            ? order.userId.fullName
            : order.userId;
        return (
          name?.toLowerCase().includes(search.toLowerCase()) ||
          order._id.toLowerCase().includes(search.toLowerCase())
        );
      });
      setFilteredOrders(result);
      setPage(1);
    }, 300);
    return () => clearTimeout(delay);
  }, [search, orders]);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * limit,
    page * limit
  );
  const totalPages = Math.ceil(filteredOrders.length / limit);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Orders</h2>

      {/* Search */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search by customer name or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Items</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  Loading orders...
                </td>
              </tr>
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No orders found
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order._id} className="border-t border-gray-200">
                  <td className="px-4 py-2">
                    {typeof order.userId === "object"
                      ? order.userId.fullName
                      : order.userId}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{order.items?.length || 0}</td>
                  <td className="px-4 py-2">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Link to={order._id}>
                      <Button size="sm" variant="secondary">
                        Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            ⬅️ Prev
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next ➡️
          </Button>
        </div>
      )}
    </div>
  );
};
export default Orders;
