import { Box } from "@chakra-ui/react";
import SidebarBody from "./SidebarBody";
import SidebarHeader from "./SidebarHeader.tsx";

interface IProps {}

const Sidebar = ({}: IProps) => {
  return (
    <Box>
      <SidebarHeader />
      <SidebarBody />
    </Box>
  );
};

export default Sidebar;
