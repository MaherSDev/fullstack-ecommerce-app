import {
  Box,
  Flex,
  Button,
  Stack,
  Avatar,
  Center,
  Menu,
  Portal,
  HStack,
  Heading,
  Circle,
  Float,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useColorMode } from "../components/ui/color-mode";
import { FiMoon, FiSun } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
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
    <RouterLink to={`/${children}`.toLowerCase()} replace>
      <Text
        fontWeight={"medium"}
        rounded={"md"}
        outline="none"
        _hover={{
          textDecoration: "none",
          color: { base: "blue.500", _dark: "blue.500" },
        }}
      >
        {children.toString()}
      </Text>
    </RouterLink>
  );

  const logoutHandler = () => {
    CookieService.remove("jwt");
    window.location.reload();
  };

  const onOpen = () => {
    dispatch(onOpenCartDrawerAction());
  };

  return (
    <Flex
      h="16"
      align="center"
      justify="space-between"
      w={"full"}
      maxW={"1440px"}
      mx={"auto"}
    >
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
          <IconButton
            onClick={onOpen}
            position={"relative"}
            cursor={"pointer"}
            unstyled
          >
            <FaShoppingCart size={"1.8rem"} />
            {cartProducts.totalQuantity ? (
              <Float
                right={`-${cartProducts.totalQuantity >= 10 ? cartProducts.totalQuantity.toString().length * 3 : 5}px`}
              >
                <Circle
                  minH="6"
                  minW="6"
                  w={`${cartProducts.totalQuantity >= 10 ? cartProducts.totalQuantity.toString().length * 12 : 24}px`}
                  bg="primary"
                  color="white"
                >
                  {cartProducts.totalQuantity}
                </Circle>
              </Float>
            ) : (
              ""
            )}
          </IconButton>

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
  );
}
