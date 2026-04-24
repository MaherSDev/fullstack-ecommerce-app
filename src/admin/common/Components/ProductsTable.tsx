import {
  useGetDashboardProductsQuery,
  useDeleteDashboardProductsMutation,
  useUpdateDashboardProductsMutation,
} from "@/app/services/products";
import { AiOutlineEye } from "react-icons/ai";
import { MdOutlineDownloadDone } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import type { IProduct, IProductForm } from "@/interfaces";
import {
  ActionBar,
  Box,
  Button,
  Checkbox,
  Field,
  FileUpload,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  Kbd,
  NumberInput,
  Portal,
  Table,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertDialog from "@/shared/AlertDialog";
import ModalDialog from "@/shared/ModalDialog";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useColorModeValue } from "@/components/ui/color-mode";
import { LuDollarSign, LuUpload } from "react-icons/lu";
import CookieService from "@/services/CookieService";
import axiosInstance from "@/api/axios.config";

interface IFile {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

interface IModalBody {
  body: "update" | "delete" | "create" | "";
}

const ProductsTable = () => {
  const productDefaultValues = {
    documentId: "",
    title: "",
    description: "",
    price: 0,
    stock: 0,
    thumbnail: null,
    categories: null,
  };
  const thumbnailDefaultValues = {
    lastModified: 0,
    name: "",
    size: 0,
    type: "",
  };

  const border = useColorModeValue("gray.200", "gray.500");
  const [modalBody, setModalBody] = useState<IModalBody>({ body: "create" });
  const [selection, setSelection] = useState<string[]>([]);
  const [clickedProductId, setClickedProductId] = useState<string>("");
  const [file, setFile] = useState<IFile>(thumbnailDefaultValues);
  const [productThumbnail, setProductThumbnail] = useState<
    IProductForm["thumbnail"]
  >({
    documentId: "",
    id: "",
    url: "",
    name: "",
    alternativeText: "",
  });
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: openModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const [
    onDeleteHandler,
    { isLoading: isDeleting, isSuccess: isSuccessDeleting },
  ] = useDeleteDashboardProductsMutation();
  const [
    onUpdateHandler,
    { isLoading: isUpdating, isSuccess: isSuccessUpdating },
  ] = useUpdateDashboardProductsMutation();
  const { isLoading, data, error } = useGetDashboardProductsQuery({ page: 1 });

  useEffect(() => {
    if (isSuccessDeleting) {
      onClose();
    }
    if (isSuccessUpdating) {
      onCloseModal();
    }
  }, [isSuccessDeleting, isSuccessUpdating, onCloseModal, onClose]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IProductForm>({
    defaultValues: productDefaultValues,
  });


  const onSubmitUpdating: SubmitHandler<IProductForm> = async (data, e) => {
    e?.preventDefault();

    const updatedData = {
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categories: data.categories?.map((c) => c.id) || [],
        thumbnail: data.thumbnail,
      },
    };

    if (file.size) {
      const formData = new FormData();
      formData.append("files", file);

      const { data: fileData } = await axiosInstance.post("upload", formData, {
        headers: {
          Authorization: `Bearer ${CookieService.get("jwt")}`,
        },
      });

      updatedData.data.thumbnail = fileData[0].id;
    }
    const { data: newData } = await onUpdateHandler({
      documentId: data.documentId,
      body: updatedData,
    });
    if (newData.data) {
      setFile(thumbnailDefaultValues);
    }
  };

  const onSubmitCreating: SubmitHandler<IProductForm> = async (data, e) => {
    e?.preventDefault();

    const updatedData = {
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categories: data.categories?.map((c) => c.id) || [],
        thumbnail: data.thumbnail,
      },
    };

    if (file.size) {
      const formData = new FormData();
      formData.append("files", file);

      const { data: fileData } = await axiosInstance.post("upload", formData, {
        headers: {
          Authorization: `Bearer ${CookieService.get("jwt")}`,
        },
      });

      updatedData.data.thumbnail = fileData[0].id;
    }
    const { data: newData } = await onUpdateHandler({
      documentId: data.documentId,
      body: updatedData,
    });
    if (newData.data) {
      setFile(thumbnailDefaultValues);
    }
  };

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
            setModalBody({ body: "update" });
            reset(product);
            setProductThumbnail(getValues("thumbnail"));
            onOpenModal();
          }}
        >
          <FiEdit size={17} />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  ));

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, ": ", value);
    setValue(name, value);
  };

  const onCancelHandler = () => {
    setFile(thumbnailDefaultValues);
  }

  const changeThumbnailHandler = () => {
    setFile(thumbnailDefaultValues);
    setProductThumbnail({
      documentId: "",
      id: "",
      url: "",
      name: "",
      alternativeText: "",
    });
  };

  const cancelThumbnailHandler = () => {
    setFile(thumbnailDefaultValues);
    setProductThumbnail(getValues("thumbnail"));
  };

  if (isLoading) return "Loading...";
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
        isLoading={isUpdating}
        title={"Update product"}
        okText={{ icon: <MdOutlineDownloadDone size={17} />, text: "Save" }}
        onSave={handleSubmit(
          modalBody.body === "update" ? onSubmitUpdating : onSubmitCreating,
        )}
        onClose={onCloseModal}
        onCancel={onCancelHandler}
      >
        <HStack gap={6}>
          <VStack flex={"1 40%"}>
            {productThumbnail?.url || file?.size ? (
              file?.size ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file?.name}
                  h={"260px"}
                  objectFit={"cover"}
                />
              ) : (
                <Image
                  src={`${import.meta.env.VITE_SERVER_URL}${productThumbnail?.url}`}
                  alt={productThumbnail?.name}
                  h={"260px"}
                  objectFit={"cover"}
                />
              )
            ) : (
              <FileUpload.Root
                h={"260px"}
                maxW="xl"
                alignItems="stretch"
                name="thumbnail"
                onFileAccept={({ files }): void => {
                  setFile(files[0]);
                }}
                accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
              >
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone>
                  <Icon size="md" color="fg.muted">
                    <LuUpload />
                  </Icon>
                  <FileUpload.DropzoneContent>
                    <Box>Drag and drop files here</Box>
                    <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                  </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
              </FileUpload.Root>
            )}
            <HStack mt={3}>
              <Button
                variant="solid"
                colorPalette={"blue"}
                mr={3}
                onClick={changeThumbnailHandler}
              >
                Change product image
              </Button>
              {!productThumbnail?.url || file.size ? (
                <Button
                  variant="solid"
                  colorPalette={"red"}
                  mr={3}
                  onClick={cancelThumbnailHandler}
                >
                  Cancel
                </Button>
              ) : (
                ""
              )}
            </HStack>
          </VStack>
          {/* Title */}
          <VStack flex={"1 60%"} gap={3}>
            <Field.Root invalid={!!errors.title}>
              <Field.Label fontWeight={"meduim"}>Product Title</Field.Label>
              <Input
                placeholder="Product title"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title should be at least 3 charachters",
                  },
                  onChange: onChangeHandler,
                })}
                borderColor={`${errors.title ? "red" : border}`}
              />
              <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
            </Field.Root>
            {/* Description */}
            <Field.Root invalid={!!errors.description}>
              <Field.Label>Description</Field.Label>
              <Textarea
                placeholder="Product description"
                {...register("description", {
                  required: "description is required",
                  minLength: {
                    value: 15,
                    message: "Description should be at least 15 charachters",
                  },
                  onChange: onChangeHandler,
                })}
                borderColor={`${errors.description ? "red" : border}`}
              />
              <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
            </Field.Root>
            {/* Price */}
            <Field.Root invalid={!!errors.price}>
              <Field.Label>Price</Field.Label>
              <Controller
                control={control}
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 1,
                    message: "Price must be at least 1",
                  },
                })}
                render={({ field }) => (
                  <NumberInput.Root
                    disabled={field.disabled}
                    name={field.name}
                    value={field.value.toString()}
                    onValueChange={({ value }) => {
                      field.onChange(value);
                    }}
                    min={1}
                  >
                    <NumberInput.Control />
                    <InputGroup startElement={<LuDollarSign />}>
                      <NumberInput.Input
                        borderColor={`${errors.price ? "red" : border}`}
                      />
                    </InputGroup>
                  </NumberInput.Root>
                )}
              />
              <Field.ErrorText>{errors.price?.message}</Field.ErrorText>
            </Field.Root>
            {/* Stock */}
            <Field.Root invalid={!!errors.stock}>
              <Field.Label>Stock</Field.Label>
              <Controller
                control={control}
                {...register("stock", {
                  required: "stock is required",
                  min: {
                    value: 1,
                    message: "Stock must be at least 1",
                  },
                })}
                render={({ field }) => (
                  <NumberInput.Root
                    disabled={field.disabled}
                    name={field.name}
                    value={field.value.toString()}
                    onValueChange={({ value }) => {
                      field.onChange(value);
                    }}
                    min={1}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input
                      borderColor={`${errors.stock ? "red" : border}`}
                    />
                  </NumberInput.Root>
                )}
              />
              <Field.ErrorText>{errors.stock?.message}</Field.ErrorText>
            </Field.Root>
          </VStack>
        </HStack>
      </ModalDialog>
    </>
  );
};

export default ProductsTable;
