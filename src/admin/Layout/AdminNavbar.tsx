import {
  Flex,
  Avatar,
  Menu,
  Portal,
  HStack,
  Text,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { useColorMode } from "../../components/ui/color-mode";
import { FiMoon, FiSun } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import CookieService from "@/services/CookieService";
import { useOutletContext } from "react-router-dom";
import type { IUserData } from "@/interfaces";

export default function AdminNavbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const token = CookieService.get("jwt");
  const user = useOutletContext<IUserData>();

  const logoutHandler = () => {
    CookieService.remove("jwt");
    window.location.reload();
  };

  return (
    <Flex h={"full"} align={"center"} justify="flex-end" gap={2}>
      {/* Dark Mode */}
      <IconButton
        onClick={toggleColorMode}
        size="md"
        variant={"ghost"}
        rounded={"full"}
      >
        {colorMode === "light" ? <FiMoon /> : <FiSun />}
      </IconButton>
      <IconButton p={"none"} size="md" variant={"ghost"} rounded={"full"}>
        <IoMdNotificationsOutline />
      </IconButton>
      {token && (
        <Menu.Root>
          <Menu.Trigger asChild h={"auto"}>
            <IconButton
              variant="plain"
              outline="none"
              size="md"
              mx={2}
            >
              <Avatar.Root >
                <Avatar.Image
                  src={`${import.meta.env.VITE_SERVER_URL}${user?.avatar?.url}`}
                />
                <Avatar.Fallback name={user?.fullName} />
              </Avatar.Root>
            </IconButton>
          </Menu.Trigger>

          <Portal>
            <Menu.Positioner>
              <Menu.Content minW={"200px"}>
                <Menu.Item value="userData" justifyContent={"uset"}>
                  <HStack py={1}>
                    <Avatar.Root boxSize="80px">
                      <Avatar.Image
                        src={`${import.meta.env.VITE_SERVER_URL}${user?.avatar?.url}`}
                      />
                      <Avatar.Fallback name={user?.fullName} />
                    </Avatar.Root>
                    <VStack align={"left"} textAlign={"left"}>
                      <Text>{user?.fullName}</Text>
                      <Text
                        color="fg.muted"
                        textStyle="sm"
                        maxInlineSize={"160px"}
                        overflow={"hidden"}
                        textOverflow={"ellipsis"}
                        whiteSpace={"nowrap"}
                      >
                        {user?.email}
                      </Text>
                    </VStack>
                  </HStack>
                </Menu.Item>
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
