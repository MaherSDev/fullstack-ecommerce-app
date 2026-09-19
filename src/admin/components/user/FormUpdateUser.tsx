import { Button, Flex, VStack, Icon } from "@chakra-ui/react";
import { useState } from "react";
import GeneralInfoForm from "./GeneralInfoForm";
import Address from "./addresses";
import LoginSecurityForm from "./LoginSecurityForm";
import { UserSidebarLinks } from "@/admin/common/constants";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { JSX } from "react/jsx-runtime";

interface IProps {
  userId: number | undefined;
}

const FormUpdateUser = ({ userId }: IProps) => {
  const textColor = useColorModeValue("gray.900", "gray.200");
  const hoverColor = useColorModeValue("gray.200", "gray.800");

  const [currentPath, setCurrentPath] = useState<string>("general");

  const formComponents: Record<string, JSX.Element> = {
    general: <GeneralInfoForm />,
    address: <Address userId={userId} />,
    "login-security": <LoginSecurityForm />,
  };

  return (
    <Flex h="-webkit-fill-available">
      <VStack flex={"1 25%"} paddingEnd={4}>
        <VStack gap={0} alignItems={"flex-start"} w={"full"}>
          {UserSidebarLinks.map(({ label, path, icon }, key) => (
            <Button
              key={key}
              fontWeight={"medium"}
              rounded={"md"}
              outline="none"
              transition={"all .1s ease-in"}
              bg={"none"}
              _hover={{
                textDecoration: "none",
                bg: hoverColor,
              }}
              color={path === currentPath ? "blue.500" : textColor}
              textAlign={"left"}
              justifyContent={"flex-start"}
              w={"full"}
              p={2}
              size={"xl"}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPath(path);
              }}
            >
              <Icon color={"inherit"} aria-label={label} size={"md"}>
                {icon}
              </Icon>
              {label}
            </Button>
          ))}
        </VStack>
      </VStack>
      <VStack
        flex={"1 75%"}
        gap={3}
        alignItems={"flex-start"}
        position="relative"
      >
        {formComponents[currentPath]}
      </VStack>
    </Flex>
  );
};

export default FormUpdateUser;
