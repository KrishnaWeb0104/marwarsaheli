import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  isLoading: false,
  pagination: null,
  filters: {
    search: "",
    category: "",
    brand: "",
    page: 1,
    limit: 10,
  },

  // 🚀 Fetch all products with filters
  fetchProducts: async (customFilters = {}) => {
    const filters = { ...get().filters, ...customFilters };
    set({ isLoading: true, filters });

    try {
      const res = await axiosInstance.get("/products", { params: filters });
      const { products, pagination } = res.data?.data;
      set({ products, pagination });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load products");
    } finally {
      set({ isLoading: false });
    }
  },

  // 🔍 Get a single product
  getProductById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      set({ product: res.data?.data });
    } catch (err) {
      toast.error("Failed to load product");
    } finally {
      set({ isLoading: false });
    }
  },

  // ➕ Add product
  addProduct: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/products/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added");
      return res.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Add failed");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ✏️ Update product
  updateProduct: async (id, formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(
        `/products/update-product/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Product updated");
      return res.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // 🗑️ Delete product
  deleteProduct: async (id) => {
    try {
      await axiosInstance.delete(`/products/delete-product/${id}`);
      toast.success("Product deleted");
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
      }));
    } catch (err) {
      toast.error("Delete failed");
    }
  },
}));
