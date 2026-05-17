import { Box, Heading } from "@chakra-ui/react";
import ProductsTable from "../common/Components/ProductsTable";

const ManageProducts = () => {
  return (
    <Box p={1}>
      <Heading as="h1" fontSize="2xl" fontWeight="bold" mb={10}>
        Products
      </Heading>
      <ProductsTable />
    </Box>
  );
};

export default ManageProducts;
