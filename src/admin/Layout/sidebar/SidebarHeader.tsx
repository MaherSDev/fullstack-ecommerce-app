import { Box, Center, Heading } from "@chakra-ui/react";

interface IProps {}

const SidebarHeader = ({}: IProps) => {
  return (
    <Box>
      <Center w={"ful"} inline paddingLeft={5} h={"60px"}>
        <Heading as="h1" size={"3xl"}>
          Logo
        </Heading>
      </Center>
    </Box>
  );
};

export default SidebarHeader;
