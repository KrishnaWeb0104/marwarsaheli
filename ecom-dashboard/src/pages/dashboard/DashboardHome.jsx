import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  ReceiptIndianRupee,
} from "lucide-react";
import axiosInstance from "../../utils/api";

const DashboardHome = () => {
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({ products: 0, orders: 0, customers: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosInstance.get("/reports/dashboard/counts"),
      axiosInstance.get("/reports/orders"),
      axiosInstance.get("/reports/top-products", { params: { limit: 5 } }),
    ])
      .then(([countsRes, ordersRes, topRes]) => {
        setTotals(countsRes.data?.data || { products: 0, orders: 0, customers: 0, revenue: 0 });
        const orders = Array.isArray(ordersRes.data?.data) ? ordersRes.data.data : [];
        setRecentOrders(orders.slice(0, 5));
        setTopProducts(Array.isArray(topRes.data?.data) ? topRes.data.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: loading ? "..." : (totals.products ?? 0).toLocaleString(),
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: loading ? "..." : (totals.orders ?? 0).toLocaleString(),
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Total Customers",
      value: loading ? "..." : (totals.customers ?? 0).toLocaleString(),
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : `₹ ${Number(totals.revenue || 0).toLocaleString()}`,
      icon: ReceiptIndianRupee,
      color: "text-yellow-600",
    },
  ];

  const statusClass = (s) => {
    const base = "text-xs px-2 py-1 rounded-full";
    switch ((s || "").toLowerCase()) {
      case "pending":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "processing":
        return `${base} bg-blue-100 text-blue-700`;
      case "shipped":
        return `${base} bg-indigo-100 text-indigo-700`;
      case "delivered":
        return `${base} bg-green-100 text-green-700`;
      case "cancelled":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : recentOrders.length ? (
              <ul className="divide-y">
                {recentOrders.map((o) => (
                  <li key={o._id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {o?.userId?.fullName || o?.userId?.email || "Customer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(o.createdAt).toLocaleDateString()} • #{String(o._id).slice(-6)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₹ {Number(o.totalAmount || 0).toLocaleString()}</p>
                      <span className={statusClass(o.status)}>{o.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent orders</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : topProducts.length ? (
              <ul className="divide-y">
                {topProducts.map((p) => (
                  <li key={p.productId} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{p.name}</p>
                      {p.sku ? (
                        <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">×{p.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No top products</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
