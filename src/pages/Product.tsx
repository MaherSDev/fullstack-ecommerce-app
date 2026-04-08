import { Button, Card, Flex, Image, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { useColorMode } from "../components/ui/color-mode";
import axiosInstance from "@/api/axios.config";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/features/cartSlice";
import { onOpenCartDrawerAction } from "@/app/features/globalSlice";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const getProductData = async () => {
    const { data } = await axiosInstance.get(`products/${documentId}`, {
      params: {
        populate: ["thumbnail", "categories"],
      },
    });
    return data;
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["products", documentId],
    queryFn: getProductData,
  });
  const goBack = () => navigate(-1);

  const cartHandler = () => {
    dispatch(addToCart(data.data));
    dispatch(onOpenCartDrawerAction());
  };

  if (isLoading) return <ProductSkeleton />;

  if (error || !data) {
    return <>Error</>;
  }

  const { title, description, thumbnail, price } = data.data;

  return (
    <>
      <Flex
        alignItems={"center"}
        maxW={"md"}
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
        maxW={"md"}
        mx={"auto"}
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
          <Card.Title>{title}</Card.Title>
          <Card.Description>{description}</Card.Description>
          <Text
            textStyle="2xl"
            fontWeight="medium"
            letterSpacing="tight"
            mt="2"
          >
            ${price}
          </Text>
        </Card.Body>
        <Card.Footer>
          <Button
            type="button"
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
            onClick={cartHandler}
          >
            Add to cart
          </Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
};

export default ProductPage;
