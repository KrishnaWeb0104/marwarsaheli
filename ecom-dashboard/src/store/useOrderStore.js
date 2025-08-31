// /store/useOrderStore.js  (ESM ✅)
import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/orders/get-all");
      set({ orders: res.data?.data || [] });
    } catch (err) {
      console.error("❌ fetchOrders error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch orders");
      set({ error: err });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/orders/${id}`);
      set({ currentOrder: res.data?.data || null });
    } catch (err) {
      console.error("❌ fetchOrderById error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch order");
    } finally {
      set({ isLoading: false });
    }
  },

  // 🔁 Update order status (matches your backend: /status-order/:id)
  updateOrderStatus: async (id, status) => {
    try {
      // optimistic UI so the select changes instantly
      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? { ...o, status } : o)),
      }));

      const res = await axiosInstance.put(`/orders/status-order/${id}`, { status });
      toast.success("Order status updated");

      // optional: re-sync to be 100% consistent with server
      get().fetchOrders();
      return res.data?.data;
    } catch (err) {
      console.error("❌ updateOrderStatus error:", err);
      toast.error(err?.response?.data?.message || "Failed to update status");

      // rollback optimistic change if failed
      get().fetchOrders();
    }
  },

  deleteOrder: async (id) => {
    try {
      await axiosInstance.delete(`/orders/${id}`);
      toast.success("Order deleted");
      set((state) => ({
        orders: state.orders.filter((order) => order._id !== id),
      }));
    } catch (err) {
      console.error("❌ deleteOrder error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete order");
    }
  },
}));
