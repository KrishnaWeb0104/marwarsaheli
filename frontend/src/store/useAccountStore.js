// src/store/useAccountStore.js
import { create } from "zustand";
import axiosInstance from "@/utils/api.js";
import toast from "react-hot-toast"; // NEW

export const useAccountStore = create((set, get) => ({
  // ---------- PROFILE STATE ----------
  me: null,
  loading: false,
  error: null,

  updating: false,
  updateError: null,
  updatingAvatar: false,
  changingPassword: false,
  logoutLoading: false,

  // ---------- ORDERS STATE ----------
  orders: [],
  ordersLoading: false,
  ordersError: null,

  order: null,
  orderLoading: false,
  orderError: null,

  // ---------- WISHLIST STATE ----------
  wishlist: [],
  wishlistLoading: false,
  wishlistError: null,

  // ---------- PROFILE ACTIONS ----------
  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/users/current-user");
      set({ me: data?.data || null });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ error: msg });
      toast.error(`Failed to load profile: ${msg}`);
    } finally {
      set({ loading: false });
    }
  },

  updateAccount: async (payload) => {
    set({ updating: true, updateError: null });
    try {
      const { data } = await axiosInstance.patch(
        "/users/update-account",
        payload
      );
      set({ me: data?.data || get().me });
      toast.success("Account updated");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ updateError: msg });
      toast.error(`Update failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ updating: false });
    }
  },

  uploadAvatar: async (file) => {
    if (!file) {
      toast.error("No file selected");
      return { ok: false, message: "No file selected" };
    }
    set({ updatingAvatar: true });
    try {
      const form = new FormData();
      form.append("avatar", file);
      const { data } = await axiosInstance.patch("/users/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ me: data?.data || get().me });
      toast.success("Profile photo updated");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Avatar update failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ updatingAvatar: false });
    }
  },

  changePassword: async ({ oldPassword, newPassword }) => {
    set({ changingPassword: true });
    try {
      await axiosInstance.post("/users/change-password", {
        oldPassword,
        newPassword,
      });
      toast.success("Password changed");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Password change failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ changingPassword: false });
    }
  },

  logout: async () => {
    set({ logoutLoading: true });
    try {
      await axiosInstance.post("/users/logout");
      set({ me: null });
      toast.success("Logged out");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Logout failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ logoutLoading: false });
    }
  },

  // ---------- ORDERS ACTIONS ----------
  fetchOrders: async () => {
    set({ ordersLoading: true, ordersError: null });
    try {
      const { data } = await axiosInstance.get("/orders/get-all");
      set({ orders: Array.isArray(data?.data) ? data.data : [] });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ ordersError: msg });
      toast.error(`Failed to fetch orders: ${msg}`);
    } finally {
      set({ ordersLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    if (!id) return;
    set({ orderLoading: true, orderError: null });
    try {
      const { data } = await axiosInstance.get(`/orders/${id}`);
      set({ order: data?.data || null });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ orderError: msg });
      toast.error(`Failed to fetch order: ${msg}`);
    } finally {
      set({ orderLoading: false });
    }
  },

  cancelOrder: async (id) => {
    try {
      await axiosInstance.post(`/orders/cancel-order/${id}`);
      set({
        orders: get().orders.map((o) =>
          String(o._id) === String(id) ? { ...o, status: "cancelled" } : o
        ),
      });
      toast.success("Order cancelled");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Cancel failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },

  returnOrder: async (id, reason = "") => {
    try {
      await axiosInstance.post(`/orders/return-order/${id}`, { reason });
      set({
        orders: get().orders.map((o) =>
          String(o._id) === String(id)
            ? { ...o, returnStatus: "requested", returnReason: reason }
            : o
        ),
      });
      toast.success("Return requested");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Return request failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },

  // ---------- WISHLIST ACTIONS ----------
  fetchWishlist: async () => {
    set({ wishlistLoading: true, wishlistError: null });
    try {
      const { data } = await axiosInstance.get("/wishlist");
      const products = data?.data?.products || [];
      set({ wishlist: products });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ wishlistError: msg });
      toast.error(`Failed to load wishlist: ${msg}`);
    } finally {
      set({ wishlistLoading: false });
    }
  },

  addToWishlist: async (productId) => {
    try {
      await axiosInstance.post("/wishlist/add", { productId });
      const exists = get().wishlist.some(
        (p) => String(p._id || p) === String(productId)
      );
      if (!exists) {
        set({ wishlist: [...get().wishlist, { _id: productId }] });
      }
      toast.success("Added to wishlist");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Add to wishlist failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      await axiosInstance.delete("/wishlist/delete", { data: { productId } });
      set({
        wishlist: get().wishlist.filter(
          (p) => String(p._id || p) !== String(productId)
        ),
      });
      toast.success("Removed from wishlist");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Remove from wishlist failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },

  clearWishlist: async () => {
    try {
      await axiosInstance.delete("/wishlist/clear");
      set({ wishlist: [] });
      toast.success("Wishlist cleared");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Clear wishlist failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },
}));
