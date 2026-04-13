import { Box, Heading } from "@chakra-ui/react";
import ProductsTable from "../common/Components/ProductsTable";
import { useGetDashboardProductsQuery } from "@/app/services/apiSlice";

interface IProps {}

const ManageProducts = ({}: IProps) => {
  const { isLoading, data, error } = useGetDashboardProductsQuery({ page: 1 });

  console.log({ isLoading, data, error });

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
