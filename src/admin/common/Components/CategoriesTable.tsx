import {
  useGetDashboardCategoriesQuery,
  useDeleteDashboardCategoriesMutation,
  useUpdateDashboardCategoriesMutation,
  useCreateDashboardCategoriesMutation,
} from "@/app/services/categories";
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
  For,
  HStack,
  IconButton,
  Input,
  NativeSelect,
  Portal,
  Table,
  Tag,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AlertDialog from "@/shared/AlertDialog";
import ModalDialog from "@/shared/ModalDialog";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useGetDashboardProductsQuery } from "@/app/services/products";
import type React from "react";

const CategoriesTable = () => {
  const categoryDefaultValues = {
    documentId: "",
    title: "",
    description: "",
    products: [],
  };

  const border = useColorModeValue("gray.200", "gray.500");
  const bg = useColorModeValue("gray.300", "gray.800");
  const color = useColorModeValue("gray.800", "gray.100");
  const [selection, setSelection] = useState<string[]>([]);
  const [clickedCategoryId, setClickedCategoryId] = useState<string>("");

  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: openModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const [
    onDeleteHandler,
    { isLoading: isDeleting, isSuccess: isSuccessDeleting },
  ] = useDeleteDashboardCategoriesMutation();
  const [onUpdateHandler, { isSuccess: isSuccessUpdating }] =
    useUpdateDashboardCategoriesMutation();
  const [onCreateHandler, { isSuccess: isSuccessCreating }] =
    useCreateDashboardCategoriesMutation();
  const { isLoading, data, error } = useGetDashboardCategoriesQuery({
    page: 1,
  });
  const { data: products } = useGetDashboardProductsQuery({ page: 1 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ICategory>({
    defaultValues: categoryDefaultValues,
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

  const handleSubmitCategory: SubmitHandler<ICategory> = async (data, e) => {
    e?.preventDefault();

    const payload = {
      data: {
        title: data.title,
        description: data.description,
        products: data.products?.map((c) => c.id) || [],
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

  const onDeleteSelectedCategories = () => {
    if (selection.length) {
      selection.forEach((id) => onDeleteHandler(id));
      return setSelection([]);
    }
    onDeleteHandler(clickedCategoryId);
  };

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < data.data.length;

  const rows = data?.data.map((category: ICategory) => (
    <Table.Row
      key={category.id}
      data-selected={selection.includes(category.documentId) ? "" : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(category.documentId)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, category.documentId]
                : selection.filter((name) => name !== category.documentId),
            );
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{category.title}</Table.Cell>
      <Table.Cell>{category.description}</Table.Cell>
      <Table.Cell>
        <IconButton
          variant="solid"
          colorPalette={"red"}
          mr={3}
          onClick={() => {
            setClickedCategoryId(category.documentId);
            onOpen();
          }}
        >
          <BsTrash size={17} />
        </IconButton>
        <IconButton
          variant="solid"
          colorPalette={"blue"}
          onClick={() => {
            reset(category);
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
            reset(categoryDefaultValues);
            onOpenModal();
          }}
        >
          Create Category
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
                      ? data.data.map(
                          (category: ICategory) => category.documentId,
                        )
                      : [],
                  );
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader>Title</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader w={"fit-content"}>Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table.Root>
      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner zIndex={2}>
            <ActionBar.Content bg={bg} color={color}>
              <ActionBar.SelectionTrigger borderColor={color}>
                {selection.length} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator bg={color} />
              <Button
                variant="outline"
                size="sm"
                colorPalette={"red"}
                onClick={onOpen}
              >
                Delete <BsTrash size={17} />
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
      <AlertDialog
        isOpen={open}
        onClose={onClose}
        description={
          "This action cannot be undone. This will permanently remove the category."
        }
        title={"Are you sure to remove this category?"}
        okText={{ icon: <BsTrash size={17} />, text: "Delete" }}
        onDeleteHandler={onDeleteSelectedCategories}
        isLoading={isDeleting}
      />
      <ModalDialog
        isOpen={openModal}
        isLoading={isSubmitting}
        title={"Update category"}
        okText={{ icon: <MdOutlineDownloadDone size={17} />, text: "Save" }}
        onSave={handleSubmit(handleSubmitCategory)}
        onClose={onCloseModal}
      >
        {/* Title */}
        <VStack flex={"1 60%"} gap={3}>
          <Field.Root invalid={!!errors.title}>
            <Field.Label fontWeight={"meduim"}>Category Title</Field.Label>
            <Input
              placeholder="Category title"
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
              placeholder="Category description"
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
          {/* Product */}
          <Field.Root invalid={!!errors.products}>
            <Controller
              control={control}
              name="products"
              render={({ field }) => (
                <>
                  <Field.Label>Products</Field.Label>
                  <NativeSelect.Root size="sm" width="240px">
                    <NativeSelect.Field
                      placeholder="Select option"
                      value=""
                      onChange={(e) => {
                        const selected = products.data.find(
                          (c: IProduct) => c.documentId === e.target.value,
                        );
                        field.onChange([...(field.value || []), selected]);
                      }}
                    >
                      <For each={products.data}>
                        {(product: IProduct) => (
                          <option
                            key={product.documentId}
                            value={product.documentId}
                            disabled={
                              field.value.find(
                                (exist) =>
                                  exist.documentId === product.documentId,
                              )
                                ? true
                                : false
                            }
                          >
                            {product.title}
                          </option>
                        )}
                      </For>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  <HStack>
                    <For each={field.value || []}>
                      {(product) => (
                        <Tag.Root key={product.documentId} size={"lg"}>
                          <Tag.Label textTransform={"capitalize"}>
                            {product.title}
                          </Tag.Label>
                          <Tag.EndElement h={10}>
                            <Tag.CloseTrigger
                              h={"full"}
                              _hover={{ color: "red.500", cursor: "pointer" }}
                              onClick={() => {
                                field.onChange(
                                  field.value.filter(
                                    (p: IProduct) =>
                                      p.documentId !== product.documentId,
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
            <Field.ErrorText>{errors.products?.message}</Field.ErrorText>
          </Field.Root>
        </VStack>
      </ModalDialog>
    </>
  );
};

export default CategoriesTable;
