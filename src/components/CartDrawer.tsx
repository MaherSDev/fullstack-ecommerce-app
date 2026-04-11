import { removeAllItems, selectCart } from "@/app/features/cartSlice";
import {
  onCloseCartDrawerAction,
  selectGlobal,
} from "@/app/features/globalSlice";
import {
  Button,
  CloseButton,
  Drawer,
  FormatNumber,
  Portal,
  Stat,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import CartDrawerItem from "./CartDrawerItem";

export const CartDrawer = () => {
  const { isOpenCartDrawer } = useSelector(selectGlobal);
  const { cartProducts } = useSelector(selectCart);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(onCloseCartDrawerAction());
  };

  console.log(cartProducts);
  return (
    <Drawer.Root
      open={isOpenCartDrawer}
      placement="end"
      onInteractOutside={onClose}
      size={"sm"}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header> 
              <Drawer.Title>Drawer Title</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body spaceY={1}>
              {cartProducts.data.length
                ? cartProducts.data.map((product) => (
                    <CartDrawerItem
                      key={product.documentId}
                      product={product.product}
                      quantity={product.quantity}
                    />
                  ))
                : "Your cart is empty now"}
            </Drawer.Body>
            <Drawer.Footer
              alignItems={"flex-end"}
              justifyContent="space-between"
            >
              <Text textStyle="xl" fontWeight="medium" letterSpacing="tight">
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
              <Button
                variant="outline"
                onClick={() => dispatch(removeAllItems())}
              >
                Clear All
              </Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
