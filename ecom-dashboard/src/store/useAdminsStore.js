import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useAdminsStore = create((set, get) => ({
  admins: [],
  pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  isLoading: false,
  isSaving: false,

  // Fetch paginated admins
  fetchAdmins: async (params = {}) => {
    const { page = 1, limit = 10, q = "", role = "", isActive } = params;
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admins", {
        params: {
          page,
          limit,
          q: q || undefined,
          role: role || undefined,
          isActive: typeof isActive === "boolean" ? String(isActive) : undefined,
        },
      });
      const data = res.data?.data;
      set({ admins: data?.admins || [], pagination: data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 } });
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      toast.error(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      set({ isLoading: false });
    }
  },

  // Get one admin by id
  getAdmin: async (id) => {
    try {
      const res = await axiosInstance.get(`/admins/${id}`);
      return res.data?.data;
    } catch (err) {
      console.error("Failed to get admin:", err);
      toast.error(err.response?.data?.message || "Failed to get admin");
      throw err;
    }
  },

  // Create admin
  createAdmin: async (payload) => {
    set({ isSaving: true });
    try {
      const res = await axiosInstance.post("/admins", payload);
      toast.success(res.data?.message || "Admin created");
      return res.data?.data;
    } catch (err) {
      console.error("Failed to create admin:", err);
      toast.error(err.response?.data?.message || "Failed to create admin");
      throw err;
    } finally {
      set({ isSaving: false });
    }
  },

  // Update admin
  updateAdmin: async (id, payload) => {
    set({ isSaving: true });
    try {
      const res = await axiosInstance.patch(`/admins/${id}`, payload);
      toast.success(res.data?.message || "Admin updated");
      return res.data?.data;
    } catch (err) {
      console.error("Failed to update admin:", err);
      toast.error(err.response?.data?.message || "Failed to update admin");
      throw err;
    } finally {
      set({ isSaving: false });
    }
  },

  // Toggle admin activation
  toggleAdmin: async (id) => {
    try {
      const res = await axiosInstance.patch(`/admins/${id}/toggle`);
      toast.success(res.data?.message || "Toggled status");
      return res.data?.data;
    } catch (err) {
      console.error("Failed to toggle status:", err);
      toast.error(err.response?.data?.message || "Failed to toggle status");
      throw err;
    }
  },

  // Delete admin
  deleteAdmin: async (id) => {
    try {
      const res = await axiosInstance.delete(`/admins/${id}`);
      toast.success(res.data?.message || "Admin deleted");
      return true;
    } catch (err) {
      console.error("Failed to delete admin:", err);
      toast.error(err.response?.data?.message || "Failed to delete admin");
      throw err;
    }
  },
}));
