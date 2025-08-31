import React from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "August 20, 2025";

const Policies = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Store Policies</h1>
        <p className="text-sm text-gray-500 mt-1">
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      {/* Table of Contents */}
      <nav
        aria-label="Table of contents"
        className="mb-8 rounded-lg border bg-white p-4 text-sm"
      >
        <p className="font-medium mb-2">Jump to:</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          <li>
            <a className="text-red-600 hover:underline" href="#shipping">
              Shipping Policy
            </a>
          </li>
          <li>
            <a className="text-red-600 hover:underline" href="#returns">
              Returns & Refunds
            </a>
          </li>
          <li>
            <a className="text-red-600 hover:underline" href="#cancellations">
              Order Cancellations
            </a>
          </li>
          <li>
            <a className="text-red-600 hover:underline" href="#payments">
              Payment Methods
            </a>
          </li>
          <li>
            <a className="text-red-600 hover:underline" href="#privacy">
              Privacy Policy
            </a>
          </li>
          <li>
            <a className="text-red-600 hover:underline" href="#terms">
              Terms of Service
            </a>
          </li>
          <li>
            <a className="text-red-600 hover:underline" href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      {/* Shipping */}
      <section id="shipping" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Shipping Policy</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Processing time: 1–2 business days after order confirmation.</li>
          <li>Estimated delivery: 3–7 business days for most pin codes.</li>
          <li>
            Tracking details are emailed/SMSed once the order is dispatched.
          </li>
          <li>
            If a package arrives damaged, refuse delivery or record an unboxing
            video and contact support within 48 hours.
          </li>
          <li>
            Shipping fees (if any) are shown at checkout based on weight and
            location.
          </li>
        </ul>
      </section>

      {/* Returns & Refunds */}
      <section id="returns" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Returns & Refunds</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            Return window: 7 days from delivery for eligible, unopened items.
          </li>
          <li>
            Non-returnable: perishable or opened consumables, clearance items,
            and customized products.
          </li>
          <li>
            To initiate a return, share your order ID and issue details with
            support.
          </li>
          <li>
            Refunds are processed to the original payment method within 5–7
            business days after inspection.
          </li>
          <li>
            Replacement is offered for defective or incorrect items, subject to
            stock availability.
          </li>
        </ul>
      </section>

      {/* Cancellations */}
      <section id="cancellations" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Order Cancellations</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            Orders can be cancelled before dispatch. Dispatched orders can’t be
            cancelled.
          </li>
          <li>
            If cancelled in time, a full refund is issued to the original
            payment method.
          </li>
        </ul>
      </section>

      {/* Payments */}
      <section id="payments" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Payment Methods</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Credit/Debit Cards (Visa, MasterCard, Rupay)</li>
          <li>UPI and NetBanking</li>
          <li>Wallets (where supported)</li>
          <li>Cash on Delivery (COD) may be available on select pin codes</li>
        </ul>
      </section>

      {/* Privacy */}
      <section id="privacy" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Privacy Policy</h2>
        <p className="text-gray-700 mb-2">
          We collect necessary information (name, email, phone, address, order
          details) to process orders and improve our services.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            Payment details are processed by secure payment gateways; we don’t
            store full card data.
          </li>
          <li>We use cookies for essential functionality and analytics.</li>
          <li>
            Data is shared only with trusted service providers (couriers,
            payment processors) to fulfill your order.
          </li>
          <li>
            You can request data access, correction, or deletion by contacting
            support.
          </li>
        </ul>
      </section>

      {/* Terms */}
      <section id="terms" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Terms of Service</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Product images are illustrative; minor variations may occur.</li>
          <li>
            Pricing and availability are subject to change without prior notice.
          </li>
          <li>
            Misuse of discount codes or fraudulent activity may result in order
            cancellation.
          </li>
          <li>
            By placing an order, you agree to these terms and the privacy
            policy.
          </li>
        </ul>
      </section>

      {/* Contact */}
      <section id="contact" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Contact</h2>
        <p className="text-gray-700">
          Need help? Reach us at{" "}
          <a
            className="text-red-600 hover:underline"
            href="mailto:support@spices.example"
          >
            support@spices.example
          </a>{" "}
          or{" "}
          <Link className="text-red-600 hover:underline" to="/contact">
            contact us
          </Link>
          .
        </p>
      </section>

      <div className="pt-4">
        <a
          href="#top"
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Back to top
        </a>
      </div>
    </div>
  );
};

export default Policies;
