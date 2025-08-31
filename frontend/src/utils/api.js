import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Simple lock to prevent multiple parallel refreshes
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // If no response or it’s not 401, just bubble up
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loop on refresh endpoint itself
    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (isRefreshing) {
      // queue the request until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(axiosInstance(original)),
          reject: (err) => reject(err),
        });
      });
    }

    try {
      isRefreshing = true;
      // hit refresh endpoint
      await axiosInstance.post("/users/refresh-token");
      processQueue(null);
      return axiosInstance(original);
    } catch (refreshErr) {
      processQueue(refreshErr);
      // hard logout path — let store handle UI
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
