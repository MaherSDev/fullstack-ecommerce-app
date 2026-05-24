import { SidebarContent } from "@/admin/common/constants";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { IUserData } from "@/interfaces";
import { Box, Icon, Link, Separator, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink, useOutletContext } from "react-router-dom";

const SidebarBody = () => {
  const hoverColor = useColorModeValue("blue.900", "blue.600");
  const user = useOutletContext<IUserData>();

  return (
    <Box pt={2}>
      <VStack px={3} gap={0}>
        {SidebarContent.topMenu.map(({ label, path, icon }, key) => {
          if (path === "users" && {...user}?.role?.type !== "admin") return null;
          return (
            <Link
              key={key}
              as={RouterLink}
              to={path}
              fontWeight={"medium"}
              rounded={"md"}
              outline="none"
              transition={"all .1s ease-in"}
              _hover={{
                textDecoration: "none",
                bg: hoverColor,
              }}
              textAlign={"left"}
              w={"full"}
              color={"gray.100"}
              p={2}
            >
              <Icon color={"inherit"} aria-label={label} size={"md"} mr={2}>
                {icon}
              </Icon>
              <Text textStyle="lg" fontWeight="medium">
                {label}
              </Text>
            </Link>
          );
        })}
      </VStack>
      <Separator
        borderColor={"gray.100"}
        variant="solid"
        my={4}
        w={"80%"}
        mx={"auto"}
      />
      <VStack px={3} gap={0}>
        {SidebarContent.bottomMenu.map(({ label, path, icon }, key) => (
          <Link
            key={key}
            as={RouterLink}
            to={path}
            fontWeight={"medium"}
            rounded={"md"}
            outline="none"
            transition={"all .1s ease-in"}
            _hover={{
              textDecoration: "none",
              bg: hoverColor,
            }}
            textAlign={"left"}
            w={"full"}
            color={"gray.100"}
            p={2}
          >
            <Icon color={"inherit"} aria-label={label} size={"md"} mr={2}>
              {icon}
            </Icon>
            <Text textStyle="lg" fontWeight="medium">
              {label}
            </Text>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default SidebarBody;
