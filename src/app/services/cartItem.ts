import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CartItemApiSlice = createApi({
  reducerPath: "cartItemApi",
  tagTypes: ["CartItem", "Cart"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APi_URL }),
  endpoints: (build) => ({
    updateCartItem: build.mutation({
      query: ({ documentId, body }) => {
        return {
          url: `cart-items/${documentId}?populate=product&populate=product.thumbnail`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["CartItem", "Cart"],
    }),
    createCartItem: build.mutation({
      query: ({ body }) => {
        return {
          url: `cart-items?populate=product&populate=product.thumbnail`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["CartItem", "Cart"],
    }),
    deleteCartItem: build.mutation({
      query: (id) => {
        return {
          url: `cart-items/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["CartItem", "Cart"],
    }),
  }),
});

export const {
  useCreateCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} = CartItemApiSlice;
