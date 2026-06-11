import {
  useGetDashboardUsersQuery,
  useDeleteDashboardUserMutation,
  useUpdateDashboardUserMutation,
  useCreateDashboardUserMutation,
  useGetDashboardSingleUserQuery,
} from "@/app/services/user";
import { MdOutlineDownloadDone } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { FiEdit, FiEye, FiEyeOff } from "react-icons/fi";
import type { IRole, IUserData } from "@/interfaces";
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
  Input,
  InputGroup,
  NativeSelect,
  Portal,
  Switch,
  Table,
  useDisclosure,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AlertDialog from "@/shared/AlertDialog";
import ModalDialog from "@/shared/ModalDialog";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useColorModeValue } from "@/components/ui/color-mode";
import { LuUpload } from "react-icons/lu";
import type React from "react";
import { useCreateDashboardMediaMutation } from "@/app/services/media";
import axiosInstance from "@/api/axios.config";
import CookieService from "@/services/CookieService";

const UsersTable = () => {
  const userDefaultValues = {
    id: 0,
    documentId: "",
    username: "",
    password: "",
    email: "",
    fullName: "",
    createdAt: "",
    confirmed: false,
    blocked: false,
    role: {},
    avatar: {},
    address: {},
  };

  const border = useColorModeValue("gray.200", "gray.500");
  const bg = useColorModeValue("gray.300", "gray.800");
  const color = useColorModeValue("gray.800", "gray.100");
  const colorTableBody = useColorModeValue("gray.700", "gray.400");
  const [roles, setRoles] = useState<IRole[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [clickedUserId, setClickedUserId] = useState<number>();

  const { data: currentUser } = useGetDashboardSingleUserQuery("");
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: openModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const [
    onDeleteHandler,
    { isLoading: isDeleting, isSuccess: isSuccessDeleting },
  ] = useDeleteDashboardUserMutation();
  const [onUpdateHandler, { isSuccess: isSuccessUpdating }] =
    useUpdateDashboardUserMutation();
  const [onCreateHandler, { isSuccess: isSuccessCreating }] =
    useCreateDashboardUserMutation();
  const [onUploadHandler, { isSuccess: isSuccessUploading }] =
    useCreateDashboardMediaMutation();
  const { isLoading, data, error } = useGetDashboardUsersQuery("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IUserData>({
    defaultValues: userDefaultValues,
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await axiosInstance.get("users-permissions/roles", {
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        });
        setRoles(data.roles);
        return data;
      } catch (error: any) {
        return console.error(
          error.response?.data?.message || "Error Fetching Roles",
        );
      }
    };
    if (isSuccessDeleting) {
      onClose();
    }
    if (isSuccessUpdating) {
      onCloseModal();
    }
    if (isSuccessCreating && isSuccessUploading) {
      reset();
      onCloseModal();
    }

    fetchRoles();
  }, [
    isSuccessDeleting,
    isSuccessUpdating,
    isSuccessCreating,
    isSuccessUploading,
    onCloseModal,
    onClose,
    reset,
  ]);

  const handleSubmitUser: SubmitHandler<IUserData> = async (data, e) => {
    e?.preventDefault();
    let avatarId = data.avatar;
    if (data.avatar instanceof File) {
      const formData = new FormData();
      formData.append("files", data.avatar);
      formData.append(
        "fileInfo",
        JSON.stringify({
          alternativeText: data.avatar.name.replace(/\.[^/.]+$/, ""),
        }),
      );
      const { data: fileData } = await onUploadHandler(formData);
      avatarId = fileData[0].id;
    }

    const payload = {
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      confirmed: data.confirmed,
      blocked: data.blocked,
      role: data.role,
      avatar: avatarId || null,
      address: data.address,
    };

    const action = data.id
      ? onUpdateHandler({
          id: data.id,
          body:
            currentUser?.role.type === "super_admin"
              ? payload
              : { confirmed: data.confirmed, blocked: data.blocked },
        })
      : onCreateHandler({
          body: payload,
        });

    const { data: response } = await action;

    if (response?.data) {
      reset();
    }
  };

  const onDeleteSelectedUsers = () => {
    if (selection.length) {
      selection.forEach((id) => onDeleteHandler(id));
      return setSelection([]);
    }
    onDeleteHandler(clickedUserId);
  };

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < data.length;

  const rows = data
    ?.filter(
      (me: IUserData) =>
        !["super_admin", currentUser.role.type].includes(me.role.type),
    )
    ?.map((user: IUserData) => (
      <Table.Row
        key={user.id}
        data-selected={selection.includes(user.id) ? "" : undefined}
        color={colorTableBody}
        fontWeight={"medium"}
        fontSize={"md"}
        className="users-table-row"
      >
        <Table.Cell>
          <Checkbox.Root
            size="sm"
            top="0.5"
            aria-label="Select row"
            checked={selection.includes(user.id)}
            onCheckedChange={(changes) => {
              setSelection((prev) =>
                changes.checked
                  ? [...prev, user.id]
                  : selection.filter((id) => id !== user.id),
              );
            }}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>
        </Table.Cell>
        <Table.Cell w={"70px"}>
          <Avatar.Root boxSize="40px">
            <Avatar.Image
              src={`${import.meta.env.VITE_SERVER_URL}${user?.avatar?.url}`}
              alt={user.avatar?.alternativeText}
            />
            <Avatar.Fallback name={user.fullName} />
          </Avatar.Root>
        </Table.Cell>
        <Table.Cell>{user.fullName}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell> {user.username}</Table.Cell>
        <Table.Cell color={user.blocked ? "red.500" : "green.500"}>
          {user.blocked ? "Banned" : "Active"}
        </Table.Cell>
        <Table.Cell>{user.role?.name}</Table.Cell>
        <Table.Cell>
          {new Date(user.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Table.Cell>
        <Table.Cell>
          {currentUser?.role.type === "super_admin" && (
            <IconButton
              variant="plain"
              colorPalette={"red"}
              mr={3}
              onClick={() => {
                setClickedUserId(user.id);
                onOpen();
              }}
            >
              <BsTrash size={17} />
            </IconButton>
          )}
          <IconButton
            variant="plain"
            colorPalette={"blue"}
            onClick={() => {
              reset(user);
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
            reset(userDefaultValues);
            onOpenModal();
          }}
        >
          Create User
        </Button>
      </Box>
      <Table.Root>
        <Table.Header>
          <Table.Row fontSize={"md"} textAlign="start">
            <Table.ColumnHeader w="6">
              <Checkbox.Root
                size="sm"
                top="0.5"
                aria-label="Select all rows"
                checked={indeterminate ? "indeterminate" : selection.length > 0}
                onCheckedChange={(changes) => {
                  setSelection(
                    changes.checked
                      ? data.map((user: IUserData) => user.id)
                      : [],
                  );
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader>Avatar</Table.ColumnHeader>
            <Table.ColumnHeader>Full Name</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Role</Table.ColumnHeader>
            <Table.ColumnHeader>Joined Date</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
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
              {currentUser?.role.type === "super_admin" && (
                <>
                  <ActionBar.Separator bg={color} />
                  <Button
                    variant="outline"
                    size="sm"
                    colorPalette={"red"}
                    onClick={onOpen}
                  >
                    Delete <BsTrash size={17} />
                  </Button>
                </>
              )}
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
      <AlertDialog
        isOpen={open}
        onClose={onClose}
        description={
          "This action cannot be undone. This will permanently remove the user."
        }
        title={"Are you sure to remove this user?"}
        okText={{ icon: <BsTrash size={17} />, text: "Delete" }}
        onDeleteHandler={onDeleteSelectedUsers}
        isLoading={isDeleting}
      />
      <ModalDialog
        isOpen={openModal}
        isLoading={isSubmitting}
        title={"Update user"}
        okText={{ icon: <MdOutlineDownloadDone size={17} />, text: "Save" }}
        onSave={handleSubmit(handleSubmitUser)}
        onClose={onCloseModal}
      >
        <HStack gap={6}>
          <VStack flex="1 40%">
            <Controller
              control={control}
              name="avatar"
              disabled={
                !!getValues("id") && currentUser?.role.type !== "super_admin"
              }
              rules={{
                validate: (file) =>
                  file && file.size >= 5 * 1024 * 1024
                    ? "Max file size is 5MB"
                    : true,
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
                      <Avatar.Root boxSize="260px" objectFit="cover">
                        <Avatar.Image
                          src={previewUrl}
                          alt={field.value.alternativeText}
                        />
                        <Avatar.Fallback name={field.value.name} />
                      </Avatar.Root>
                    ) : !!getValues("id") &&
                      currentUser?.role.type !== "super_admin" ? (
                      <Avatar.Root boxSize="260px">
                        <Avatar.Fallback name={getValues("fullName")} />
                      </Avatar.Root>
                    ) : (
                      <Field.Root invalid={!!errors.avatar}>
                        <FileUpload.Root
                          h="260px"
                          maxW="xl"
                          alignItems="stretch"
                          disabled={
                            !!getValues("id") &&
                            currentUser?.role.type !== "super_admin"
                          }
                          accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                          onFileAccept={({ files }) => {
                            const file = files[0];
                            if (!file) return;
                            field.onChange(file);
                          }}
                        >
                          <FileUpload.HiddenInput />

                          <FileUpload.Dropzone
                            border={errors.avatar && "1px dashed red"}
                          >
                            <Icon size="md" color="fg.muted">
                              <LuUpload />
                            </Icon>

                            <FileUpload.DropzoneContent>
                              <Box>Drag and drop files here</Box>
                              <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                              <Field.ErrorText>
                                {errors.avatar?.message}
                              </Field.ErrorText>
                            </FileUpload.DropzoneContent>
                          </FileUpload.Dropzone>
                        </FileUpload.Root>
                      </Field.Root>
                    )}
                    {/* Actions */}
                    {!!getValues("id") &&
                    currentUser?.role.type === "super_admin" ? (
                      <HStack mt={3}>
                        <Button
                          variant="solid"
                          colorPalette="blue"
                          onClick={() => {
                            field.onChange(null);
                          }}
                        >
                          Change user image
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
                    ) : !getValues("id") &&
                      ["super_admin", "admin"].includes(
                        currentUser?.role.type,
                      ) ? (
                      <HStack mt={3}>
                        <Button
                          variant="solid"
                          colorPalette="blue"
                          onClick={() => {
                            field.onChange(null);
                          }}
                        >
                          Change user image
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
                    ) : null}
                  </>
                );
              }}
            />
          </VStack>
          {/* Full Name */}
          <VStack flex={"1 60%"} gap={3}>
            <Field.Root invalid={!!errors.fullName}>
              <Field.Label fontWeight={"meduim"}>Full Name</Field.Label>
              <Input
                placeholder="Full Name"
                {...register("fullName", {
                  disabled:
                    !!getValues("id") &&
                    currentUser?.role.type !== "super_admin",
                  required: "Full Name is required",
                  minLength: {
                    value: 3,
                    message: "Full Name should be at least 3 charachters",
                  },
                  onChange: onChangeHandler,
                })}
                borderColor={`${errors.fullName ? "red" : border}`}
              />
              <Field.ErrorText>{errors.fullName?.message}</Field.ErrorText>
            </Field.Root>

            {/* Email */}
            <Field.Root invalid={!!errors.email}>
              <Field.Label fontWeight={"meduim"}>Email</Field.Label>
              <Input
                placeholder="Enter your email"
                {...register("email", {
                  disabled:
                    !!getValues("id") &&
                    currentUser?.role.type !== "super_admin",
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Invalid email",
                  },
                })}
                borderColor={`${errors.email ? "red" : border}`}
              />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>
            {/* Username */}
            <Field.Root invalid={!!errors.username}>
              <Field.Label>Username</Field.Label>
              <Input
                placeholder="Username"
                {...register("username", {
                  disabled:
                    !!getValues("id") &&
                    currentUser?.role.type !== "super_admin",
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username should be at least 3 charachters",
                  },
                  onChange: onChangeHandler,
                })}
                borderColor={`${errors.username ? "red" : border}`}
              />
              <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
            </Field.Root>
            {/* PASSWORD */}
            {!getValues("id") && (
              <Field.Root invalid={!!errors.password}>
                <Field.Label>Password</Field.Label>
                <InputGroup
                  endElement={
                    <IconButton
                      aria-label="toggle password"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </IconButton>
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    borderColor={`${errors.password ? "red" : border}`}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              </Field.Root>
            )}
            {/* Blocked */}
            <Controller
              control={control}
              name="blocked"
              render={({ field }) => (
                <Field.Root invalid={!!errors.blocked} py={2}>
                  <Switch.Root
                    name={field.name}
                    colorPalette={"red"}
                    checked={field.value}
                    onCheckedChange={({ checked }) => {
                      field.onChange(checked);
                    }}
                    disabled={getValues("role.type") === "super_admin"}
                  >
                    <Switch.Label>Block</Switch.Label>
                    <Switch.HiddenInput onBlur={field.onBlur} />
                    <Switch.Control />
                  </Switch.Root>
                  <Field.ErrorText>{errors.blocked?.message}</Field.ErrorText>
                </Field.Root>
              )}
            />
            {/* Role */}
            <Field.Root invalid={!!errors.role}>
              <Controller
                control={control}
                name="role"
                disabled={
                  !!getValues("id") && currentUser?.role.type !== "super_admin"
                }
                render={({ field }) => (
                  <>
                    <Field.Label>Role</Field.Label>
                    <NativeSelect.Root size="sm" width="240px">
                      <NativeSelect.Field
                        placeholder="Select option"
                        value={field.value.id}
                        disabled={
                          !!getValues("id") &&
                          currentUser?.role.type !== "super_admin"
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        <For
                          each={roles.filter(
                            (role) =>
                              !["super_admin", currentUser.role.type].includes(
                                role.type,
                              ),
                          )}
                        >
                          {(role: IRole) => (
                            <option
                              key={role.id}
                              value={role.id}
                              disabled={field.value.id === role.id}
                            >
                              {role.name}
                            </option>
                          )}
                        </For>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </>
                )}
              />
              <Field.ErrorText>{errors.role?.message}</Field.ErrorText>
            </Field.Root>
            {/* Address */}
          </VStack>
        </HStack>
      </ModalDialog>
    </>
  );
};

export default UsersTable;
