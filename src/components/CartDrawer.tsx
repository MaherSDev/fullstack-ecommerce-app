import { clearCart, selectCart } from "@/app/features/cartSlice";
import {
  onCloseCartDrawerAction,
  selectGlobal,
} from "@/app/features/globalSlice";
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  FormatNumber,
  Heading,
  HStack,
  Portal,
  Stat,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import CookieService from "@/services/CookieService";
import { useResetUserCartMutation } from "@/app/services/cart";
import { useDeleteCartItemMutation } from "@/app/services/cartItem";
import CartItem from "./CartItem";

export const CartDrawer = () => {
  const { isOpenCartDrawer } = useSelector(selectGlobal);
  const { cartProducts } = useSelector(selectCart);
  const dispatch = useDispatch();

  const [resetCart] = useResetUserCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  const onClose = () => {
    dispatch(onCloseCartDrawerAction());
  };

  const removeAllCartItemsHandler = async () => {
    try {
      const emptyCart = cartProducts.data.forEach(async (item) => {
        await deleteCartItem(item.documentId);
      });
      console.log(emptyCart);
      return emptyCart;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const clearCartHandler = async () => {
    const cartId = CookieService.get("guest_cart");

    try {
      await removeAllCartItemsHandler();
      const { data } = await resetCart(cartId);

      if (!data.data?.cart_items.length) dispatch(clearCart());
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  return (
    <Drawer.Root
      open={isOpenCartDrawer}
      placement="end"
      onInteractOutside={onClose}
      size={"md"}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title fontSize={"xl"} fontWeight="medium">
                Your Cart
              </Drawer.Title>
            </Drawer.Header>
            {cartProducts.data.length === 0 ? (
              <Box textAlign="center" mt={20}>
                <Heading fontSize="xl">Your Cart is empty</Heading>

                <RouterLink to={"/products"} replace>
                  <Button
                    type="button"
                    bg={"bg-button"}
                    color={"text--button"}
                    fontSize={"lg"}
                    variant="solid"
                    border={"none"}
                    py={6}
                    px={12}
                    mt={5}
                    overflow={"hidden"}
                    _hover={{
                      bg: "hover-bg-button",
                      color: "hover-text",
                      border: "none",
                    }}
                    onClick={onClose}
                  >
                    Start Shopping
                  </Button>
                </RouterLink>
              </Box>
            ) : (
              <>
                <Drawer.Body spaceY={1} px={2}>
                  {cartProducts.data.map((product) => (
                    <CartItem
                      key={product.documentId}
                      item={product}
                      checkbox={false}
                    />
                  ))}
                </Drawer.Body>
                <Drawer.Footer flexDirection="column">
                  <HStack
                    alignItems={"flex-end"}
                    justifyContent="space-between"
                    w="full"
                  >
                    <Text
                      as={"div"}
                      textStyle="xl"
                      fontWeight="medium"
                      letterSpacing="tight"
                    >
                      <Stat.Root>
                        <Stat.Label>Cost</Stat.Label>
                        <Stat.ValueText>
                          <FormatNumber
                            value={cartProducts.cartCost}
                            style="currency"
                            currency="USD"
                          />
                        </Stat.ValueText>
                      </Stat.Root>
                    </Text>
                    <Button variant="outline" onClick={clearCartHandler}>
                      Clear All
                    </Button>
                  </HStack>
                  <Box w="full">
                    <RouterLink to={"/cart"} replace>
                      <Button
                        type="button"
                        bg={"bg-button"}
                        color={"text--button"}
                        fontSize={"lg"}
                        variant="solid"
                        w={"full"}
                        border={"none"}
                        py={6}
                        mt={2}
                        overflow={"hidden"}
                        _hover={{
                          bg: "hover-bg-button",
                          color: "hover-text",
                          border: "none",
                        }}
                        onClick={onClose}
                      >
                        Go to cart
                      </Button>
                    </RouterLink>
                  </Box>
                </Drawer.Footer>
              </>
            )}
            <Drawer.CloseTrigger asChild>
              <CloseButton size="md" onClick={onClose} />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
