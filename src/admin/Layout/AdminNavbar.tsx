import {
  Box,
  Flex,
  Button,
  Avatar,
  Center,
  Menu,
  Portal,
  HStack,
  Text,
  VStack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { useColorMode } from "../../components/ui/color-mode";
import { FiMoon, FiSun } from "react-icons/fi";
import { IoMdNotificationsOutline, IoIosArrowDown } from "react-icons/io";
import CookieService from "@/services/CookieService";

export default function AdminNavbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const token = CookieService.get("jwt");

  const logoutHandler = () => {
    CookieService.remove("jwt");
    window.location.reload();
  };

  return (
    <Flex h={"full"} align={"center"} justify="flex-end">
      {/* Dark Mode */}
      <Button onClick={toggleColorMode} size="md" variant={"ghost"} rounded={"full"}>
        {colorMode === "light" ? <FiMoon /> : <FiSun />}
      </Button>
      <IconButton p={"none"} size="md" variant={"ghost"} rounded={"full"}>
        <IoMdNotificationsOutline />
      </IconButton>
      {token && (
        <Menu.Root>
          <Menu.Trigger asChild h={"auto"}>
            <Button variant="ghost" outline="none">
              <HStack py={1}>
                <Avatar.Root size="sm">
                  <Avatar.Image src="https://api.dicebear.com/9.x/toon-head/svg?seed=Maria" />
                  <Avatar.Fallback name="Username" />
                </Avatar.Root>
                <VStack align={"left"} textAlign={"left"}>
                  <Text>Admin Name</Text>
                  <Text textStyle={"xs"} fontWeight={"normal"}>
                    Admin
                  </Text>
                </VStack>
                <Icon alignSelf={"start"}>
                  <IoIosArrowDown />
                </Icon>
              </HStack>
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
      )}
    </Flex>
  );
}
