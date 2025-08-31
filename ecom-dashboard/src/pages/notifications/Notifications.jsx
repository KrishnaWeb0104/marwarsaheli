import React, { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const dummyNotifications = [
  {
    id: "N001",
    message: "New order received from Priya Verma",
    type: "order",
    createdAt: "2025-08-02 10:15 AM",
    read: false,
  },
  {
    id: "N002",
    message: "Stock alert: Turmeric Powder is low",
    type: "stock",
    createdAt: "2025-08-01 03:22 PM",
    read: true,
  },
  {
    id: "N003",
    message: "Payment received: ₹599.00 from Isha Kapoor",
    type: "payment",
    createdAt: "2025-07-31 11:45 AM",
    read: false,
  },
];

const Notifications = () => {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setNotifications(dummyNotifications);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const result = notifications.filter((n) =>
        n.message.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(result);
    }, 300);

    return () => clearTimeout(delay);
  }, [search, notifications]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🔔 Notifications</h2>

      {/* Search */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => alert("Marking all as read")}>Mark All Read</Button>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-md shadow divide-y">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No notifications found</div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`flex justify-between items-center px-4 py-3 ${
                n.read ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div>
                <p className="font-medium text-sm">{n.message}</p>
                <p className="text-xs text-gray-500">{n.createdAt}</p>
              </div>
              <Button
                size="sm"
                variant={n.read ? "secondary" : "outline"}
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((item) =>
                      item.id === n.id ? { ...item, read: !item.read } : item
                    )
                  )
                }
              >
                {n.read ? "Unread" : "Mark Read"}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
