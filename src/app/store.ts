import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./features/loginSlice";
import cartSlice from "./features/cartSlice";
import globalSlice from "./features/globalSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { ProductsApiSlice } from "./services/products";
import { CategoriesApiSlice } from "./services/categories";
import { MediaApiSlice } from "./services/media";
import { UsersApiSlice } from "./services/user";

const resolvedStorage =
  (storage as unknown as { default?: typeof storage }).default ?? storage;
const persistCartConfig = {
  key: "cart",
  storage: resolvedStorage,
};

const persistedCart = persistReducer(persistCartConfig, cartSlice);

export const store = configureStore({
  reducer: {
    cart: persistedCart,
    login: loginSlice,
    global: globalSlice,
    [UsersApiSlice.reducerPath]: UsersApiSlice.reducer,
    [ProductsApiSlice.reducerPath]: ProductsApiSlice.reducer,
    [CategoriesApiSlice.reducerPath]: CategoriesApiSlice.reducer,
    [MediaApiSlice.reducerPath]: MediaApiSlice.reducer,
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
      [ProductsApiSlice.middleware],
      [CategoriesApiSlice.middleware],
      [MediaApiSlice.middleware],
      [UsersApiSlice.middleware],
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
