import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useShippingStore = create((set, get) => ({
  shippingList: [],
  shippingEntry: null,
  loading: false,
  error: null,

  // Fetch all shipping records
  fetchAllShipping: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/shipping/all-shipping");
      set({ shippingList: res.data?.data || [] });
    } catch (err) {
      toast.error("Failed to fetch shipping info");
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch shipping by order ID
  fetchShippingByOrder: async (orderId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/shipping/${orderId}`);
      set({ shippingEntry: res.data?.data });
    } catch (err) {
      toast.error("Failed to fetch shipping for order");
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  // Create new shipping entry
  createShipping: async (data) => {
    try {
      const res = await axiosInstance.post("/shipping/create-shipping", data);
      toast.success("Shipping entry created");
      get().fetchAllShipping();
      return res.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create shipping entry");
      throw err;
    }
  },

  // Update shipping
  updateShipping: async (orderId, data) => {
    try {
      const res = await axiosInstance.put(`/shipping/update-shipping/${orderId}`, data);
      toast.success("Shipping info updated");
      get().fetchAllShipping();
      return res.data?.data;
    } catch (err) {
      toast.error("Failed to update shipping info");
      throw err;
    }
  },

  // Delete shipping
  deleteShipping: async (orderId) => {
    try {
      await axiosInstance.delete(`/shipping/delete-shipping/${orderId}`);
      toast.success("Shipping entry deleted");
      set((state) => ({
        shippingList: state.shippingList.filter((s) => s.orderId._id !== orderId),
      }));
    } catch (err) {
      toast.error("Failed to delete shipping");
    }
  },
}));
