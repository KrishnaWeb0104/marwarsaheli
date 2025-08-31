// src/store/useReviewStore.js
import { create } from "zustand";
import axiosInstance from "@/utils/api.js";
import toast from "react-hot-toast"; // NEW

// Compute average, total, and breakdown
function computeStats(reviews = []) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  for (const r of reviews) {
    const rt = Number(r?.rating) || 0;
    if (rt >= 1 && rt <= 5) {
      counts[rt] += 1;
      sum += rt;
    }
  }

  const total = reviews.length;
  const average = total ? Number((sum / total).toFixed(2)) : 0;

  return {
    averageRating: average,
    totalReviews: total,
    ratingBreakdown: counts,
  };
}

// Normalize various API shapes to an array of reviews
function extractList(payload) {
  const d = payload;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data?.reviews)) return d.data.reviews;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.reviews)) return d.reviews;
  return [];
}

export const useReviewStore = create((set, get) => ({
  // State
  productId: null,
  userId: null,
  reviews: [],
  pagination: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  readingOne: false,
  currentReview: null,
  error: null,

  // Simple cache (non-paginated product lists)
  _cache: new Map(), // key: `product:${productId}` => { reviews, ts }

  // Selectors
  averageRating: 0,
  totalReviews: 0,
  ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },

  // Internal helpers
  _recompute: () => {
    const { reviews } = get();
    const stats = computeStats(reviews);
    set({
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
      ratingBreakdown: stats.ratingBreakdown,
    });
  },

  setReviews: (arr = [], pagination = null) => {
    set({
      reviews: Array.isArray(arr) ? arr : [],
      pagination: pagination || null,
    });
    get()._recompute();
  },

  clearReviews: () => {
    set({
      productId: null,
      userId: null,
      reviews: [],
      pagination: null,
      error: null,
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
  },

  // Fetch reviews by product (non-paginated by default)
  // Routes:
  // - GET /reviews/product/:productId (array)
  // - GET /reviews?productId=&page=&limit= (paginated)
  fetchReviews: async (productId, { force = false, page, limit } = {}) => {
    if (!productId) return;
    const cacheKey = `product:${productId}`;
    const wantsPagination = Number.isFinite(page) || Number.isFinite(limit);

    if (!wantsPagination && !force && get()._cache.has(cacheKey)) {
      const cached = get()._cache.get(cacheKey);
      set({
        productId,
        userId: null,
        reviews: cached.reviews,
        pagination: null,
        error: null,
        loading: false,
      });
      get()._recompute();
      return;
    }

    set({ loading: true, error: null, productId, userId: null });
    try {
      let data;
      if (wantsPagination) {
        const resp = await axiosInstance.get("/reviews", {
          params: {
            productId,
            page: Number.isFinite(page) ? page : 1,
            limit: Number.isFinite(limit) ? limit : 10,
          },
        });
        data = resp.data;
        const list = extractList(data);
        const pagination = data?.data?.pagination || data?.pagination || null;
        get().setReviews(list, pagination);
      } else {
        const resp = await axiosInstance.get(`/reviews/product/${productId}`);
        data = resp.data;
        const list = extractList(data);
        get().setReviews(list, null);
        // cache non-paginated
        const cache = get()._cache;
        cache.set(cacheKey, { reviews: list, ts: Date.now() });
        set({ _cache: cache });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e.message; // NEW
      set({ error: msg });
      toast.error(`Failed to load reviews: ${msg}`); // NEW
    } finally {
      set({ loading: false });
    }
  },

  // Fetch reviews by user
  // GET /reviews/user/:userId
  fetchReviewsByUser: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null, userId, productId: null });
    try {
      const { data } = await axiosInstance.get(`/reviews/user/${userId}`);
      const list = extractList(data);
      get().setReviews(list, null);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message; // NEW
      set({ error: msg, reviews: [] });
      get()._recompute();
      toast.error(`Failed to load user's reviews: ${msg}`); // NEW
    } finally {
      set({ loading: false });
    }
  },

  // Admin/general list with optional filters (productId/userId/page/limit)
  // GET /reviews?productId=&userId=&page=&limit=
  fetchAllReviews: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/reviews", { params });
      const list = extractList(data);
      const pagination = data?.data?.pagination || data?.pagination || null;
      get().setReviews(list, pagination);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message; // NEW
      set({ error: msg, reviews: [] });
      get()._recompute();
      toast.error(`Failed to load reviews: ${msg}`); // NEW
    } finally {
      set({ loading: false });
    }
  },

  // Get single review by id
  // GET /reviews/:id
  getReviewById: async (id) => {
    if (!id) return null;
    set({ readingOne: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/reviews/${id}`);
      const review = data?.data || data || null;
      set({ currentReview: review });
      return review;
    } catch (e) {
      const msg = e?.response?.data?.message || e.message; // NEW
      set({ error: msg });
      toast.error(`Failed to load review: ${msg}`); // NEW
      return null;
    } finally {
      set({ readingOne: false });
    }
  },

  // Create review
  // POST /reviews  body: { productId, rating, comment }
  createReview: async ({ productId, rating, comment }) => {
    if (!productId || rating == null) {
      return { ok: false, message: "productId and rating are required" };
    }

    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      _id: tempId,
      productId,
      rating: Number(rating),
      comment: comment?.trim() || "",
      userId: { name: "You" },
      createdAt: new Date().toISOString(),
    };

    set({ creating: true });

    // optimistic add
    const prev = get().reviews;
    const next = [optimistic, ...prev];
    set({ reviews: next });
    get()._recompute();

    try {
      const { data } = await axiosInstance.post(`/reviews`, {
        productId,
        rating,
        comment,
      });
      const saved = data?.data;
      if (saved?._id) {
        // replace temp with saved
        const merged = get().reviews.map((r) => (r._id === tempId ? saved : r));
        set({ reviews: merged });
        get()._recompute();
        // refresh product cache (non-paginated key)
        const cacheKey = `product:${productId}`;
        const cache = get()._cache;
        if (cache.has(cacheKey)) {
          cache.set(cacheKey, { reviews: merged, ts: Date.now() });
          set({ _cache: cache });
        }
      } else {
        // fallback to refetch if API didn't send the saved doc
        await get().fetchReviews(productId, { force: true });
      }
      toast.success("Review submitted"); // NEW
      return { ok: true };
    } catch (e) {
      // rollback
      set({ reviews: prev });
      get()._recompute();
      const msg = e?.response?.data?.message || e.message; // NEW
      toast.error(`Failed to submit review: ${msg}`); // NEW
      return { ok: false, message: msg };
    } finally {
      set({ creating: false });
    }
  },

  // Update review (owner/admin)
  // PATCH /reviews/:id  body: { rating?, comment? }
  updateReview: async (id, patch = {}) => {
    if (!id) return { ok: false, message: "id is required" };
    set({ updating: true });
    try {
      const { data } = await axiosInstance.patch(`/reviews/${id}`, patch);
      const updated = data?.data;

      // sync list if present
      if (updated?._id) {
        const list = get().reviews.map((r) => (r._id === id ? updated : r));
        set({ reviews: list });
        get()._recompute();

        // update cache for product lists if the same product is currently loaded
        const pid = updated.productId || get().productId;
        if (pid) {
          const cacheKey = `product:${pid}`;
          const cache = get()._cache;
          if (cache.has(cacheKey)) {
            cache.set(cacheKey, { reviews: list, ts: Date.now() });
            set({ _cache: cache });
          }
        }
      }

      // update currentReview if it matches
      if (get().currentReview?._id === id) {
        set({ currentReview: updated });
      }

      toast.success("Review updated"); // NEW
      return { ok: true, data: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message; // NEW
      toast.error(`Failed to update review: ${msg}`); // NEW
      return { ok: false, message: msg };
    } finally {
      set({ updating: false });
    }
  },

  // Delete review (owner/admin)
  // DELETE /reviews/:id
  deleteReview: async (id) => {
    if (!id) return { ok: false, message: "id is required" };
    set({ deleting: true });
    try {
      await axiosInstance.delete(`/reviews/${id}`);

      // remove from list if present
      const list = get().reviews.filter((r) => r._id !== id);
      set({ reviews: list });
      get()._recompute();

      // update cache for current product
      const pid = get().productId;
      if (pid) {
        const cacheKey = `product:${pid}`;
        const cache = get()._cache;
        if (cache.has(cacheKey)) {
          cache.set(cacheKey, { reviews: list, ts: Date.now() });
          set({ _cache: cache });
        }
      }

      // clear currentReview if it was the deleted one
      if (get().currentReview?._id === id) set({ currentReview: null });

      toast.success("Review deleted"); // NEW
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message; // NEW
      toast.error(`Failed to delete review: ${msg}`); // NEW
      return { ok: false, message: msg };
    } finally {
      set({ deleting: false });
    }
  },
}));
