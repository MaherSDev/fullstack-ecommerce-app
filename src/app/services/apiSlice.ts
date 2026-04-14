import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
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
          url: `products`,
          params: {
            "populate[0]": "thumbnail",
            "populate[1]": "categories",
          },
        };
      },
    }),
  }),
});

export const { useGetDashboardProductsQuery } = apiSlice;
