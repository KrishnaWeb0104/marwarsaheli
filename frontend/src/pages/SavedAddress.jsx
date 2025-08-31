// src/pages/SavedAddress.jsx
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useAddressStore } from "@/store/useAddressStore.js";
import toast from "react-hot-toast";

const SavedAddress = () => {
  const navigate = useNavigate();
  const {
    addresses,
    fetchAddresses,
    deleteAddress,
    selectedAddressId,
    setSelectedAddress,
    isLoading,
    deleting,
  } = useAddressStore();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const onContinue = () => {
    if (!selectedAddressId) {
      toast.error("Please select an address to continue");
      return;
    }
    navigate("/payment");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-4">Saved addresses</h2>
          <button
            onClick={() => navigate("/add-address")}
            className="flex items-center gap-2 text-blue-600 text-sm"
          >
            <Plus size={16} /> Add New Address
          </button>
        </div>

        {/* list */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-sm text-gray-500">Loading addresses…</div>
          ) : addresses.length === 0 ? (
            <div className="text-sm text-gray-600">
              No saved addresses yet. Add one to speed up checkout.
            </div>
          ) : (
            addresses.map((addr) => (
              <label
                key={addr._id}
                className={`flex items-start justify-between gap-4 p-4 border rounded-md cursor-pointer ${
                  String(selectedAddressId) === String(addr._id)
                    ? "border-zinc-800 shadow-sm"
                    : "bg-zinc-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="address"
                    checked={String(selectedAddressId) === String(addr._id)}
                    onChange={() => setSelectedAddress(addr._id)}
                    className="mt-1 accent-blue-600"
                  />
                  <p className="text-sm">
                    {addr.name ? `${addr.name}, ` : ""}
                    {addr.phoneNumber ? `${addr.phoneNumber}, ` : ""}
                    {addr.address ? `${addr.address}` : ""}
                    {addr.address2 ? `, ${addr.address2}` : ""}
                    {addr.landmark ? `, ${addr.landmark}` : ""}
                    {addr.state ? `, ${addr.state}` : ""}
                    {addr.zipCode ? ` - ${addr.zipCode}` : ""}
                    {addr.country ? `, ${addr.country}` : ""}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await deleteAddress(addr._id);
                    } catch {
                      // toast handled in store
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                  title="Delete address"
                >
                  <Trash2 size={18} />
                </button>
              </label>
            ))
          )}
        </div>

        <Button
          onClick={onContinue}
          className="mt-6 py-7 px-6 cursor-pointer bg-[#BD1A12] text-white hover:bg-red-700"
          disabled={isLoading || !addresses || addresses.length === 0}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default SavedAddress;
