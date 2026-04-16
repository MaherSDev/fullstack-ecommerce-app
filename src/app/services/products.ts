import CookieService from "@/services/CookieService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ProductsApiSlice = createApi({
  reducerPath: "api",
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
} = ProductsApiSlice;
