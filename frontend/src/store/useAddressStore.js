// src/store/useAddressStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/utils/api.js";
import toast from "react-hot-toast";

export const useAddressStore = create(
  persist(
    (set, get) => ({
      // ----- state
      addresses: [],
      address: null, // single address (view/edit)
      selectedAddressId: null,

      isLoading: false,
      creating: false,
      updating: false,
      deleting: false,

      // ----- helpers
      setSelectedAddress: (id) => set({ selectedAddressId: id }),
      clearAddress: () => set({ address: null }),

      // ----- CRUD
      // list all (for current authed user)
      fetchAddresses: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get("/address/get-addresses");
          const data = res.data?.data || [];
          set({ addresses: data, isLoading: false });

          // maintain selection if still valid
          const { selectedAddressId } = get();
          if (
            selectedAddressId &&
            !data.some((a) => String(a._id) === String(selectedAddressId))
          ) {
            set({ selectedAddressId: null });
          }
          return data;
        } catch (e) {
          set({ isLoading: false });
          toast.error(e.response?.data?.message || "Failed to load addresses");
          throw e;
        }
      },

      // get one
      getAddressById: async (id) => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get(`/address/get-address/${id}`);
          const data = res.data?.data;
          set({ address: data, isLoading: false });
          return data;
        } catch (e) {
          set({ isLoading: false });
          toast.error(e.response?.data?.message || "Failed to fetch address");
          throw e;
        }
      },

      // create
      createAddress: async (
        payload /* { street, city, state, zipCode, country } */
      ) => {
        set({ creating: true });
        try {
          const res = await axiosInstance.post(
            "/address/create-address",
            payload
          );
          const created = res.data?.data;
          // optimistic add to top
          set((s) => ({
            addresses: [created, ...s.addresses],
            creating: false,
          }));
          toast.success(res.data?.message || "Address added");
          return created;
        } catch (e) {
          set({ creating: false });
          toast.error(e.response?.data?.message || "Failed to add address");
          throw e;
        }
      },

      // update
      updateAddress: async (id, payload) => {
        set({ updating: true });
        try {
          const res = await axiosInstance.put(
            `/address/update-address/${id}`,
            payload
          );
          const updated = res.data?.data;

          set((s) => ({
            addresses: s.addresses.map((a) =>
              String(a._id) === String(id) ? updated : a
            ),
            address:
              String(s.address?._id) === String(id) ? updated : s.address,
            updating: false,
          }));
          toast.success(res.data?.message || "Address updated");
          return updated;
        } catch (e) {
          set({ updating: false });
          toast.error(e.response?.data?.message || "Failed to update address");
          throw e;
        }
      },

      // delete
      deleteAddress: async (id) => {
        set({ deleting: true });
        try {
          const res = await axiosInstance.delete(
            `/address/delete-address/${id}`
          );
          set((s) => ({
            addresses: s.addresses.filter((a) => String(a._id) !== String(id)),
            address: String(s.address?._id) === String(id) ? null : s.address,
            selectedAddressId:
              String(s.selectedAddressId) === String(id)
                ? null
                : s.selectedAddressId,
            deleting: false,
          }));
          toast.success(res.data?.message || "Address deleted");
          return true;
        } catch (e) {
          set({ deleting: false });
          toast.error(e.response?.data?.message || "Failed to delete address");
          throw e;
        }
      },
    }),
    {
      name: "address-store",
      partialize: (s) => ({
        selectedAddressId: s.selectedAddressId,
      }),
    }
  )
);
