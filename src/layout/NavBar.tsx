import {
  Box,
  Flex,
  Button,
  Stack,
  Avatar,
  Center,
  Menu,
  Portal,
  Link,
  HStack,
} from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "../components/ui/color-mode";
import { FiMoon, FiSun } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const Links = ["Dashboard", "Projects", "Team"];

  const NavLink = ({ children }) => (
    <Link
      as={RouterLink}
      to={children.toLowerCase()}
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
    >
      {children}
    </Link>
  );

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px="4">
      <Flex h="16" align="center" justify="space-between">
        <Box fontWeight="bold">Logo</Box>
        <HStack as={"nav"} gap={4} display={{ base: "none", md: "flex" }}>
          {Links.map((link) => (
            <NavLink key={link}>{link}</NavLink>
          ))}
        </HStack>

        <Flex align="center">
          <Stack direction="row" gap="6">
            {/* Dark Mode */}
            <Button onClick={toggleColorMode} size="sm">
              {colorMode === "light" ? <FiMoon /> : <FiSun />}
            </Button>

            {/* ✅ NEW MENU API */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button rounded="full" variant="ghost" minW="0">
                  <Avatar.Root size="sm">
                    <Avatar.Image src="https://avatars.dicebear.com/api/male/username.svg" />
                    <Avatar.Fallback name="Username" />
                  </Avatar.Root>
                </Button>
              </Menu.Trigger>

              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Center py="4">
                      <Avatar.Root size="sm">
                        <Avatar.Image src="https://avatars.dicebear.com/api/male/username.svg" />
                        <Avatar.Fallback name="Username" />
                      </Avatar.Root>
                    </Center>

                    <Center pb="3">
                      <Box fontSize="sm" fontWeight="medium">
                        Username
                      </Box>
                    </Center>

                    <Menu.Separator />

                    <Menu.Item value="account">My Account</Menu.Item>

                    <Menu.Item value="settings">Settings</Menu.Item>

                    <Menu.Item value="logout" color="red.400">
                      Logout
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
