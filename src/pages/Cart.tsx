import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Link as RouterLink } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import type { ICartItem } from "@/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { activeCartItem, selectCart } from "@/app/features/cartSlice";
import { useUpdateCartItemMutation } from "@/app/services/cartItem";
import { useState } from "react";

const Cart = () => {
  const dispatch = useDispatch();
  const [updateCartItem] = useUpdateCartItemMutation();
  const { cartProducts } = useSelector(selectCart);
  const [sortBy, setSortBy] = useState("selected");

  const selectAllHandler = () => {
    const isSelectedAll =
      cartProducts.selectedQuantity === cartProducts.totalQuantity;

    cartProducts.data.map(async (item) => {
      dispatch(
        activeCartItem({ documentId: item.documentId, active: !isSelectedAll }),
      );

      try {
        const res = await updateCartItem({
          documentId: item.documentId,
          body: {
            data: { active: !isSelectedAll },
          },
        });
        return res;
      } catch (error) {
        console.error(error);
      }
    });
    console.log("finished");
  };

  const sortListBy = [...cartProducts.data].sort(
    (a, b) => Number(b.active) - Number(a.active),
  );

  // Empty cart state
  if (cartProducts.data.length === 0) {
    return (
      <Box textAlign="center" mt={20}>
        <Heading fontSize="2xl">Your Cart is empty</Heading>

        <RouterLink to={"/products"} replace>
          <Button
            type="button"
            bg={"bg-button"}
            color={"text--button"}
            fontSize={"lg"}
            variant="outline"
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
          >
            Start Shopping
          </Button>
        </RouterLink>
      </Box>
    );
  }

  return (
    <Box mx="auto" my={10}>
      {/* Breadcrumb and page heading */}
      <Heading as="h1" fontSize={"3xl"} fontWeight="medium">
        Your Cart
      </Heading>

      {/* Cart items and summary */}
      <Flex mt={8} direction={{ base: "column", xl: "row" }} gap={10}>
        <Box
          w={{ base: "full", xl: "7/12" }}
          borderWidth="1px"
          borderColor="gray.300"
          borderRadius="2xl"
        >
          <VStack m={4}>
            <Flex
              justifyContent={"space-between"}
              w={"full"}
              alignItems={"baseline"}
            >
              <HStack alignItems={"flex-start"}>
                <Checkbox.Root
                  size="md"
                  top="0.5"
                  aria-label="Select row"
                  checked={
                    cartProducts.selectedQuantity === cartProducts.totalQuantity
                  }
                  onCheckedChange={selectAllHandler}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control borderRadius={"md"} />
                </Checkbox.Root>
                Select all
              </HStack>
              {cartProducts.selectedQuantity ? (
                <HStack alignItems={"baseline"}>
                  <Text color={"secondary-text-color"}>Sort By: </Text>
                  <Box>
                    <Button
                      type="button"
                      variant="outline"
                      w={"full"}
                      border="solid 1px"
                      color={sortBy === "selected" ? "hover-text" : "default"}
                      borderColor={
                        sortBy === "selected" ? "bg-button" : "input-border"
                      }
                      rounded={"full"}
                      py={1.5}
                      px={3}
                      overflow={"hidden"}
                      _hover={{
                        color: "hover-text",
                        borderColor: "bg-button",
                      }}
                      onClick={() => setSortBy("selected")}
                    >
                      ({cartProducts.selectedQuantity}) Selected
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      type="button"
                      variant="outline"
                      w={"full"}
                      border="solid 1px"
                      color={!sortBy ? "hover-text" : "default"}
                      borderColor={!sortBy ? "bg-button" : "input-border"}
                      rounded={"full"}
                      py={1.5}
                      px={3}
                      overflow={"hidden"}
                      _hover={{
                        color: "hover-text",
                        borderColor: "bg-button",
                      }}
                      onClick={() => setSortBy("")}
                    >
                      ({cartProducts.totalQuantity}) all
                    </Button>
                  </Box>
                </HStack>
              ) : (
                ""
              )}
            </Flex>
          </VStack>
          {(sortBy === "selected"
            ? [...sortListBy]
            : [...cartProducts.data]
          ).map((item: ICartItem) => (
            <CartItem key={item.documentId} item={item} />
          ))}
        </Box>

        <Box w={{ base: "full", xl: "5/12" }}>
          <CartSummary />
        </Box>
      </Flex>
    </Box>
  );
};

export default Cart;
