import { Button, Card, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProductSkeleton from "./ui/ProductSkeleton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { useColorMode } from "./ui/color-mode";

interface IProps {}

const ProductPage = ({}: IProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const getProductData = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/products/${id}`,
      {
        params: {
          populate: ["thumbnail", "category"],
        },
      },
    );
    return data;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["products", id],
    queryFn: getProductData,
  });
  const goBack = () => navigate(-1);

  if (isLoading) return <ProductSkeleton />;

  console.log(data);
  return (
    <>
      <Flex
        alignItems={"center"}
        maxW={"sm"}
        mx={"auto"}
        my={7}
        fontSize={"lg"}
        cursor={"pointer"}
        onClick={goBack}
      >
        <BsArrowLeft />
        <Text ml={2}>Back</Text>
      </Flex>
      <Card.Root
        padding={3}
        border={"1px solid gray"}
        bg={"none"}
        overflow="hidden"
        textAlign={"center"}
      >
        <Image
          // src={`${import.meta.env.VITE_SERVER_URL}${thumbnail?.url}`}
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
          <Text
            textStyle="2xl"
            fontWeight="medium"
            letterSpacing="tight"
            mt="2"
          >
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
    </>
  );
};

export default ProductPage;
