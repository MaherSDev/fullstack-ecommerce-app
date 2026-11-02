import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Box, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { getGuestCart } from "@/utils";
import { setCartFromServer } from "@/app/features/cartSlice";
import { useDispatch } from "react-redux";
import { CartDrawer } from "@/components/CartDrawer";

const AppLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCartData = async () => {
      try {
        const cartData = await getGuestCart();

        if (!cartData) return null;

        dispatch(setCartFromServer(cartData.cart_items));
        return cartData;
      } catch (error) {
        console.error(error);
      }
    };
    getCartData();
  }, [dispatch]);

  return (
    <>
      <Flex minH="100dvh" direction={"column"}>
        <Box bg={{ base: "gray.100", _dark: "gray.900" }} px="4">
          <Navbar />
        </Box>
        <Box
          flex={1}
          w={"full"}
          maxW={"1440px"}
          mx={"auto"}
          px={{ base: 8, xl: 10 }}
        >
          <Outlet />
        </Box>
      </Flex>
      <CartDrawer />
    </>
  );
};

export default AppLayout;
