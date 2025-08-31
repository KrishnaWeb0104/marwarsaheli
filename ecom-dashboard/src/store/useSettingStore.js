import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useSettingStore = create((set) => ({
  isLoading: false,
  userData: null,

  // ✅ Fetch current user info
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/users/current-user");
      set({ userData: res.data?.data });
    } catch (err) {
      console.error("❌ Fetch User Error:", err);
      toast.error("Failed to fetch user details");
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Update profile fields
  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch("/users/update-account", data);
      toast.success("Profile updated successfully!");
      set({ userData: res.data?.data });
    } catch (err) {
      console.error("❌ Update Profile Error:", err);
      toast.error(err?.response?.data?.message || "Profile update failed");
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Change password (using oldPassword → newPassword)
  changePassword: async ({ currentPassword, newPassword }) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/users/change-password", {
        oldPassword: currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
    } catch (err) {
      console.error("❌ Change Password Error:", err);
      toast.error(err?.response?.data?.message || "Password change failed");
    } finally {
      set({ isLoading: false });
    }
  },
}));
