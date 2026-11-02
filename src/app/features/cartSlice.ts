import type { IApiCartItem, ICart } from "@/interfaces";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { defaultCartData } from "@/constants";
import { toaster } from "@/components/ui/toaster";
import {
  removeFromCart,
  setActiveCartItem,
  updateCartItemQuantity,
} from "@/utils";

interface ICartState {
  cartProducts: ICart;
}

const initialState: ICartState = {
  cartProducts: defaultCartData,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartFromServer: (state, action: PayloadAction<IApiCartItem[]>) => {
      const cartItems = action.payload;

      const totalDiscount: number = cartItems.reduce(
        (total, item) =>
          total + item.price * item.quantity * (item.discount / 100),
        0,
      );

      state.cartProducts = {
        data: cartItems.map((cartItem) => ({
          documentId: cartItem.documentId,
          product: cartItem.product,
          quantity: cartItem.quantity,
          discount: cartItem.discount,
          totalPrice: cartItem.quantity * cartItem.price,
          active: cartItem.active,
        })),

        totalQuantity: cartItems.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        selectedQuantity: cartItems.reduce(
          (total, item) => (!item.active ? total : total + item.quantity),
          0,
        ),
        totalDiscount,
        cartCost:
          cartItems.reduce(
            (total, item) =>
              !item.active ? total : total + item.quantity * item.price,
            0,
          ) - totalDiscount,
      };
    },

    activeCartItem: (
      state,
      action: PayloadAction<{ documentId: string; active: boolean }>,
    ) => {
      const { documentId, active } = action.payload;
      state.cartProducts = setActiveCartItem(
        documentId,
        active,
        state.cartProducts,
      );
    },

    changeCartItemQty: (
      state,
      action: PayloadAction<{ documentId: string; quantity: number }>,
    ) => {
      const { documentId, quantity } = action.payload;
      state.cartProducts = updateCartItemQuantity(
        documentId,
        quantity,
        state.cartProducts,
      );
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.cartProducts = removeFromCart(action.payload, state.cartProducts);
    },

    clearCart: (state) => {
      state.cartProducts = defaultCartData;

      toaster.create({
        title: "Cart cleared",
        description: "Your cart is empty now",
        type: "success",
        duration: 2000,
        closable: true,
      });
    },
  },
});

export const selectCart = ({ cart }: RootState) => cart;

export const {
  setCartFromServer,
  activeCartItem,
  changeCartItemQty,
  removeCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
