import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useReportStore } from "../../store/useReportStore";
import { useAuthStore } from "../../store/useAdminStore";

const Reports = () => {
  const { can } = useAuthStore();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(can("REPORTS", "VIEW"));
  }, [can]);

  const [activeTab, setActiveTab] = useState("order");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");

  const {
    orderReports,
    customerReports,
    paymentReports,
    fetchOrderReports,
    fetchCustomerReports,
    fetchPaymentReports,
    loading,
  } = useReportStore();

  useEffect(() => {
    if (activeTab === "order") fetchOrderReports(from, to);
    if (activeTab === "customer") fetchCustomerReports(from, to);
    if (activeTab === "payment") fetchPaymentReports(from, to);
  }, [activeTab, from, to]);

  const getFilteredData = () => {
    const data =
      activeTab === "order"
        ? orderReports
        : activeTab === "customer"
        ? customerReports
        : paymentReports;

    return data.filter((r) =>
      (r?.userId?.fullName || r?.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  };

  const filtered = getFilteredData();

  if (!allowed) {
    return <div className="text-red-600">You do not have permission to view Reports.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Reports</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        {["order", "customer", "payment"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab[0].toUpperCase() + tab.slice(1)} Reports
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="max-w-[180px]"
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="max-w-[180px]"
        />
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => alert("Export logic coming soon!")}>
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              {activeTab === "order" && (
                <>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </>
              )}
              {activeTab === "customer" && (
                <>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Joined</th>
                </>
              )}
              {activeTab === "payment" && (
                <>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Order</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  No data found
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  {activeTab === "order" && (
                    <>
                      <td className="px-4 py-2">{item?.userId?.fullName || "N/A"}</td>
                      <td className="px-4 py-2">
                        {new Date(item?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">₹{parseFloat(item?.totalAmount).toFixed(2)}</td>
                      <td className="px-4 py-2">{item?.status}</td>
                    </>
                  )}
                  {activeTab === "customer" && (
                    <>
                      <td className="px-4 py-2">{item?.fullName}</td>
                      <td className="px-4 py-2">{item?.email}</td>
                      <td className="px-4 py-2">
                        {new Date(item?.createdAt).toLocaleDateString()}
                      </td>
                    </>
                  )}
                  {activeTab === "payment" && (
                    <>
                      <td className="px-4 py-2">{item?.userId?.fullName || "N/A"}</td>
                      <td className="px-4 py-2">{item?.orderId?._id || "N/A"}</td>
                      <td className="px-4 py-2">₹{parseFloat(item?.amount).toFixed(2)}</td>
                      <td className="px-4 py-2">
                        {new Date(item?.createdAt).toLocaleDateString()}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
