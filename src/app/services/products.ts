import type { IProduct } from "@/interfaces";
import CookieService from "@/services/CookieService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ProductsApiSlice = createApi({
  reducerPath: "productApi",
  tagTypes: ["Products"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APi_URL }),
  endpoints: (build) => ({
    getDashboardProducts: build.query({
      query: (arg) => {
        const { page = 1 } = arg;
        return {
          url: `products?pagination[page]=${page}&pagination[pageSize]=10`,
          params: {
            "populate[0]": "thumbnail",
            "populate[1]": "categories",
          },
        };
      },
      providesTags: ["Products"],
    }),
    updateDashboardProducts: build.mutation({
      query: ({ documentId, body }) => {
        return {
          url: `products/${documentId}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },

          body,
        };
      },
      async onQueryStarted(
        { documentId, ...patch },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          ProductsApiSlice.util.updateQueryData(
            "getDashboardProducts",
            { page: 1 },
            (draft) => {
              const product = draft.data.find(
                (p: IProduct) => p.documentId === documentId,
              );

              if (product) {
                Object.assign(product, patch.data);
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
      invalidatesTags: ["Products"],
    }),
    createDashboardProducts: build.mutation({
      query: ({ body }) => {
        return {
          url: `products`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },

          body,
        };
      },
      invalidatesTags: ["Products"],
    }),
    deleteDashboardProducts: build.mutation({
      query: (documentId) => {
        return {
          url: `products/${documentId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        };
      },
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetDashboardProductsQuery,
  useDeleteDashboardProductsMutation,
  useUpdateDashboardProductsMutation,
  useCreateDashboardProductsMutation,
} = ProductsApiSlice;
