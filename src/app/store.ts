import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./features/loginSlice";
import cartSlice from "./features/cartSlice";
import globalSlice from "./features/globalSlice";
import { ProductsApiSlice } from "./services/products";
import { CategoriesApiSlice } from "./services/categories";
import { MediaApiSlice } from "./services/media";
import { UsersApiSlice } from "./services/user";
import { AddressApiSlice } from "./services/address";
import { CartItemApiSlice } from "./services/cartItem";
import { CartApiSlice } from "./services/cart";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    login: loginSlice,
    global: globalSlice,

    [UsersApiSlice.reducerPath]: UsersApiSlice.reducer,
    [ProductsApiSlice.reducerPath]: ProductsApiSlice.reducer,
    [CategoriesApiSlice.reducerPath]: CategoriesApiSlice.reducer,
    [MediaApiSlice.reducerPath]: MediaApiSlice.reducer,
    [AddressApiSlice.reducerPath]: AddressApiSlice.reducer,
    [CartItemApiSlice.reducerPath]: CartItemApiSlice.reducer,
    [CartApiSlice.reducerPath]: CartApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
        ],
      },
    }).concat(
      ProductsApiSlice.middleware,
      CategoriesApiSlice.middleware,
      MediaApiSlice.middleware,
      UsersApiSlice.middleware,
      AddressApiSlice.middleware,
      CartItemApiSlice.middleware,
      CartApiSlice.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;