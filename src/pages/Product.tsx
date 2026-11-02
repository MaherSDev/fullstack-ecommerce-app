import { Button, Card, Image, Text, Box, HStack } from "@chakra-ui/react";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { useGetSingleProductQuery } from "@/app/services/products";
import ProductSalePrice from "@/components/ui/ProductSalePrice";

const ProductPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const { isLoading, data, error } = useGetSingleProductQuery(documentId);

  const goBack = () => navigate(-1);

  if (isLoading) return <ProductSkeleton />;

  if (error || !data) {
    return <>Error</>;
  }

  const { title, description, thumbnail, price, discount } = data.data;

  return (
    <Box p={4} maxW={"lg"} mx={"auto"} h="full">
      <Button
        alignItems={"center"}
        as="button"
        variant={"ghost"}
        _hover={{ bg: "transparent" }}
        fontSize={"lg"}
        p={0}
        onClick={goBack}
      >
        <BsArrowLeft />
        Back
      </Button>
      <Card.Root
        maxW={"lg"}
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
          <ProductSalePrice price={price} discount={discount} />
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default ProductPage;
