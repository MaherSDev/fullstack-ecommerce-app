import { Box, Button, Card, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import type { ICartItem, IProduct } from "@/interfaces";
import { useDeleteCartItemMutation } from "@/app/services/cartItem";
import { useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { removeCartItem } from "@/app/features/cartSlice";
import { onCloseCartDrawerAction } from "@/app/features/globalSlice";

interface IProps {
  cartItem: ICartItem;
  product: IProduct;
  quantity: number;
}

const CartDrawerItem = ({ product, quantity, cartItem }: IProps) => {
  const { title, thumbnail, price, discount, documentId } = product;
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const [deleteCartItem] = useDeleteCartItemMutation();

  const deleteCartItemHandler = async () => {
    try {
      const res = await deleteCartItem(cartItem.documentId);

      dispatch(removeCartItem(cartItem.documentId));

      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const priceAfterDiscount = price - price * (discount / 100);

  return (
    <Card.Root padding={1} bg={"none"} overflow="hidden" textAlign={"center"}>
      <Flex align="center" justify="flex-start">
        <RouterLink
          to={`/products/${documentId}`}
          onClick={() => {
            dispatch(onCloseCartDrawerAction());
          }}
        >
          <Image
            src={`${import.meta.env.VITE_SERVER_URL}${thumbnail?.url}`}
            alt={thumbnail?.alternativeText || title}
            boxSize={"80px"}
            borderRadius={"full"}
            objectFit={"cover"}
          />
        </RouterLink>
        <Card.Body gap={2} mt={2} fontSize={"sm"}>
          <Box textAlign="start">
            <Card.Title mb={2} fontSize={"sm"}>
              {title}
            </Card.Title>
            <Text>quantity: {quantity}</Text>
          </Box>
          <Flex align={"center"} justify="space-between">
            <HStack fontSize={"xl"} fontWeight="bold">
              {discount ? (
                <>
                  <Text
                    fontWeight="medium"
                    color={"gray.400"}
                    textDecorationLine={"line-through"}
                  >
                    ${price}
                  </Text>
                  <Text color={"primary"}>${priceAfterDiscount}</Text>
                </>
              ) : (
                <Text>${priceAfterDiscount}</Text>
              )}
            </HStack>
            <Button
              bg={"transparent"}
              color={colorMode !== "light" ? "red.400" : "red.600"}
              variant="outline"
              border={colorMode !== "light" ? "gray.200" : "gray.500"}
              py={1}
              mt={2}
              overflow={"hidden"}
              _hover={{
                bg: colorMode !== "light" ? "red.50" : "red.300",
                color: colorMode == "light" ? "red.600" : "red.600",
              }}
              onClick={deleteCartItemHandler}
            >
              Remove
            </Button>
          </Flex>
        </Card.Body>
      </Flex>
    </Card.Root>
  );
};

export default CartDrawerItem;
