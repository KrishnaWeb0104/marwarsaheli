import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  category: null,
  isLoading: false,
  pagination: null,

  // for dropdown (lightweight list + cache)
  dropdownCategories: [],
  dropdownFetchedAt: null,

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

  // 🔽 Lightweight fetch for dropdown (cached ~10 mins)
  fetchDropdownCategories: async () => {
    const { dropdownFetchedAt } = get();
    const now = Date.now();
    const TEN_MIN = 10 * 60 * 1000;

    // cache hit
    if (dropdownFetchedAt && now - dropdownFetchedAt < TEN_MIN) return;

    try {
      // tweak params to what your API supports (status, limit, fields)
      const res = await axiosInstance.get("/categories", {
        params: { page: 1, limit: 100, status: "active" },
      });

      // normalize: expect { _id, name, slug } — adjust if your API differs
      const list = (res?.data?.data?.categories ?? []).map((c) => ({
        _id: c._id,
        name: c.name,
        slug: c.slug,
      }));

      set({ dropdownCategories: list, dropdownFetchedAt: now });
    } catch (err) {
      console.error("❌ Error fetching dropdown categories:", err);
      toast.error(err?.response?.data?.message || "Failed to load categories");
    }
  },
}));
