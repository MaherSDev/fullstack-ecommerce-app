import type { ICartItem, IProduct } from "@/interfaces";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { shoppingCartQuantity, removeFromCart } from "@/utils";
import { defaultCartData } from "@/constants";
import { toaster } from "@/components/ui/toaster";

interface ICartState {
  cartProducts: ICartItem;
}

const initialState: ICartState = {
  cartProducts: defaultCartData,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IProduct>) => {
      state.cartProducts = shoppingCartQuantity(
        action.payload,
        state.cartProducts,
      );
    },
    removeCartItem: (state, action: PayloadAction<IProduct>) => {
      state.cartProducts = removeFromCart(action.payload, state.cartProducts);
    },
    removeAllItems: (state) => {
      if (state.cartProducts.totalQuantity <= 0) {
        toaster.create({
          title: "You don't have any product in your cart",
          type: "info",
          duration: 2000,
          closable: true,
        });
        return;
      }
      toaster.create({
        title: "Cleared successfully, your cart is empty now",
        type: "success",
        duration: 2000,
        closable: true,
      });
      state.cartProducts = defaultCartData;
    },
  },
});

export const selectCart = ({ cart }: RootState) => cart;
export const { addToCart, removeCartItem, removeAllItems } = cartSlice.actions;
export default cartSlice.reducer;
