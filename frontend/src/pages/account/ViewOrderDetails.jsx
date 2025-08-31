import React from "react";

const orderItems = [
  {
    id: 1,
    title: "STONE-GROUND CORIANDER POWDER | ANDPICKED SEEDS | 100G PACK",
    price: 120,
    image: "/Best-Seller.webp",
  },
  {
    id: 2,
    title: "STONE-GROUND CORIANDER POWDER | ANDPICKED SEEDS | 100G PACK",
    price: 120,
    image: "/Best-Seller.webp",
  },
];

const ViewOrderDetails = () => {
  const totalItems = orderItems.length;
  const subTotal = orderItems.reduce((acc, item) => acc + item.price, 0);
  const shipping = 240;
  const taxes = 240;
  const discount = 40;
  const total = subTotal + shipping + taxes - discount;

  const steps = ["Order Confirmed", "Shipped", "Out For Delivery", "Delivered"];

  const currentStep = 0; // Index of current step in progress bar

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Progress Tracker */}
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div
              className={`w-4 h-4 rounded-full mb-1 ${
                idx <= currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <p
              className={`text-sm ${
                idx === currentStep
                  ? "text-green-600 font-medium"
                  : "text-gray-400"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-sm mb-10 text-center">Tue, 3rd June</p>

      {/* Order Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left - Product List */}
        <div className="md:col-span-2 space-y-6">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border p-4 rounded"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <p className="text-sm font-medium max-w-xs">{item.title}</p>
              </div>
              <p className="text-gray-800 font-semibold">
                ₹{item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Right - Summary */}
        <div className="border p-6 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>₹{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹{taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Coupon Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
