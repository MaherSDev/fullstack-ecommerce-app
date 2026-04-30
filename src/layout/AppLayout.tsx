import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import { Box, Flex } from "@chakra-ui/react";

const AppLayout = () => {
  return (
    <>
      <Flex minH="100dvh" direction={"column"}>
        <Navbar />
        <Box flex={1}>
          <Outlet />
        </Box>
      </Flex>
    </>
  );
};

export default AppLayout;
