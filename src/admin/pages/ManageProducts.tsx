import { Box, Heading } from "@chakra-ui/react";
import ProductsTable from "../common/Components/ProductsTable";

const ManageProducts = () => {
  return (
    <Box>
      <Heading as="h1" size={"xl"} my={4}>
        Products
      </Heading>
      <ProductsTable />
    </Box>
  );
};

export default ManageProducts;
