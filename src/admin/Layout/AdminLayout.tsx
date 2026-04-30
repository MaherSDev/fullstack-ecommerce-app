import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import AdminNavbar from "./AdminNavbar";
import { useColorModeValue } from "@/components/ui/color-mode";

interface IProps {}

const AdminLayout = ({}: IProps) => {
  return (
    <Flex minH={"100dvh"}>
      <Box minW={"200px"} borderRight={"1px solid gray"}>
        <Sidebar />
      </Box>
      <Box flex={1}>
        <Box
          h={"70px"}
          borderBottom={"1px solid gray"}
          bg={useColorModeValue("white", "black")}
          px="2"
        >
          <AdminNavbar />
        </Box>
        <Box h={"calc(100% - 70px)"} p={4}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminLayout;
