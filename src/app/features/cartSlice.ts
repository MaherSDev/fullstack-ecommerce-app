import type { IProduct } from "@/interfaces";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ICartState {
  cartProducts: IProduct[];
}

const initialState: ICartState = {
  cartProducts: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IProduct>) => {
      state.cartProducts = [...state.cartProducts, action.payload];
    },
  },
});

export const selectCart = ({ cart } : RootState) => cart;
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
