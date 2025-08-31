import React from "react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Payments",
    desc: "Accepted methods, security, and common issues.",
  },
  {
    title: "Shipping Details",
    desc: "Delivery timelines, tracking, and charges.",
  },
  {
    title: "Terms & Policies",
    desc: "Terms of service and return/refund policy.",
  },
  {
    title: "Saved Addresses",
    desc: "Manage your saved delivery locations.",
  },
  {
    title: "Testimonials",
    desc: "Stories from our happy customers.",
  },
  {
    title: "Our History",
    desc: "Where we began and what drives us.",
  },
];

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Orders typically dispatch within 24–48 hours. Delivery takes 3–7 business days depending on your location.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major cards, UPI, and net banking. For COD availability, please check at checkout.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. Unopened items can be returned within the policy window mentioned on the Terms page.",
  },
  {
    q: "How do I track my order?",
    a: "You'll receive a tracking link via email/SMS once your order ships. You can also view it in your account orders section.",
  },
];

const Resources = () => {
  return (
    <main className="min-h-screen bg-amber-50/40">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#bd1a12]">
            Resources & Help
          </h1>
          <p className="mt-3 sm:mt-4 text-neutral-700 text-sm sm:text-lg">
            Find answers fast, explore policies, and manage your account.
          </p>
          <div className="mt-6 h-1 w-24 sm:w-32 mx-auto bg-[#bd1a12]/20 rounded-full" />
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cards.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group rounded-2xl bg-white ring-1 ring-neutral-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-[#bd1a12]">
                  {c.title}
                </h3>
                <span
                  className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#bd1a12]/10 text-[#bd1a12]"
                  aria-hidden="true"
                >
                  {/* simple arrow icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414L13.172 12z" />
                  </svg>
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-8 sm:pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 text-center">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 divide-y divide-neutral-200 rounded-2xl bg-white ring-1 ring-neutral-200">
          {faqs.map((f, i) => (
            <details key={i} className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="text-sm sm:text-base font-medium text-neutral-900">
                  {f.q}
                </span>
                <span
                  className="ml-4 h-7 w-7 shrink-0 grid place-items-center rounded-full bg-[#bd1a12]/10 text-[#bd1a12] group-open:rotate-45 transition"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M11 5h2v14h-2z" />
                    <path d="M5 11h14v2H5z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Support CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="rounded-2xl bg-[#bd1a12] text-white p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">Still need help?</h3>
            <p className="text-white/90 text-sm sm:text-base mt-1">
              Our team is here for you. Reach out and we'll get back quickly.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center gap-2 rounded-lg bg-white text-[#bd1a12] px-4 py-2 text-sm font-semibold shadow-sm hover:bg-white/90"
            >
              Email Support
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Go to Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Resources;
