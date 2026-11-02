import { Button } from "@chakra-ui/react";
import { getGuestCart, newSessionId } from "@/utils";
import {
  useCreateCartItemMutation,
  useUpdateCartItemMutation,
} from "@/app/services/cartItem";
import { useCreateCartMutation } from "@/app/services/cart";
import type { IApiCartItem, IProduct } from "@/interfaces";
import { onOpenCartDrawerAction } from "@/app/features/globalSlice";
import { useDispatch } from "react-redux";
import { setCartFromServer } from "@/app/features/cartSlice";
import { toaster } from "./toaster";
import { FaCartPlus } from "react-icons/fa";

interface IProps {
  product: IProduct;
  quantity?: number;
}

const AddToCartButton = ({ product, quantity = 1 }: IProps) => {
  const dispatch = useDispatch();
  const [createCartItem] = useCreateCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [createCart] = useCreateCartMutation();

  const createCartItemHandler = async (cartId: number, quantity: number) => {
    try {
      const payload = {
        data: {
          product: product,
          quantity,
          price: product.price,
          discount: product.discount,
          cart: cartId,
        },
      };

      const { data } = await createCartItem({
        body: payload,
      });
      return data;
    } catch (error) {
      console.error(error);
      return "failed to Create Cart Item";
    }
  };

  const updateCartItemHandler = async (
    cartId: number,
    cartItem: IApiCartItem,
    quantity: number,
  ) => {
    try {
      const newQuantity = quantity + cartItem.quantity;

      const payload = {
        data: {
          active: true,
          product: cartItem.product,
          quantity: newQuantity,
          price: cartItem.price,
          discount: cartItem.discount,
          cart: cartId,
        },
      };
      const { data } = await updateCartItem({
        documentId: cartItem.documentId,
        body: payload,
      });
      return data;
    } catch (error) {
      console.error(error);
      return "failed to Update Cart Item";
    }
  };

  const cartHandler = async () => {
    if (!product) return;

    try {
      const cartData = await getGuestCart("");

      if (!cartData) {
        const guestSessionId = newSessionId();

        const { data: newCart } = await createCart({
          body: {
            data: {
              sessionId: guestSessionId,
            },
          },
        });
        const { data: newProduct } = await createCartItemHandler(
          newCart.data.id,
          quantity,
        );
        console.log("newProduct: ", newProduct);
        console.log([newProduct]);
        dispatch(setCartFromServer([newProduct]));
        dispatch(onOpenCartDrawerAction());

        return;
      }

      const existCartItem = cartData.cart_items?.find(
        (item: IApiCartItem) => item.product.documentId === product.documentId,
      );

      if (existCartItem) {
        const { data } = await updateCartItemHandler(
          cartData.id,
          existCartItem,
          quantity,
        );

        if (data) {
          const newCartItems = cartData.cart_items.map((item: IApiCartItem) => {
            if (item.product.documentId === product.documentId) {
              return data;
            }
            return item;
          });

          dispatch(setCartFromServer(newCartItems));
          dispatch(onOpenCartDrawerAction());

          toaster.create({
            title: "This Product is Added to Your Cart successfully",
            type: "success",
            duration: 2000,
            closable: true,
          });
          return;
        }
        return;
      }

      const { data: newProduct } = await createCartItemHandler(
        cartData.id,
        quantity,
      );

      cartData.cart_items.push(newProduct);
      dispatch(setCartFromServer(cartData.cart_items));
      dispatch(onOpenCartDrawerAction());

      toaster.create({
        title: "This Product is Added to Your Cart successfully",
        type: "success",
        duration: 2000,
        closable: true,
      });
    } catch (error) {
      console.error("Cart handler error:", error);
    }
  };

  return (
    <>
      <Button
        type="button"
        bg={"bg-button"}
        color={"text--button"}
        variant="solid"
        w={"full"}
        border={"none"}
        py={5}
        mt={2}
        overflow={"hidden"}
        _hover={{
          bg: "hover-bg-button",
          color: "hover-text",
          border: "none",
        }}
        onClick={cartHandler}
      >
        <FaCartPlus />
        Add to cart
      </Button>
    </>
  );
};

export default AddToCartButton;
