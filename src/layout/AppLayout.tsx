import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Box } from "@chakra-ui/react";

const AppLayout = () => {
  return (
    <>
      <Box as={"div"} h="calc(100dvh - 64px)">
        <Navbar />
        <Outlet />
      </Box>
    </>
  );
};

export default AppLayout;
