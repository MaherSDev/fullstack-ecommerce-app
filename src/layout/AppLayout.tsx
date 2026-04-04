import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Box } from "@chakra-ui/react";

const AppLayout = () => {
  return (
    <>
      <Box as={"div"} h="calc(100dvh - 64px)">
        <NavBar />
        <Outlet />
      </Box>
    </>
  );
};

export default AppLayout;
