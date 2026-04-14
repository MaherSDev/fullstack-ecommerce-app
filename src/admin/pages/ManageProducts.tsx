import { Heading, useDisclosure } from "@chakra-ui/react";
import ProductsTable from "../common/Components/ProductsTable";
import AlertDialog from "@/shared/AlertDialog";

interface IProps {}

const ManageProducts = ({}: IProps) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Heading as="h1" size={"xl"} my={4}>
        Products Data
      </Heading>
      <ProductsTable onOpen={onOpen} />
      <AlertDialog isOpen={open} onClose={onClose} />
    </>
  );
};

export default ManageProducts;
