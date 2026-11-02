import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CartApiSlice = createApi({
  reducerPath: "cartApi",
  tagTypes: ["Cart"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APi_URL }),
  endpoints: (build) => ({
    updateUserCart: build.mutation({
      query: ({ documentId, body }) => {
        return {
          url: `carts/${documentId}`,
          method: "PUT",
          headers: {},
          body: { data: body },
        };
      },
      invalidatesTags: ["Cart"],
    }),
    createCart: build.mutation({
      query: ({ body }) => {
        return {
          url: `carts`,
          method: "POST",
          headers: {},
          body,
        };
      },
      invalidatesTags: ["Cart"],
    }),
    resetUserCart: build.mutation({
      query: (documentId) => {
        return {
          url: `carts/${documentId}?populate=cart_items`,
          method: "PUT",
          headers: {},
          body: { data: { cart_items: [] } },
        };
      },
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useUpdateUserCartMutation,
  useCreateCartMutation,
  useResetUserCartMutation,
} = CartApiSlice;
