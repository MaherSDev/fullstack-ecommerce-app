import { Heading, useDisclosure } from "@chakra-ui/react";
import ProductsTable from "../common/Components/ProductsTable";
import AlertDialog from "@/shared/AlertDialog";
import { BsTrash } from "react-icons/bs";

interface IProps {}

const ManageProducts = ({}: IProps) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Heading as="h1" size={"xl"} my={4}>
        Products Data
      </Heading>
      <ProductsTable onOpen={onOpen} />
      <AlertDialog
        isOpen={open}
        onClose={onClose}
        description={
          "This action cannot be undone. This will permanently remove the product."
        }
        title={"Are you sure to remove this product?"}
        okText={{ icon: <BsTrash size={17} />, text: "Delete" }}
      />
    </>
  );
};

export default ManageProducts;
