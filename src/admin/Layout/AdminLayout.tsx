import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import AdminNavbar from "./AdminNavbar";
import { useColorModeValue } from "@/components/ui/color-mode";

interface IProps {}

const AdminLayout = ({}: IProps) => {
  const bg = useColorModeValue("blue.600", "blue.900");

  return (
    <Flex minH={"100dvh"}>
      <Box minW={"200px"} bg={bg}>
        <Sidebar />
      </Box>
      <Box flex={1}>
        <Box
          h={"70px"}
          bg={useColorModeValue("white", "black")}
          px="2"
          position={"absolute"}
          top={0}
          right={0}
          zIndex={5}
        >
          <AdminNavbar />
        </Box>
        <Box h={"full"} p={4}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminLayout;
