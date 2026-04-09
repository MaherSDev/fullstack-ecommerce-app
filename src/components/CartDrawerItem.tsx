import { Box, Button, Card, Flex, Image, Text } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import type { IProduct } from "@/interfaces";
import { useDispatch } from "react-redux";
import { removeCartItem } from "@/app/features/cartSlice";

interface IProps {
  product: IProduct;
  quantity: number;
}
const CartDrawerItem = ({ product, quantity }: IProps) => {
  const { title, thumbnail, price } = product;
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  return (
    <Card.Root padding={1} bg={"none"} overflow="hidden" textAlign={"center"}>
      <Flex align="center" justify="flex-start">
        <Image
          src={`${import.meta.env.VITE_SERVER_URL}${thumbnail?.url}`}
          alt="Green double couch with wooden legs"
          boxSize={"80px"}
          borderRadius={"full"}
          objectFit={"cover"}
        />
        <Card.Body gap={2} mt={2} fontSize={"sm"}>
          <Box textAlign="start">
            <Card.Title mb={2} fontSize={"sm"}>
              {title}
            </Card.Title>
            <Text>quantity: {quantity}</Text>
          </Box>
          <Flex align={"center"} justify="space-between">
            <Text
              textStyle="lg"
              fontWeight="medium"
              letterSpacing="tight"
              mt="2"
            >
              {price}$
            </Text>
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
              onClick={() => dispatch(removeCartItem(product))}
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
