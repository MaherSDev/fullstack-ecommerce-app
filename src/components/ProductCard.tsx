import { Card, Image, Link } from "@chakra-ui/react";
import { } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom";
import type { IProduct } from "@/interfaces";
import AddToCartButton from "./ui/AddToCartButton";
import ProductSalePrice from "./ui/ProductSalePrice";

const ProductCard = (product: IProduct) => {
  const { documentId, title, thumbnail, price, discount } =
    product;

  return (
    <Card.Root
      padding={3}
      border={"1px solid gray"}
      bg={"none"}
      overflow="hidden"
      textAlign={"center"}
    >
      <Card.Body gap={2} p={0} fontSize={"sm"}>
        <RouterLink to={`/products/${documentId}`}>
          <Image
            src={`${import.meta.env.VITE_SERVER_URL}${thumbnail?.url}`}
            alt={thumbnail?.alternativeText || title}
            h={"200px"}
            objectFit={"contain"}
            mx={"auto"}
          />
        </RouterLink>
        <Card.Title as={"h2"} minH={"3rem"} lineHeight={1.5}>
          <Link
            asChild
            transition={"all ease-in-out .2s"}
            _hover={{ color: "hover-text" }} 
            lineClamp="2" 
            fontSize={"1rem"}
          >
            <RouterLink to={`/products/${documentId}`}>{title}</RouterLink>
          </Link>
        </Card.Title>
        <ProductSalePrice price={price} discount={discount} />
      </Card.Body>
      <Card.Footer p={0} >
        <AddToCartButton product={product} />
      </Card.Footer>
    </Card.Root>
  );
};

export default ProductCard;
