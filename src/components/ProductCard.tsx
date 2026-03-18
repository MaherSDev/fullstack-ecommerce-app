import { Button, Card, Image, Text } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import { Link } from "react-router-dom";

interface IProps {
  thumbnail: {
    url: string;
  };
}

const ProductCard = ({ thumbnail }: IProps) => {
  const { colorMode } = useColorMode();

  return (
    <Card.Root
      padding={3}
      border={"1px solid gray"}
      bg={"none"}
      overflow="hidden"
      textAlign={"center"}
    >
      <Image
        src={`${import.meta.env.VITE_SERVER_URL}${thumbnail?.url}`}
        alt="Green double couch with wooden legs"
        boxSize={"200px"}
        borderRadius={"full"}
        objectFit={"cover"}
        mx={"auto"}
      />
      <Card.Body gap={2} mt={2} fontSize={"sm"}>
        <Card.Title>Living room Sofa</Card.Title>
        <Card.Description>
          This sofa is perfect for modern tropical spaces, baroque inspired
          spaces.
        </Card.Description>
        <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
          $450
        </Text>
      </Card.Body>
      <Card.Footer>
        <Button
          as={Link}
          to={"/products/1"}
          bg={colorMode === "light" ? "#e6f3fd" : "#9f7aea"}
          color={colorMode !== "light" ? "#e6f3fd" : "#9f7aea"}
          variant="outline"
          w={"full"}
          border={"none"}
          py={5}
          mt={6}
          overflow={"hidden"}
          _hover={{
            bg: colorMode !== "light" ? "#e6f3fd" : "#9f7aea",
            color: colorMode == "light" ? "#e6f3fd" : "#9f7aea",
            border: "none",
          }}
        >
          view details
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default ProductCard;
