import { selectCart } from "@/app/features/cartSlice";
import {
  onCloseCartDrawerAction,
  selectGlobal,
} from "@/app/features/globalSlice";
import {
  Button,
  CloseButton,
  Drawer,
  Flex,
  FormatNumber,
  Portal,
  Stat,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import CartDrawerItem from "./CartDrawerItem";

export const CartDrawer = () => {
  const { isOpenCartDrawer } = useSelector(selectGlobal);
  const {
    cartProducts: { data, cartCost },
  } = useSelector(selectCart);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(onCloseCartDrawerAction());
  };

  console.log(cartCost);
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
              {data.length &&
                data.map((product) => (
                  <CartDrawerItem
                    key={product.documentId}
                    product={product.product}
                    quantity={product.quantity}
                  />
                ))}
            </Drawer.Body>
            <Drawer.Footer alignItems={"flex-end"} justifyContent="space-between">
              <Text textStyle="xl" fontWeight="medium" letterSpacing="tight">
                <Stat.Root>
                  <Stat.Label>Cost</Stat.Label>
                  <Stat.ValueText>
                    <FormatNumber
                      value={cartCost}
                      style="currency"
                      currency="USD"
                    />
                  </Stat.ValueText>
                </Stat.Root>
              </Text>
              <Button variant="outline" onClick={() => {}}>
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
