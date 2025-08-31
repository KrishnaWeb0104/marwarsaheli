// src/store/useProductStore.js
import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";
import products from "@/data/product";

export const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  isLoading: false,
  pagination: null,
  error: null,
  filters: {
    search: "",
    category: "",
    brand: "",
    page: 1,
    limit: 10,
  },

  // Fetch list
  fetchProducts: async (customFilters = {}) => {
    const filters = { ...get().filters, ...customFilters };
    console.log("📡 API call to /products with filters:", filters);
    set({ isLoading: true, filters, error: null });

    try {
      const res = await axiosInstance.get("/products", { params: filters });
      console.log("📦 API response:", res.data);
      const { products, pagination } = res.data?.data || {};
      console.log(
        "🍃 Products returned:",
        products?.map((p) => ({ name: p.name, category: p.category }))
      );
      set({ products: products || [], pagination: pagination || null });
    } catch (err) {
      console.error("❌ API error:", err);
      const msg = err?.response?.data?.message || "Failed to load products";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch single
  getProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      set({ product: res.data?.data || null });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load product";
      set({ error: msg, product: null });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  clearProduct: () => set({ product: null, error: null }),
}));
