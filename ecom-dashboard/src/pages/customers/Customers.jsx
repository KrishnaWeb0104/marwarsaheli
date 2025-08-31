import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

const dummyCustomers = [
  {
    _id: "1",
    name: "Aarav Mehta",
    email: "aarav@example.com",
    contact: "+91 9876543210",
    createdAt: "2025-07-01",
    orders: 5,
  },
  {
    _id: "2",
    name: "Isha Kapoor",
    email: "isha@example.com",
    contact: "+91 9123456780",
    createdAt: "2025-06-15",
    orders: 3,
  },
  {
    _id: "3",
    name: "Rohan Gupta",
    email: "rohan@example.com",
    contact: "+91 9988776655",
    createdAt: "2025-06-20",
    orders: 8,
  },
  // Add more dummy users if needed
];

const Customers = () => {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    setCustomers(dummyCustomers);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const result = customers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCustomers(result);
      setPage(1);
    }, 300);

    return () => clearTimeout(delay);
  }, [search, customers]);

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * limit,
    page * limit
  );
  const totalPages = Math.ceil(filteredCustomers.length / limit);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">👤 Customers</h2>

      {/* Search */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search by name..."
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
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">Joined</th>
              <th className="px-4 py-2 text-left">Orders</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No customers found
                </td>
              </tr>
            ) : (
              paginatedCustomers.map((customer) => (
                <tr key={customer._id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{customer.name}</td>
                  <td className="px-4 py-2">{customer.email}</td>
                  <td className="px-4 py-2">{customer.contact}</td>
                  <td className="px-4 py-2">{customer.createdAt}</td>
                  <td className="px-4 py-2">{customer.orders}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Link to={`/dashboard/customers/${customer._id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                    <Button size="sm" variant="destructive">
                      Block
                    </Button>
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
          <Button size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
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

export default Customers;
