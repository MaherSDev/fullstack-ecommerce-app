import type { IAddress } from "@/interfaces";
import CookieService from "@/services/CookieService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AddressApiSlice = createApi({
  reducerPath: "addressApi",
  tagTypes: ["Address"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APi_URL }),
  endpoints: (build) => ({
    getDashboardAddresses: build.query({
      query: () => {
        return {
          url: `addresses?populate=city&populate=country`,
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      providesTags: ["Address"],
    }),
    getDashboardUserAddresses: build.query({
      query: (id) => {
        return {
          url: `users/${id}?populate=defaultAddress&populate=addresses.city&populate=addresses.country`,
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      providesTags: ["Address"],
    }),
    updateDashboardDefaultAddress: build.mutation({
      query: ({ id, body }) => {
        return {
          url: `users/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },

          body,
        };
      },
      invalidatesTags: ["Address"],
    }),
    updateDashboardAddress: build.mutation({
      query: ({ id, body }) => {
        return {
          url: `addresses/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },

          body: {data: body},
        };
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          AddressApiSlice.util.updateQueryData(
            "getDashboardAddresses",
            { page: 1 },
            (draft) => {
              const address = draft.data.find(
                (address: IAddress) => address.id === id,
              );

              if (address) {
                Object.assign(address, patch.data);
              } else {
                Object.assign(draft, patch);
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Address"],
    }),
    createDashboardAddress: build.mutation({
      query: (data) => {
        return {
          url: `addresses`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
          body: {
            data,
          },
        };
      },
      invalidatesTags: ["Address"],
    }),
    deleteDashboardAddress: build.mutation({
      query: (id) => {
        return {
          url: `addresses/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetDashboardAddressesQuery,
  useGetDashboardUserAddressesQuery,
	useUpdateDashboardDefaultAddressMutation,
  useUpdateDashboardAddressMutation,
  useCreateDashboardAddressMutation,
  useDeleteDashboardAddressMutation,
} = AddressApiSlice;
