import { Grid } from "@chakra-ui/react";
import axios from "axios";
import ProductCard from "./ProductCard";
import type { IProduct } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import ProductSkeleton from "./ui/ProductSkeleton";

interface IProps {}

const Products = ({}: IProps) => {
  const getProductsList = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/products?populate=thumbnail`,
    );
    return data;
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsList,
  });

  return (
    <Grid
      margin={30}
      templateColumns={"repeat(auto-fill, minmax(320px, 1fr))"}
      gap={6}
    >
      {isLoading ? (
        <>
          {Array.from({ length: 8 }, (_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </>
      ) : (
        <>
          {data.data.map((product: IProduct) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </>
      )}
    </Grid>
  );
};

export default Products;
