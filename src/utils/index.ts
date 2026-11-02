import axiosInstance from "@/api/axios.config";
import { toaster } from "@/components/ui/toaster";
import type { ICart } from "@/interfaces";
import CookieService from "@/services/CookieService";
import uuid from "react-uuid";

export const getGuestCart = async (documentId?: string) => {
  const guestSessionId = CookieService.get("guest_session");

  if (!guestSessionId && !documentId) return null;

  try {
    const { data } = await axiosInstance.get(
      documentId
        ? `carts/${documentId}?populate=cart_items&populate=cart_items.product&populate=cart_items.product.thumbnail`
        : "carts?populate=cart_items&populate=cart_items.product&populate=cart_items.product.thumbnail",
      {
        params: {
          filters: {
            sessionId: {
              $eq: guestSessionId,
            },
          },
        },
      },
    );
    const cartData = data.data?.length ? data.data[0] : data.data;
    const guestCartCookie = CookieService.get("guest_cart");

    if (!guestCartCookie)
      CookieService.set("guest_cart", cartData?.documentId || "");
    return cartData;
  } catch (error: any) {
    return error.response?.data?.message || "Failed to fetch cart";
  }
};

export const newSessionId = () => {
  const newUuid = uuid();
  CookieService.set("guest_session", `guest-${newUuid}`);
  return `guest-${newUuid}`;
};

export const removeFromCart = (documentId: string, cartItems: ICart) => {
  const productToRemove = cartItems.data.find(
    (cartItem) => cartItem.documentId === documentId,
  );

  if (productToRemove) {
    toaster.create({
      title: "This Product is Removed From Your Cart successfully",
      type: "success",
      duration: 2000,
      closable: true,
    });

    return {
      data: cartItems.data.filter(
        (cartItem) => cartItem.documentId !== documentId,
      ),
      cartCost: (cartItems.cartCost -= productToRemove.totalPrice),
      totalQuantity: (cartItems.totalQuantity -= productToRemove.quantity),
      selectedQuantity: productToRemove.active
        ? (cartItems.selectedQuantity -= productToRemove.quantity)
        : cartItems.selectedQuantity,
      totalDiscount: (cartItems.totalDiscount -=
        productToRemove.totalPrice * (productToRemove.discount / 100)),
    };
  }

  return cartItems;
};
export const updateCartItemQuantity = (
  documentId: string,
  updatedQuantity: number,
  cartItems: ICart,
) => {
  const productToUpdate = cartItems.data.find(
    (cartItem) => cartItem.documentId === documentId,
  );

  if (productToUpdate) {
    toaster.create({
      title: "Quantity is Updated successfully",
      type: "success",
      duration: 2000,
      closable: true,
    });

    const updatedCartItems = cartItems.data.map((cartItem) => ({
      documentId: cartItem.documentId,
      product: cartItem.product,
      discount: cartItem.discount,
      active: cartItem.active,
      quantity:
        cartItem.documentId === documentId
          ? updatedQuantity
          : cartItem.quantity,
      totalPrice:
        (cartItem.documentId === documentId
          ? updatedQuantity
          : cartItem.quantity) * cartItem.product.price,
    }));

    const totalDiscount = updatedCartItems.reduce(
      (total, item) =>
        !item.active ? total : total + item.totalPrice * (item.discount / 100),
      0,
    );

    return {
      data: updatedCartItems,
      totalQuantity: updatedCartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      selectedQuantity: updatedCartItems.reduce(
        (total, item) => (!item.active ? total : total + item.quantity),
        0,
      ),
      totalDiscount,
      cartCost:
        updatedCartItems.reduce(
          (total, item) => (!item.active ? total : total + item.totalPrice),
          0,
        ) - totalDiscount,
    };
  }

  return cartItems;
};
export const setActiveCartItem = (
  documentId: string,
  active: boolean,
  cartItems: ICart,
) => {
  const cartItemToUpdate = cartItems.data.find(
    (cartItem) => cartItem.documentId === documentId,
  );

  if (cartItemToUpdate) {
    const updatedCartItems = cartItems.data.map((cartItem) => ({
      documentId: cartItem.documentId,
      product: cartItem.product,
      discount: cartItem.discount,
      active: cartItem.documentId === documentId ? active : cartItem.active,
      quantity: cartItem.quantity,
      totalPrice: cartItem.totalPrice,
    }));

    const totalDiscount = updatedCartItems.reduce(
      (total, item) =>
        !item.active ? total : total + item.totalPrice * (item.discount / 100),
      0,
    );

    return {
      data: updatedCartItems,
      totalQuantity: cartItems.totalQuantity,
      selectedQuantity: updatedCartItems.reduce(
        (total, item) => (!item.active ? total : total + item.quantity),
        0,
      ),
      totalDiscount,
      cartCost:
        updatedCartItems.reduce(
          (total, item) => (!item.active ? total : total + item.totalPrice),
          0,
        ) - totalDiscount,
    };
  }

  return cartItems;
};
