import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useReportStore = create((set) => ({
  customerReports: [],
  orderReports: [],
  paymentReports: [],
  loading: false,
  error: null,

  fetchCustomerReports: async (from, to) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reports/customers", {
        params: { from, to },
      });
      set({ customerReports: res.data?.data || [] });
    } catch (err) {
      toast.error("Failed to fetch customer reports");
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderReports: async (from, to) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reports/orders", {
        params: { from, to },
      });
      set({ orderReports: res.data?.data || [] });
    } catch (err) {
      toast.error("Failed to fetch order reports");
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  fetchPaymentReports: async (from, to) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/reports/payments", {
        params: { from, to },
      });
      set({ paymentReports: res.data?.data || [] });
    } catch (err) {
      toast.error("Failed to fetch payment reports");
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },
}));
