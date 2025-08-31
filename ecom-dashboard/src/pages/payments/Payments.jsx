import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const dummyPayments = [
  {
    id: "P001",
    customer: "Aarav Mehta",
    amount: 1299.99,
    method: "UPI",
    status: "Success",
    date: "2025-08-01",
  },
  {
    id: "P002",
    customer: "Isha Kapoor",
    amount: 599.5,
    method: "Credit Card",
    status: "Pending",
    date: "2025-07-30",
  },
  {
    id: "P003",
    customer: "Rohan Gupta",
    amount: 899.0,
    method: "Cash",
    status: "Failed",
    date: "2025-07-29",
  },
];

const Payments = () => {
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    setPayments(dummyPayments);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const result = payments.filter((p) =>
        p.customer.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPayments(result);
    }, 300);
    return () => clearTimeout(delay);
  }, [search, payments]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">💳 Payments</h2>

      {/* Search */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => alert("Export initiated...")}>Export</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Method</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2">{p.customer}</td>
                  <td className="px-4 py-2">₹{p.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{p.method}</td>
                  <td className={`px-4 py-2 font-medium ${p.status === "Success" ? "text-green-600" : p.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                    {p.status}
                  </td>
                  <td className="px-4 py-2">{p.date}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button size="sm">Details</Button>
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

export default Payments;
