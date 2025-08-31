import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useShippingStore } from "../../store/useShippingStore";

const ShippingManagement = () => {
  const [search, setSearch] = useState("");
  const { shippingList, fetchAllShipping, updateShipping, loading } = useShippingStore();
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetchAllShipping();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const filteredData = shippingList.filter((s) =>
        s.carrier.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredData);
    }, 300);
    return () => clearTimeout(delay);
  }, [search, shippingList]);

  const toggleStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "cancelled" ? "in_transit" : "cancelled";
    await updateShipping(orderId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🚚 Shipping Management</h2>

      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search by carrier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => alert("Add new shipping entry UI coming soon!")}>
          Add Shipping
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Order</th>
              <th className="px-4 py-2 text-left">Carrier</th>
              <th className="px-4 py-2 text-left">Tracking No.</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Shipped At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No shipping data found
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s._id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{s.orderId?._id || "N/A"}</td>
                  <td className="px-4 py-2">{s.carrier}</td>
                  <td className="px-4 py-2">{s.trackingNumber}</td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        s.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : s.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {s.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {s.shippedAt
                      ? new Date(s.shippedAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Button size="sm" onClick={() => alert("Edit UI coming soon")}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => toggleStatus(s.orderId._id, s.status)}
                    >
                      {s.status === "cancelled" ? "Enable" : "Disable"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingManagement;
