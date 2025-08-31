import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useCategoryStore = create((set) => ({
  categories: [],
  category: null,
  isLoading: false,
  pagination: null,

  // 🔍 Fetch all categories with pagination + search
  fetchCategories: async (params = {}) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/categories", { params });
      const { categories, pagination } = res.data?.data;
      set({ categories, pagination });
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
      toast.error(err?.response?.data?.message || "Failed to load categories");
    } finally {
      set({ isLoading: false });
    }
  },

  // 📦 Get single category by ID
  getCategoryById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/categories/${id}`);
      set({ category: res.data?.data });
    } catch (err) {
      console.error("❌ Error getting category:", err);
      toast.error(err?.response?.data?.message || "Failed to load category");
    } finally {
      set({ isLoading: false });
    }
  },

  // ➕ Add new category
  addCategory: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(
        "/categories/add-category",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Category added successfully");
      return res.data?.data;
    } catch (err) {
      console.error("❌ Error adding category:", err);
      toast.error(err?.response?.data?.message || "Failed to add category");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ✏️ Update category
  updateCategory: async (id, formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(
        `/categories/update-category/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Category updated successfully");
      return res.data?.data;
    } catch (err) {
      console.error("❌ Error updating category:", err);
      toast.error(err?.response?.data?.message || "Failed to update category");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // 🗑️ Delete category
  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/categories/delete-category/${id}`);
      toast.success("Category deleted");
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== id),
      }));
    } catch (err) {
      console.error("❌ Error deleting category:", err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
    } finally {
      set({ isLoading: false });
    }
  },
}));
