import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useBrandStore = create((set) => ({
  brands: [],
  brand: null,
  isLoading: false,
  pagination: null,

  // 🚀 Fetch all brands
  fetchBrands: async (params = {}) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/brands/get-brands", { params });
      const { brands, pagination } = res.data?.data;
      set({ brands, pagination });
    } catch (err) {
      console.error("❌ Error fetching brands:", err);
      toast.error(err?.response?.data?.message || "Failed to load brands");
    } finally {
      set({ isLoading: false });
    }
  },

  // 🔍 Get single brand
  getBrandById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/brands/get-brand/${id}`);
      set({ brand: res.data?.data });
    } catch (err) {
      console.error("❌ Error fetching brand:", err);
      toast.error(err?.response?.data?.message || "Failed to load brand");
    } finally {
      set({ isLoading: false });
    }
  },

  // ➕ Add brand
  addBrand: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/brands/add-brand", data);
      toast.success("Brand added successfully");
      return res.data?.data;
    } catch (err) {
      console.error("❌ Error adding brand:", err);
      toast.error(err?.response?.data?.message || "Failed to add brand");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ✏️ Update brand
  updateBrand: async (id, data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/brands/update-brand/${id}`, data);
      toast.success("Brand updated");
      return res.data?.data;
    } catch (err) {
      console.error("❌ Error updating brand:", err);
      toast.error(err?.response?.data?.message || "Failed to update brand");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // 🗑️ Delete brand
  deleteBrand: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/brands/delete-brand/${id}`);
      toast.success("Brand deleted");
      set((state) => ({
        brands: state.brands.filter((b) => b._id !== id),
      }));
    } catch (err) {
      console.error("❌ Error deleting brand:", err);
      toast.error(err?.response?.data?.message || "Failed to delete brand");
    } finally {
      set({ isLoading: false });
    }
  },
}));
