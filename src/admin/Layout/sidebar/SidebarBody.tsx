import { SidebarContent } from "@/admin/common/constants";
import { useColorModeValue } from "@/components/ui/color-mode";
import { IconButton, Link, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const SidebarBody = () => {
  const color = useColorModeValue("blue.500", "blue.500");
  return (
    <VStack pl={3} pt={2}>
      {SidebarContent.map(({ label, path, icon }, key) => (
        <Link
          key={key}
          as={RouterLink}
          to={path}
          fontWeight={"medium"}
          rounded={"md"}
          outline="none"
          _hover={{
            textDecoration: "none",
            color,
          }}
          textAlign={"left"}
          w={"full"}
        >
          <IconButton aria-label={label} variant={"ghost"}>
            {icon}
          </IconButton>
          <Text textStyle="lg" fontWeight="medium">
            {label}
          </Text>
        </Link>
      ))}
    </VStack>
  );
};

export default SidebarBody;
