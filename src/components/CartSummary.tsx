import { selectCart } from "@/app/features/cartSlice";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

const CartSummary = () => {
  const { cartProducts } = useSelector(selectCart);

  const subTotal: number = cartProducts.cartCost + cartProducts.totalDiscount;

  const discountInPercent: number =
    (cartProducts.totalDiscount * 100) / subTotal;

  const deliveryFee: number = 15;
  const total: number = Number(
    (cartProducts.cartCost + deliveryFee).toFixed(2),
  );

  return (
    <Box
      w="full"
      minH={{ xl: "23.5rem" }}
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="2xl"
      p={{ base: 4, xl: 6 }}
    >
      <Heading as="h2" mb={4} fontSize={"2xl"} fontWeight="semibold">
        Order Summary
      </Heading>

      {/* Summary details */}
      <VStack align="stretch" gap={2}>
        <Flex justify="space-between" align="center" gap={3}>
          <Text>Subtotal</Text>
          <Text fontWeight="semibold">${subTotal}</Text>
        </Flex>

        <Flex justify="space-between" align="center" gap={3}>
          <Text>Total Items</Text>
          <Text fontWeight="semibold">{cartProducts.selectedQuantity}</Text>
        </Flex>

        <Flex justify="space-between" align="center" gap={3}>
          <Text>Discount ({discountInPercent.toFixed(2)}%)</Text>
          <Text fontWeight="semibold" color="primary">
            -${cartProducts.totalDiscount.toFixed(2)}
          </Text>
        </Flex>

        <Flex
          justify="space-between"
          align="center"
          gap={3}
          borderBottomWidth="1px"
          borderColor="divider"
          pb={4}
        >
          <Text>Delivery Fee</Text>
          <Text fontWeight="semibold">${deliveryFee}</Text>
        </Flex>
      </VStack>

      {/* Final total */}
      <Flex
        mt={4}
        justify="space-between"
        align="center"
        gap={3}
        fontSize={{ base: "lg", xl: "xl" }}
        fontWeight="semibold"
      >
        <Text>Total</Text>
        <Text>${total.toFixed(2)}</Text>
      </Flex>

      {/* Checkout button */}
      <Box w="full" mt={2}>
        <RouterLink to={"/checkout"} replace>
          <Button
            type="button"
            bg={"bg-button"}
            color={"text--button"}
            fontSize={"lg"}
            variant="outline"
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
          >
            Go to Checkout
          </Button>
        </RouterLink>
      </Box>
    </Box>
  );
};

export default CartSummary;
