import { Box, Heading } from "@chakra-ui/react";
import ProductsTable from "../common/Components/ProductsTable";

interface IProps {}

const ManageProducts = ({}: IProps) => {

  return (
    <Box>
      <Heading as="h1" size={"xl"} my={4}>
        Products Data
      </Heading>
      <ProductsTable />
    </Box>
  );
};

export default ManageProducts;
