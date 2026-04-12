import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import AdminNavbar from "./AdminNavbar";
import { useColorModeValue } from "@/components/ui/color-mode";

interface IProps {}

const AdminLayout = ({}: IProps) => {
  return (
    <Flex h={"100dvh"}>
      <Box minW={"300px"} borderRight={"1px solid gray"}>
        <Sidebar />
      </Box>
      <Box flex={1}>
        <Box
          h={"80px"}
          borderBottom={"1px solid gray"}
          bg={useColorModeValue("white", "black")}
          px="2"
        >
          <AdminNavbar />
        </Box>
        <Box h={"calc(100% - 80px)"}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminLayout;
