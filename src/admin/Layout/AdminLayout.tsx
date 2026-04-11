import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";

interface IProps {}

const AdminLayout = ({}: IProps) => {
  return (
    <Flex h={"100dvh"}>
      <Box minW={"300px"} borderRight={"1px solid gray"}>
        <Sidebar />
      </Box>
      <Box flex={1}>
        <Box h={"60px"} borderBottom={"1px solid gray"}>
          Navbar
        </Box>
        <Box h={"calc(100% - 60px)"}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminLayout;
