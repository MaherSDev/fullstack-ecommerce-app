import {
  useGetDashboardProductsQuery,
  useDeleteDashboardProductsMutation,
} from "@/app/services/products";
import { AiOutlineEye } from "react-icons/ai";
import { MdOutlineDownloadDone } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import type { IProduct } from "@/interfaces";
import {
  ActionBar,
  Button,
  Checkbox,
  IconButton,
  Image,
  Kbd,
  Portal,
  Table,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertDialog from "@/shared/AlertDialog";
import ModalDialog from "@/shared/ModalDialog";

const ProductsTable = () => {
  const [selection, setSelection] = useState<string[]>([]);
  const [clickedProductId, setClickedProductId] = useState<string>("");
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: openModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const [onDeleteHandler, { isLoading: isDeleting, isSuccess }] =
    useDeleteDashboardProductsMutation();
  const { isLoading, data, error } = useGetDashboardProductsQuery({ page: 1 });

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < data.data.length;

  const rows = data?.data.map((product: IProduct) => (
    <Table.Row
      key={product.id}
      data-selected={selection.includes(product.title) ? "" : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(product.title)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, product.title]
                : selection.filter((name) => name !== product.title),
            );
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>
        <Image
          src={`${import.meta.env.VITE_SERVER_URL}${product.thumbnail?.url}`}
          alt={product.thumbnail?.alternativeText}
          boxSize={"40px"}
          borderRadius={"full"}
          objectFit={"cover"}
        />
      </Table.Cell>
      <Table.Cell>{product.title}</Table.Cell>
      <Table.Cell>
        {product.categories.map((cat) => (
          <span key={cat.id}>{cat.title}</span>
        ))}
      </Table.Cell>
      <Table.Cell>${product.price}</Table.Cell>
      <Table.Cell>{product.stock}</Table.Cell>
      <Table.Cell>
        <IconButton
          as={Link}
          to={`/products/${product.documentId}`}
          variant="solid"
          colorPalette={"purple"}
          mr={3}
          onClick={() => {}}
        >
          <AiOutlineEye size={17} />
        </IconButton>
        <IconButton
          variant="solid"
          colorPalette={"red"}
          mr={3}
          onClick={() => {
            setClickedProductId(product.documentId);
            onOpen();
          }}
        >
          <BsTrash size={17} />
        </IconButton>
        <IconButton
          variant="solid"
          colorPalette={"blue"}
          onClick={() => {
            setClickedProductId(product.documentId);
            onOpenModal();
          }}
        >
          <FiEdit size={17} />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  ));

  if (error) return "No Data Found";

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="6">
              <Checkbox.Root
                size="sm"
                top="0.5"
                aria-label="Select all rows"
                checked={indeterminate ? "indeterminate" : selection.length > 0}
                onCheckedChange={(changes) => {
                  setSelection(
                    changes.checked
                      ? data.data.map((product: IProduct) => product.title)
                      : [],
                  );
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader>image</Table.ColumnHeader>
            <Table.ColumnHeader>Title</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Price</Table.ColumnHeader>
            <Table.ColumnHeader>Stock</Table.ColumnHeader>
            <Table.ColumnHeader>Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table.Root>

      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selection.length} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                Delete <Kbd>⌫</Kbd>
              </Button>
              <Button variant="outline" size="sm">
                Share <Kbd>T</Kbd>
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
      <AlertDialog
        isOpen={open}
        onClose={onClose}
        description={
          "This action cannot be undone. This will permanently remove the product."
        }
        title={"Are you sure to remove this product?"}
        okText={{ icon: <BsTrash size={17} />, text: "Delete" }}
        onDeleteHandler={() => onDeleteHandler(clickedProductId)}
        isLoading={isDeleting}
      />
      <ModalDialog
        isOpen={openModal}
        onClose={onCloseModal}
        title={"Update product"}
        okText={{ icon: <MdOutlineDownloadDone size={17} />, text: "Save" }}
        onDeleteHandler={() => onDeleteHandler(clickedProductId)}
        isLoading={isDeleting}
      >
        <p>Children</p>
      </ModalDialog>
    </>
  );
};

export default ProductsTable;
