import { Grid } from "@chakra-ui/react";
import ProductCard from "./ProductCard";

interface IProps {}

const Products = ({}: IProps) => {
  return (
    <Grid
      margin={30}
      templateColumns={"repeat(auto-fill, minmax(320px, 1fr))"}
      gap={6}
    >
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </Grid>
  );
};

export default Products;
