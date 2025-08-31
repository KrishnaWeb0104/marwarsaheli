import React, { useMemo, useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [query, setQuery] = useState("");

  const faqs = [
    {
      q: "What is the estimated delivery time?",
      a: "Orders are processed in 1–2 business days and typically delivered within 3–7 business days, depending on your location.",
    },
    {
      q: "How do I track my order?",
      a: "A tracking link is shared via email/SMS once your order is dispatched. You can also check order status in My Account > Orders.",
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "COD may be available for select pin codes. If available, you will see the option at checkout.",
    },
    {
      q: "What is your return policy?",
      a: "Eligible items can be returned within 7 days of delivery if unopened and in original condition. Perishable/opened consumables are not returnable.",
    },
    {
      q: "How can I cancel my order?",
      a: "Orders can be cancelled before dispatch from My Account > Orders. Once dispatched, cancellations are not possible.",
    },
    {
      q: "Are your products authentic and fresh?",
      a: "Yes. Products are sourced directly and stored under strict quality control for freshness and authenticity.",
    },
    {
      q: "How should I store spices?",
      a: "Store spices in airtight containers away from heat, light, and moisture to preserve aroma and flavor.",
    },
    {
      q: "Can I place a bulk or wholesale order?",
      a: "Yes. Contact support with your requirements and we’ll assist with bulk pricing and shipping timelines.",
    },
    {
      q: "My payment failed but amount was deducted. What should I do?",
      a: "Most failed payments auto-reverse within 3–7 business days. If not, contact support with your transaction ID.",
    },
    {
      q: "How do I apply a coupon?",
      a: "Enter your coupon code on the cart or checkout page. Valid coupons are applied to the order total.",
    },
  ];

  const filtered = useMemo(() => {
    const ql = query.trim().toLowerCase();
    if (!ql) return faqs;
    return faqs.filter(
      (f) => f.q.toLowerCase().includes(ql) || f.a.toLowerCase().includes(ql)
    );
  }, [query, faqs]);

  const toggle = (idx) => {
    setOpenIndex((cur) => (cur === idx ? null : idx));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Find answers to common questions about orders, delivery, returns, and
          more.
        </p>
      </header>

      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search FAQs"
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Search FAQs"
        />
      </div>

      <div className="bg-white border rounded-lg divide-y">
        {filtered.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">
            No results found. Try a different keyword.
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            const btnId = `faq-btn-${idx}`;
            return (
              <div key={idx}>
                <button
                  id={btnId}
                  className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="font-medium text-gray-900">{item.q}</span>
                  <span
                    className={`ml-4 transform transition-transform ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden
                  >
                    ▾
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`px-4 pb-4 text-sm text-gray-700 ${
                    isOpen ? "block" : "hidden"
                  }`}
                >
                  {item.a}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 text-sm text-gray-600">
        Still need help?{" "}
        <a href="/contact" className="text-red-600 underline">
          Contact support
        </a>
        .
      </div>
    </div>
  );
};

export default FAQ;
