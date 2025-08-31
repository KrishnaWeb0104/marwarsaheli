import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const usePageStore = create((set, get) => ({
  pages: [],
  currentPage: null,
  loading: false,
  error: null,

  // Get all CMS pages
  fetchPages: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/pages");
      set({ pages: res.data?.data || [] });
    } catch (err) {
      toast.error("Failed to fetch pages");
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  // Create new CMS page
  createPage: async (data) => {
    try {
      const res = await axiosInstance.post("/pages/create-page", data);
      toast.success("Page created!");
      get().fetchPages();
      return res.data?.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create page");
      throw err;
    }
  },

  // Get single page by slug
  fetchPageBySlug: async (slug) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/pages/${slug}`);
      set({ currentPage: res.data?.data });
    } catch (err) {
      toast.error("Failed to fetch page");
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  // Update CMS page
  updatePage: async (slug, data) => {
    try {
      const res = await axiosInstance.put(`/pages/update-page/${slug}`, data);
      toast.success("Page updated!");
      get().fetchPages();
      return res.data?.data;
    } catch (err) {
      toast.error("Failed to update page");
      throw err;
    }
  },

  // Toggle isActive
  togglePageStatus: async (slug) => {
    try {
      await axiosInstance.patch(`/pages/${slug}/toggle`);
      toast.success("Page status updated");
      get().fetchPages();
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  },

  // Delete page
  deletePage: async (slug) => {
    try {
      await axiosInstance.delete(`/pages/${slug}`);
      toast.success("Page deleted");
      set((state) => ({
        pages: state.pages.filter((page) => page.slug !== slug),
      }));
    } catch (err) {
      toast.error("Failed to delete page");
    }
  },
}));
