// src/store/useCartStore.js
import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast"; // NEW

export const useCartStore = create((set, get) => ({
  cart: { items: [] },
  isFetching: false,
  mutatingIds: new Set(),
  error: null,

  // Always returns a POPULATED cart (server must populate product)
  fetchCart: async () => {
    try {
      set({ isFetching: true, error: null });
      const { data } = await axiosInstance.get("/cart");
      set({ cart: data.data || { items: [] }, isFetching: false });
      return data.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg, isFetching: false });
      toast.error(`Failed to load cart: ${msg}`); // NEW
      throw err;
    }
  },

  // Prefer productId API body -> server handles upsert/update
  addToCart: async (productId, quantity = 1) => {
    const lock = new Set(get().mutatingIds);
    lock.add(String(productId));
    set({ mutatingIds: lock, error: null });
    try {
      await axiosInstance.post("/cart/add-cart", { productId, quantity });
      const res = await get().fetchCart(); // Always re-fetch to ensure populated product fields
      toast.success("Added to cart"); // NEW
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      toast.error(`Failed to add to cart: ${msg}`); // NEW
      throw err;
    } finally {
      const free = new Set(get().mutatingIds);
      free.delete(String(productId));
      set({ mutatingIds: free });
    }
  },

  // If your backend expects URL param, switch to the comment below
  updateCartItem: async (productId, quantity, userID) => {
    const pid = String(productId);
    const lock = new Set(get().mutatingIds);
    lock.add(pid);
    set({ mutatingIds: lock, error: null });
    try {
      // BODY variant (recommended; your controller can read productId + quantity)
      await axiosInstance.patch(`/cart/update-cart/${userID}`, {
        productId,
        quantity,
      });

      // URL variant (uncomment if your API is /cart/update-cart/:productId)
      // await axiosInstance.patch(`/cart/update-cart/${productId}`, { quantity });

      const res = await get().fetchCart();
      toast.success("Cart updated"); // NEW
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      toast.error(`Failed to update cart: ${msg}`); // NEW
      throw err;
    } finally {
      const free = new Set(get().mutatingIds);
      free.delete(pid);
      set({ mutatingIds: free });
    }
  },

  removeFromCart: async (productId) => {
    const pid = String(productId);
    const lock = new Set(get().mutatingIds);
    lock.add(pid);
    set({ mutatingIds: lock, error: null });
    try {
      await axiosInstance.delete(`/cart/delete-cart/${productId}`);
      const res = await get().fetchCart();
      toast.success("Item removed from cart"); // NEW
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      toast.error(`Failed to remove item: ${msg}`); // NEW
      throw err;
    } finally {
      const free = new Set(get().mutatingIds);
      free.delete(pid);
      set({ mutatingIds: free });
    }
  },

  clearCart: async () => {
    set({ error: null, isFetching: true });
    try {
      await axiosInstance.delete("/cart/clear-cart");
      set({ cart: { items: [] }, isFetching: false });
      toast.success("Cart cleared"); // NEW
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg, isFetching: false });
      toast.error(`Failed to clear cart: ${msg}`); // NEW
      throw err;
    }
  },

  // reset locally without hitting backend (used on logout)
  resetCart: () => {
    set({
      cart: { items: [] },
      isFetching: false,
      mutatingIds: new Set(),
      error: null,
    });
    // Intentionally no toast here to avoid noise on logout
  },
}));
