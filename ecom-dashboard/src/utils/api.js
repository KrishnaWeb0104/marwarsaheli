import axios from "axios";
import toast from "react-hot-toast";

// Global 2s de-dupe for identical toasts so the same message
// (e.g., from an interceptor and a store) doesn't appear twice
const __toastOriginal = {
  success: toast.success.bind(toast),
  error: toast.error.bind(toast),
};
let __lastToast = { type: "", msg: "", ts: 0 };
const __dedup = (type, msg, options) => {
  const now = Date.now();
  const text = String(msg ?? "");
  if (
    __lastToast.type === type &&
    __lastToast.msg === text &&
    now - __lastToast.ts < 2000
  ) {
    return; // skip duplicate within 2s window
  }
  __lastToast = { type, msg: text, ts: now };
  return __toastOriginal[type](text, options);
};
toast.success = (msg, opts) => __dedup("success", msg, opts);
toast.error = (msg, opts) => __dedup("error", msg, opts);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Show a toast for every API call.
// You can disable per-request by passing { showSuccessToast:false, showErrorToast:false } in config.
axiosInstance.interceptors.response.use(
  (response) => {
    const cfg = response.config || {};
    if (cfg.showSuccessToast !== false) {
      const msg = response.data?.message;
      if (msg) toast.success(msg);
    }
    return response;
  },
  (error) => {
    const cfg = error?.config || {};
    if (cfg?.showErrorToast !== false) {
      const msg = error?.response?.data?.message || error.message || "Request failed";
      toast.error(msg);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
