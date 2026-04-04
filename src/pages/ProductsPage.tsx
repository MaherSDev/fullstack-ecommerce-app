import { Grid } from "@chakra-ui/react";
import ProductCard from "../components/ProductCard";
import type { IProduct } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import axiosInstance from "@/api/axios.config";

const Products = () => {
  const getProductsList = async () => {
    const { data } = await axiosInstance.get(`products`, {
      params: {
        populate: ["thumbnail", "categories"],
      },
    });
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
