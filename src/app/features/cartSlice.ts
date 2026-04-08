import type { ICartItem, IProduct } from "@/interfaces";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { shoppingCartQuantity } from "@/utils";

interface ICartState {
  cartProducts: ICartItem;
}

const initialState: ICartState = {
  cartProducts: {
    data: [],
    cartCost: 0,
    totalQuantity: 0,
  },
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
  },
});

export const selectCart = ({ cart }: RootState) => cart;
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
