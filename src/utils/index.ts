import { toaster } from "@/components/ui/toaster";
import type { ICartItem, IProduct } from "@/interfaces";

export const shoppingCartQuantity = (
  product: IProduct,
  cartItems: ICartItem,
) => {
  const existProduct = cartItems.data.find(
    (item) => product.documentId === item.product.documentId,
  );

  if (existProduct) {
    toaster.create({
      title: "Added to your Cart",
      description:
        "This product is already in your cart, the quantity has been increased",
      type: "success",
      duration: 2000,
      closable: true,
    });

    return {
      data: cartItems.data.map((cartItem) =>
        cartItem.documentId === product.documentId
          ? {
              documentId: product.documentId,
              product,
              quantity: (cartItem.quantity += 1),
              totalPrice: cartItem.quantity * product.price,
            }
          : cartItem,
      ),
      cartCost: (cartItems.cartCost += product.price),
      totalQuantity: (cartItems.totalQuantity += 1),
    };
  }

  console.log(cartItems.cartCost);
  toaster.create({
    title: "Added to your Cart",
    type: "success",
    duration: 2000,
    closable: true,
  });
  return {
    data: [
      ...cartItems.data,
      {
        documentId: product.documentId,
        product,
        quantity: 1,
        totalPrice: product.price,
      },
    ],
    cartCost: (cartItems.cartCost += product.price),
    totalQuantity: (cartItems.totalQuantity += 1),
  };
};

export const removeFromCart = (product: IProduct, cartItems: ICartItem) => {
  const productToRemove = cartItems.data.find(
    (cartItem) => cartItem.documentId === product.documentId,
  );
  if (productToRemove) {
    toaster.create({
      title: `${productToRemove.product.title} - is Removed From Your Cart successfully`,
      type: "success",
      duration: 2000,
      closable: true,
    });
    return {
      data: cartItems.data.filter(
        (cartItem) => cartItem.documentId !== product.documentId,
      ),
      cartCost: (cartItems.cartCost -= productToRemove.totalPrice),
      totalQuantity: (cartItems.totalQuantity -= productToRemove.quantity),
    };
  }
  return cartItems;
};
