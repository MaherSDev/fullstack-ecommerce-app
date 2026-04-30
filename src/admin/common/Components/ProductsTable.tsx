import {
  useGetDashboardProductsQuery,
  useDeleteDashboardProductsMutation,
  useUpdateDashboardProductsMutation,
  useCreateDashboardProductsMutation,
} from "@/app/services/products";
import { AiOutlineEye } from "react-icons/ai";
import { MdOutlineDownloadDone } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import type { ICategory, IProduct } from "@/interfaces";
import {
  ActionBar,
  Box,
  Button,
  Checkbox,
  Field,
  FileUpload,
  For,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  Kbd,
  NativeSelect,
  NumberInput,
  Portal,
  Table,
  Tag,
  Text,
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
import { useGetDashboardCategoriesQuery } from "@/app/services/categories";
import type React from "react";
import { useCreateDashboardMediaMutation } from "@/app/services/media";

const ProductsTable = () => {
  const productDefaultValues = {
    id: "",
    documentId: "",
    title: "",
    description: "",
    price: 0,
    stock: 0,
    categories: [],
  };

  const border = useColorModeValue("gray.200", "gray.500");
  const [selection, setSelection] = useState<string[]>([]);
  const [clickedProductId, setClickedProductId] = useState<string>("");

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
  const [onUpdateHandler, { isSuccess: isSuccessUpdating }] =
    useUpdateDashboardProductsMutation();
  const [onCreateHandler, { isSuccess: isSuccessCreating }] =
    useCreateDashboardProductsMutation();
  const [onUploadHandler] = useCreateDashboardMediaMutation();
  const { isLoading, data, error } = useGetDashboardProductsQuery({ page: 1 });
  const { data: categories } = useGetDashboardCategoriesQuery({ page: 1 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IProduct>({
    defaultValues: productDefaultValues,
  });

  useEffect(() => {
    if (isSuccessDeleting) {
      onClose();
    }
    if (isSuccessUpdating) {
      onCloseModal();
    }
    if (isSuccessCreating) {
      reset();
      onCloseModal();
    }
  }, [
    isSuccessDeleting,
    isSuccessUpdating,
    isSuccessCreating,
    onCloseModal,
    onClose,
    reset,
  ]);

  const handleSubmitProduct: SubmitHandler<IProduct> = async (data, e) => {
    e?.preventDefault();

    let thumbnailId = data.thumbnail;

    if (data.thumbnail instanceof File) {
      const formData = new FormData();
      formData.append("files", data.thumbnail);
      formData.append(
        "fileInfo",
        JSON.stringify({
          alternativeText: data.thumbnail.name.replace(/\.[^/.]+$/, ""),
        }),
      );
      const { data: fileData } = await onUploadHandler(formData);
      thumbnailId = fileData[0].id;
    }

    const payload = {
      data: {
        title: data.title,
        description: data.description,
        price: +data.price,
        stock: +data.stock,
        categories: data.categories?.map((c) => c.id) || [],
        thumbnail: thumbnailId || null,
      },
    };

    const action = data.documentId
      ? onUpdateHandler({
          documentId: data.documentId,
          body: payload,
        })
      : onCreateHandler({
          body: payload,
        });

    const { data: response } = await action;

    if (response?.data) {
      reset();
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
          checked={selection.includes(product.documentId)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, product.documentId]
                : selection.filter((name) => name !== product.documentId),
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
        {product.categories?.map((cat: ICategory) => (
          <Text
            color={"blue.400"}
            fontWeight={"semibold"}
            textTransform={"capitalize"}
            as={"span"}
            key={cat.id}
            _notLast={{ _after: { content: '", "' } }}
          >
            {cat.title}
          </Text>
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
            reset(product);
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
    setValue(name, value);
  };

  if (isLoading) return "Loading...";
  if (error) return "No Data Found";

  return (
    <>
      <Box>
        <Button
          variant="solid"
          colorPalette={"blue"}
          mr={3}
          loading={isLoading}
          onClick={() => {
            reset(productDefaultValues);
            onOpenModal();
          }}
        >
          Create Product
        </Button>
      </Box>
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
                      ? data.data.map((product: IProduct) => product.documentId)
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
        isLoading={isSubmitting}
        title={"Update product"}
        okText={{ icon: <MdOutlineDownloadDone size={17} />, text: "Save" }}
        onSave={handleSubmit(handleSubmitProduct)}
        onClose={onCloseModal}
      >
        <HStack gap={6}>
          <VStack flex="1 40%">
            <Controller
              control={control}
              name="thumbnail"
              rules={{
                required: "Image is required",
                validate: (file) =>
                  !file ||
                  file.size <= 5 * 1024 * 1024 ||
                  "Max file size is 5MB",
              }}
              render={({ field }) => {
                const previewUrl =
                  field.value instanceof File
                    ? URL.createObjectURL(field.value)
                    : field.value?.url
                      ? `${import.meta.env.VITE_SERVER_URL}${field.value?.url}`
                      : null;

                return (
                  <>
                    {/* Preview OR Upload */}
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="thumbnail"
                        h="260px"
                        objectFit="cover"
                      />
                    ) : (
                      <Field.Root invalid={!!errors.thumbnail}>
                        <FileUpload.Root
                          h="260px"
                          maxW="xl"
                          alignItems="stretch"
                          accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                          onFileAccept={({ files }) => {
                            const file = files?.[0];
                            if (!file) return;

                            field.onChange(file);
                          }}
                        >
                          <FileUpload.HiddenInput />

                          <FileUpload.Dropzone
                            border={errors.thumbnail && "1px dashed red"}
                          >
                            <Icon size="md" color="fg.muted">
                              <LuUpload />
                            </Icon>

                            <FileUpload.DropzoneContent>
                              <Box>Drag and drop files here</Box>
                              <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                              <Field.ErrorText>
                                {errors.thumbnail?.message}
                              </Field.ErrorText>
                            </FileUpload.DropzoneContent>
                          </FileUpload.Dropzone>
                        </FileUpload.Root>
                      </Field.Root>
                    )}

                    {/* Actions */}
                    <HStack mt={3}>
                      <Button
                        variant="solid"
                        colorPalette="blue"
                        onClick={() => {
                          field.onChange(null);
                        }}
                      >
                        Change product image
                      </Button>

                      {field.value && (
                        <Button
                          variant="solid"
                          colorPalette="red"
                          onClick={() => {
                            field.onChange(null);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </HStack>
                  </>
                );
              }}
            />
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
                  required: "Description is required",
                  minLength: {
                    value: 8,
                    message: "Description should be at least 8 characters",
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
                name="price"
                rules={{
                  required: "Price is required",
                  min: {
                    value: 1,
                    message: "Price can not be 0",
                  },
                }}
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
                name="stock"
                rules={{
                  required: "stock is required",
                  min: {
                    value: 1,
                    message: "Stock can not be 0",
                  },
                }}
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
            {/* Category */}
            <Field.Root invalid={!!errors.categories}>
              <Controller
                control={control}
                name="categories"
                render={({ field }) => (
                  <>
                    <Field.Label>Categories</Field.Label>
                    <NativeSelect.Root size="sm" width="240px">
                      <NativeSelect.Field
                        placeholder="Select option"
                        value=""
                        onChange={(e) => {
                          const selected = categories.data.find(
                            (c: ICategory) => c.documentId === e.target.value,
                          );
                          field.onChange([...(field.value || []), selected]);
                        }}
                      >
                        <For each={categories.data}>
                          {(cat: ICategory) => (
                            <option
                              key={cat.documentId}
                              value={cat.documentId}
                              disabled={
                                field.value.find(
                                  (exist) =>
                                    exist.documentId === cat.documentId,
                                )
                                  ? true
                                  : false
                              }
                            >
                              {cat.title}
                            </option>
                          )}
                        </For>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <HStack>
                      <For each={field.value || []}>
                        {(cat) => (
                          <Tag.Root key={cat.documentId} size={"lg"}>
                            <Tag.Label textTransform={"capitalize"}>
                              {cat.title}
                            </Tag.Label>
                            <Tag.EndElement h={10}>
                              <Tag.CloseTrigger
                                h={"full"}
                                _hover={{ color: "red.500", cursor: "pointer" }}
                                onClick={() => {
                                  field.onChange(
                                    field.value.filter(
                                      (c: ICategory) =>
                                        c.documentId !== cat.documentId,
                                    ),
                                  );
                                }}
                              />
                            </Tag.EndElement>
                          </Tag.Root>
                        )}
                      </For>
                    </HStack>
                  </>
                )}
              />
              <Field.ErrorText>{errors.categories?.message}</Field.ErrorText>
            </Field.Root>
          </VStack>
        </HStack>
      </ModalDialog>
    </>
  );
};

export default ProductsTable;
