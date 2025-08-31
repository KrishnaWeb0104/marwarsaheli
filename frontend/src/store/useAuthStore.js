import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/utils/api.js";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore"; // NEW

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isAuthCheck: false,
      isSignIn: false,
      isSignUp: false,
      isUpdating: false,

      // 1) Check current user (on app mount)
      checkAuth: async () => {
        // keep this lightweight & idempotent
        set({ isAuthCheck: true });
        try {
          const res = await axiosInstance.get("/users/current-user");
          const user = res.data?.data;
          set({ authUser: user });
        } catch {
          set({ authUser: null });
        } finally {
          set({ isAuthCheck: false });
        }
      },

      // 2) Signup
      signup: async (
        payload /* { fullName, userName, email, password, avatar?: File } */
      ) => {
        set({ isSignUp: true });
        try {
          let dataToSend;
          let headers = {};

          if (payload.avatar instanceof File) {
            const form = new FormData();
            Object.entries(payload).forEach(([k, v]) => form.append(k, v));
            dataToSend = form;
            headers["Content-Type"] = "multipart/form-data";
          } else {
            dataToSend = payload;
          }

          const res = await axiosInstance.post("/users/register", dataToSend, {
            headers,
          });
          toast.success(
            res.data?.message || "Registered! Please verify your email."
          );
          // Optional: auto-login after signup? better UX to require email verify first.
          return res.data?.data;
        } catch (e) {
          toast.error(e.response?.data?.message || "Signup failed");
          throw e;
        } finally {
          set({ isSignUp: false });
        }
      },

      // 3) Signin
      signin: async ({ email, password }) => {
        set({ isSignIn: true });
        try {
          const res = await axiosInstance.post("/users/login", {
            email,
            password,
          });
          const user = res.data?.data?.user ?? res.data?.user;
          if (!user) throw new Error("No user object returned");
          set({ authUser: user });
          toast.success(res.data?.message || "Signed in successfully");
          return user;
        } catch (e) {
          toast.error(e.response?.data?.message || "Login failed");
          throw e;
        } finally {
          set({ isSignIn: false });
        }
      },

      // 4) Logout
      logout: async () => {
        try {
          await axiosInstance.post("/users/logout");
        } catch {
          // ignore network flakiness on logout
        } finally {
          set({ authUser: null });
          // NEW: clear cart UI immediately on logout
          try {
            useCartStore.getState().resetCart();
          } catch {}
          toast.success("Logged out");
        }
      },

      // 5) Resend verification
      resendVerification: async () => {
        try {
          const res = await axiosInstance.post(
            "/users/resend-email-verification"
          );
          toast.success(res.data?.message || "Verification email sent");
        } catch (e) {
          toast.error(e.response?.data?.message || "Failed to send email");
          throw e;
        }
      },

      // 6) Forgot password request (public)
      forgotPassword: async (email) => {
        try {
          const res = await axiosInstance.post("/users/forgot-password", {
            email,
          });
          toast.success(res.data?.message || "Password reset mail sent");
        } catch (e) {
          toast.error(e.response?.data?.message || "Failed to send reset mail");
          throw e;
        }
      },

      // 7) Reset password (public)
      resetPassword: async ({ resetToken, newPassword }) => {
        try {
          const res = await axiosInstance.post(
            `/users/reset-password/${resetToken}`,
            { newPassword }
          );
          toast.success(res.data?.message || "Password reset successfully");
        } catch (e) {
          toast.error(e.response?.data?.message || "Failed to reset password");
          throw e;
        }
      },

      // 8) Change current password (authed)
      changePassword: async ({ oldPassword, newPassword }) => {
        try {
          const res = await axiosInstance.post("/users/change-password", {
            oldPassword,
            newPassword,
          });
          toast.success(res.data?.message || "Password changed");
        } catch (e) {
          toast.error(e.response?.data?.message || "Failed to change password");
          throw e;
        }
      },

      // 9) Update account (name/email/phone/address/role)
      updateAccount: async (payload) => {
        set({ isUpdating: true });
        try {
          const res = await axiosInstance.patch(
            "/users/update-account",
            payload
          );
          const updated = res.data?.data;
          // keep local user in sync
          set({ authUser: updated });
          toast.success(res.data?.message || "Account updated");
          return updated;
        } catch (e) {
          toast.error(e.response?.data?.message || "Failed to update account");
          throw e;
        } finally {
          set({ isUpdating: false });
        }
      },

      // 10) Update avatar (multipart)
      updateAvatar: async (file) => {
        if (!(file instanceof File)) throw new Error("Avatar must be a File");
        const form = new FormData();
        form.append("avatar", file);
        try {
          const res = await axiosInstance.patch("/users/avatar", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const updated = res.data?.data;
          set({ authUser: updated });
          toast.success(res.data?.message || "Avatar updated");
          return updated;
        } catch (e) {
          toast.error(e.response?.data?.message || "Failed to update avatar");
          throw e;
        }
      },

      // 11) Admin: list users (permission-based)
      getAllUsers: async ({ page = 1, limit = 10, q = "", role } = {}) => {
        const params = { page, limit };
        if (q) params.q = q;
        if (role) params.role = role;
        try {
          const res = await axiosInstance.get("/users", { params });
          return res.data?.data; // { users, pagination }
        } catch (e) {
          toast.error(e.response?.data?.message || "Failed to fetch users");
          throw e;
        }
      },
    }),
    {
      name: "auth-store",
      // Persist only the minimal surface. We keep server as source of truth.
      partialize: (state) => ({ authUser: state.authUser }),
    }
  )
);
