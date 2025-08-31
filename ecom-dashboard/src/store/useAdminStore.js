import { create } from "zustand";
import axiosInstance from "../utils/api.js";
import toast from "react-hot-toast";

export  const useAuthStore = create((set, get) => ({
  authUser: null,
  adminProfile: null,
  isAuthCheck: true,

  // helper: load admin profile for admins
  loadAdminProfile: async () => {
    const { authUser } = get();
    if (!authUser) return null;
    if (["SUPER_ADMIN","ADMIN","SUB_ADMIN"].includes(authUser.role) === false) return null;
    try {
      const res = await axiosInstance.get("/admins/me/profile");
      const profile = res.data?.data;
      set({ adminProfile: profile || null });
      return profile;
    } catch {
      set({ adminProfile: null });
      return null;
    }
  },

  // permission checker
  can: (module, right = "VIEW") => {
    const { authUser, adminProfile } = get();
    if (!authUser) return false;
    if (authUser.role === "SUPER_ADMIN") return true;
    if (!adminProfile || !Array.isArray(adminProfile.permissions)) return false;
    const m = String(module).toUpperCase();
    const r = String(right).toUpperCase();
    return adminProfile.permissions.some(p => p.module === m && (p.rights || []).map(x => String(x).toUpperCase()).includes(r));
  },

  checkAuth: async () => {
    set({ isAuthCheck: true });
    try {
      const res = await axiosInstance.get("/users/current-user");
      const user = res.data?.data;
      if (!user || ["SUPER_ADMIN","ADMIN","SUB_ADMIN"].includes(user.role) === false) {
        set({ authUser: null, adminProfile: null });
        return;
      }
      set({ authUser: user });
      await get().loadAdminProfile();
    } catch (e) {
      set({ authUser: null, adminProfile: null });
    } finally {
      set({ isAuthCheck: false });
    }
  },

  signin: async (data) => {
    set({ isSignIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);
      let user = res.data?.data?.user ?? res.data?.user;

      // If role missing in login response, fetch current-user
      if (!user || !user.role) {
        try {
          const me = await axiosInstance.get("/users/current-user");
          user = me.data?.data || user;
        } catch {}
      }

      if (!user) throw new Error("No user data in login response");

      if (["SUPER_ADMIN","ADMIN","SUB_ADMIN"].includes(user.role) === false) {
        await axiosInstance.post("/users/logout").catch(() => {});
        set({ authUser: null, adminProfile: null });
        toast.error("Customers are not allowed to access admin dashboard");
        throw new Error("CUSTOMER cannot access admin dashboard");
      }

      set({ authUser: user });
      await get().loadAdminProfile();
      toast.success(res.data.message || "Signed in successfully");
      return user;
    } catch (error) {
      console.error("❌ Error during sign in:", error);
      toast.error(
        error.response?.data?.message || error.message || "Error signing in"
      );
      throw error;
    } finally {
      set({ isSignIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/users/logout");
      set({ authUser: null, adminProfile: null });
      toast.success("Logout successful");
    } catch (error) {
      console.error("❌ Error logging out:", error);
      toast.error("Error logging out");
    }
  },
}));
