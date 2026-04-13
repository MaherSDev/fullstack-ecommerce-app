import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Products"],
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APi_URL }),
  endpoints: (build) => ({
    getDashboardProducts: build.query({
      query: (arg) => {
        const { page = 1 } = arg;
        return {
          url: `products?pagination[page]=${page}&pagination[pageSize]=7`,
          params: {
            populate: ["categories"],
          },
        };
      },
    }),
  }),
});

export const { useGetDashboardProductsQuery } = apiSlice;
