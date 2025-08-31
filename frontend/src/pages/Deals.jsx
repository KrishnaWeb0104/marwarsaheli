import React from "react";

const Deals = () => {
  return (
    <div className="relative px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between rounded-4xl bg-[#FAF3E0] overflow-hidden p-8 md:p-12 shadow-md relative">
        {/* Background pattern */}
        <img
          src="/Deals-BG.webp"
          alt="Pattern"
          className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
        />

        {/* Left content */}
        <div className="relative z-10 max-w-xl text-left space-y-4">
          <p className="text-lg text-black font-semibold">
            Rajasthani women handpick every ingredient with care, keeping the
            natural richness and traditional touch alive from the start.
          </p>
          <h2 className="text-5xl font-bold text-gray-900">
            Deal of the Season
          </h2>
          <p className="text-2xl font-medium tracking-tight text-gray-800">
            Get the ultimate Spice Set (12 Products for just ₹1,499)
          </p>
          <button className="mt-4 px-6 py-3 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 transition">
            Explore Product
          </button>
        </div>

        {/* Right image section */}
        <div className="relative z-10 mt-8 md:mt-0 md:ml-12">
          <img
            src="/Deals-Product.webp" // Replace with your combined product image
            alt="Spice Set"
            className="h-fit w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Deals;
