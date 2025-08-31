import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useUsersStore = create((set, get) => ({
  users: [],
  isLoading: false,
  pagination: null,
  filters: {
    q: "",
    role: "",
    page: 1,
    limit: 10,
  },

  fetchUsers: async (customFilters = {}) => {
    const filters = { ...get().filters, ...customFilters };
    set({ isLoading: true, filters });
    try {
      const res = await axiosInstance.get("/users", { params: filters });
      const { users, pagination } = res.data?.data || {};
      set({ users: users || [], pagination: pagination || null });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isLoading: false });
    }
  },
}));
