import { useColorModeValue } from "@/components/ui/color-mode";
import { Card, HStack, Link, Text } from "@chakra-ui/react";
import type { HTMLAttributes, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title: string;
  path?: string;
}

const DashboardCard = ({ children, title, path, ...arg }: IProps ) => {
  const hoverBg = useColorModeValue("blue.50", "gray.800");

  return (
    <Card.Root
      borderRadius="2xl"
      _hover={{ bg: hoverBg, scale: 1.02 }}
      transition={"all .1s ease-in"}
      {...arg}
    >
      <Card.Header>
        <HStack justifyContent={"space-between"} fontWeight="semibold">
          <Card.Title fontSize={"md"}>{title}</Card.Title>
          {path && (
            <Link
              as={RouterLink}
              to={path}
              outline="none"
              transition={"all .1s ease-in"}
              _hover={{
                textDecoration: "none",
              }}
              color={"blue.500"}
            >
              <Text textStyle="sm">View all</Text>
            </Link>
          )}
        </HStack>
      </Card.Header>
      <Card.Body pt={2}>{children}</Card.Body>
    </Card.Root>
  );
};

export default DashboardCard;
