import { Box, Heading } from "@chakra-ui/react";
import CategoriesTable from "../common/Components/CategoriesTable";

const ManageCategories = () => {
  return (
    <Box>
      <Heading as="h1" size={"xl"} my={4}>
        Categories
      </Heading>
      <CategoriesTable />
    </Box>
  );
};

export default ManageCategories;
