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
  Heading,
} from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "../components/ui/color-mode";
import { FiMoon, FiSun } from "react-icons/fi";
import { Link as RouterLink, type LinkProps } from "react-router-dom";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import CookieService from "@/services/CookieService";
import { selectCart } from "@/app/features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { onOpenCartDrawerAction } from "@/app/features/globalSlice";

interface IProps {
  children:
    | string
    | ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>;
}

export default function Navbar() {
  const dispatch = useDispatch();
  const { cartProducts } = useSelector(selectCart);
  const { colorMode, toggleColorMode } = useColorMode();
  const token = CookieService.get("jwt");
  const Links = ["Products"];

  const NavLink = ({ children }: IProps) => (
    <Link
      as={RouterLink}
      to={`/${children}`.toLowerCase()}
      fontWeight={"medium"}
      rounded={"md"}
      outline="none"
      _hover={{
        textDecoration: "none",
        color: useColorModeValue("blue.500", "blue.500"),
      }}
    >
      {children.toString()}
    </Link>
  );

  const logoutHandler = () => {
    CookieService.remove("jwt");
    window.location.reload();
  };

  const onOpen = () => {
    dispatch(onOpenCartDrawerAction());
  };

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px="4">
      <Flex h="16" align="center" justify="space-between">
        <Flex gap={6} align="flex-end" justify="start">
          <RouterLink to={"/"}>
            <Heading textAlign="center" size="xl" mx={2}>
              My App
            </Heading>
          </RouterLink>
          <HStack as={"nav"} gap={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </Flex>

        <Flex align="center">
          <Stack direction="row" gap="6" align="center">
            {/* Dark Mode */}
            <Button onClick={toggleColorMode} size="sm">
              {colorMode === "light" ? <FiMoon /> : <FiSun />}
            </Button>
            <Button onClick={onOpen} size="sm">
              Cart({cartProducts.totalQuantity})
            </Button>

            {token ? (
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button rounded="full" variant="ghost" minW="0">
                    <Avatar.Root size="sm">
                      <Avatar.Image src="https://api.dicebear.com/9.x/toon-head/svg?seed=Maria" />
                      <Avatar.Fallback name="Username" />
                    </Avatar.Root>
                  </Button>
                </Menu.Trigger>

                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Center py="4">
                        <Avatar.Root size="sm">
                          <Avatar.Image src="https://api.dicebear.com/9.x/toon-head/svg?seed=Maria" />
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

                      <Menu.Item
                        onClick={logoutHandler}
                        value="logout"
                        color="red.400"
                      >
                        Logout
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ) : (
              <RouterLink to={"/login"} replace>
                Login
              </RouterLink>
            )}
            {/* ✅ NEW MENU API */}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
