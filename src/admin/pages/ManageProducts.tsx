import { Heading } from "@chakra-ui/react";
import ProductsTable from "../common/Components/ProductsTable";

const ManageProducts = () => {
  return (
    <>
      <Heading as="h1" size={"xl"} my={4}>
        Products Data
      </Heading>
      <ProductsTable />
    </>
  );
};

export default ManageProducts;
