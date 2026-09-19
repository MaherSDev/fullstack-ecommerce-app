import { Box, Heading } from "@chakra-ui/react";
import UsersTable from "../components/UsersTable";

const ManageUsers = () => {
  return (
    <Box p={1}>
      <Heading as="h1" fontSize="2xl" fontWeight="bold" mb={10}>
        Users
      </Heading>
      <UsersTable />
    </Box>
  );
};

export default ManageUsers;
