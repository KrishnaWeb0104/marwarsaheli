// src/pages/ShippingDetails.jsx
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAddressStore } from "@/store/useAddressStore.js";
import toast from "react-hot-toast";

const ShippingDetails = () => {
  const navigate = useNavigate();
  const { createAddress, setSelectedAddress, creating } = useAddressStore();

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    address2: "",
    zipCode: "",
    landmark: "",
    state: "",
    country: "",
  });

  // Merge address lines for cleaner storage
  const fullAddress = useMemo(() => {
    const lines = [form.address, form.address2, form.landmark]
      .map((s) => s?.trim())
      .filter(Boolean);
    return lines.join(", ");
  }, [form.address, form.address2, form.landmark]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      phoneNumber: form.phoneNumber.trim(),
      address: fullAddress || form.address.trim(),
      zipCode: form.zipCode.trim(),
      landmark: form.landmark.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
    };

    // Required field check
    if (!payload.name || !payload.phoneNumber || !payload.address || !payload.zipCode || !payload.state || !payload.country) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const created = await createAddress(payload);
      if (created?._id) setSelectedAddress(created._id);
      navigate("/payment");
    } catch {
      // errors already handled in store
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mt-10 mb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Shipping details</h2>
          <Link to="/savedAddress">
            <button className="text-sm text-yellow-500 font-medium underline hover:underline cursor-pointer">
              Use Saved Address
            </button>
          </Link>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name*"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-zinc-900 rounded-md px-4 py-2 w-full"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone number*"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="border border-zinc-900 rounded-md px-4 py-2 w-full"
            />
          </div>

          {/* Address Line 1 */}
          <input
            type="text"
            name="address"
            placeholder="Address Line 1*"
            value={form.address}
            onChange={handleChange}
            required
            className="border border-zinc-900 rounded-md px-4 py-2 w-full"
          />

          {/* Address Line 2 */}
          <input
            type="text"
            name="address2"
            placeholder="Address Line 2"
            value={form.address2}
            onChange={handleChange}
            className="border border-zinc-900 rounded-md px-4 py-2 w-full"
          />

          {/* Pincode & Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="zipCode"
              placeholder="Pincode*"
              value={form.zipCode}
              onChange={handleChange}
              required
              className="border border-zinc-900 rounded-md px-4 py-2 w-full"
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={form.landmark}
              onChange={handleChange}
              className="border border-zinc-900 rounded-md px-4 py-2 w-full"
            />
          </div>

          {/* State */}
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className="border border-zinc-900 rounded-md px-4 py-2 w-full text-gray-700"
          >
            <option value="">Select State*</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
          </select>

          {/* Country */}
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            className="border border-zinc-900 rounded-md px-4 py-2 w-full text-gray-700"
          >
            <option value="">Select Country*</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
          </select>

          {/* Continue Button */}
          <Button
            type="submit"
            disabled={creating}
            className="bg-[#BD1A12] text-white py-7 px-6 cursor-pointer mt-6 hover:bg-red-700 disabled:opacity-60"
          >
            {creating ? "Saving..." : "Save & Continue to Payment"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ShippingDetails;
