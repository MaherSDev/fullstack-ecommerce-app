import { Box, Heading } from "@chakra-ui/react";
import CategoriesTable from "../common/Components/CategoriesTable";

const ManageCategories = () => {
  return (
    <Box p={1}>
      <Heading as="h1" fontSize="2xl" fontWeight="bold" mb={10}>
        Categories
      </Heading>
      <CategoriesTable />
    </Box>
  );
};

export default ManageCategories;
