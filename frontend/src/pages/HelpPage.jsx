import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const HelpPage = () => {
  const [query, setQuery] = useState("");

  const topics = [
    {
      title: "Track my order",
      desc: "See current status and delivery updates.",
      to: "/account",
    },
    {
      title: "Returns & refunds",
      desc: "Eligibility, timelines, and how to raise a return.",
      to: "/policies#returns",
    },
    {
      title: "Shipping policy",
      desc: "Processing time, delivery estimates, and charges.",
      to: "/policies#shipping",
    },
    {
      title: "Payment methods",
      desc: "Cards, UPI, NetBanking, and COD availability.",
      to: "/policies#payments",
    },
    {
      title: "Manage my account",
      desc: "Profile, addresses, and password changes.",
      to: "/account",
    },
    { title: "FAQs", desc: "Browse frequently asked questions.", to: "/faq" },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-sm text-gray-600 mt-1">
          Find answers, manage your orders, or contact our support team.
        </p>
      </header>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link
          to="/account"
          className="border rounded-lg p-4 hover:shadow transition"
        >
          <h3 className="font-semibold">Track my order</h3>
          <p className="text-sm text-gray-600 mt-1">
            Live status and delivery updates
          </p>
        </Link>
        <Link
          to="/policies#returns"
          className="border rounded-lg p-4 hover:shadow transition"
        >
          <h3 className="font-semibold">Returns & refunds</h3>
          <p className="text-sm text-gray-600 mt-1">
            Start a return or see eligibility
          </p>
        </Link>
        <Link
          to="/faq"
          className="border rounded-lg p-4 hover:shadow transition"
        >
          <h3 className="font-semibold">FAQs</h3>
          <p className="text-sm text-gray-600 mt-1">Browse common questions</p>
        </Link>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Help Topics */}
        <section className="md:col-span-2">
          <div className="mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help topics"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Search help topics"
            />
          </div>

          <div className="bg-white border rounded-lg divide-y">
            {filtered.length === 0 ? (
              <div className="p-6 text-sm text-gray-600">No results found.</div>
            ) : (
              filtered.map((t, i) => (
                <Link
                  key={i}
                  to={t.to}
                  className="flex items-start justify-between px-4 py-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{t.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{t.desc}</p>
                  </div>
                  <span className="ml-4 text-gray-400" aria-hidden>
                    &rarr;
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Contact Support */}
        <aside className="md:col-span-1">
          <div className="border rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-2">Contact support</h2>
            <p className="text-sm text-gray-600 mb-4">
              We’re here Mon–Sat, 10:00–18:00 IST.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Email</p>
                <a
                  href="mailto:support@spices.example"
                  className="text-red-600 underline"
                >
                  support@spices.example
                </a>
              </div>
              <div>
                <p className="font-medium">Help Center</p>
                <Link to="/contact" className="text-red-600 underline">
                  Submit a request
                </Link>
              </div>
              <div>
                <p className="font-medium">Policies</p>
                <Link to="/policies" className="text-red-600 underline">
                  Shipping, returns, and privacy
                </Link>
              </div>
            </div>

            <div className="mt-5 border-t pt-4 text-xs text-gray-500">
              For order-specific help, include your Order ID from
              <span> </span>
              <Link to="/account" className="text-red-600 underline">
                My Account
              </Link>
              .
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HelpPage;
