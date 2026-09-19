import {
  useGetDashboardUsersQuery,
  useDeleteDashboardUserMutation,
  useUpdateDashboardUserMutation,
  useCreateDashboardUserMutation,
  useGetDashboardSingleUserQuery,
} from "@/app/services/user";
import { FaUserAltSlash, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import type { IUserData } from "@/interfaces";
import {
  ActionBar,
  Box,
  Button,
  Checkbox,
  Portal,
  Table,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import AlertDialog from "@/shared/AlertDialog";
import ModalDialog from "@/shared/ModalDialog";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useCreateDashboardMediaMutation } from "@/app/services/media";
import FormCreateUser from "./user/FormCreateUser";
import FormUpdateUser from "./user/FormUpdateUser";
import { toaster } from "@/components/ui/toaster";
import { USER_DEFAULT_VALUES } from "../common/constants";
import UsersTableRow from "./user/UsersTableRow";

const UsersTable = () => {
  const bg = useColorModeValue("gray.300", "gray.800");
  const color = useColorModeValue("gray.800", "gray.100");
  const [selection, setSelection] = useState<number[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>();

  const isEditing = selectedUserId !== undefined;

  const {
    open: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onClose: closeDeleteDialog,
  } = useDisclosure();
  const {
    open: isBlockDialogOpen,
    onOpen: openBlockDialog,
    onClose: closeBlockDialog,
  } = useDisclosure();
  const {
    open: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useGetDashboardSingleUserQuery("");
  const {
    isLoading: isLoadingUsers,
    data: users = [],
    error: usersError,
  } = useGetDashboardUsersQuery("");

  const [deleteUser, { isLoading: isDeleting }] =
    useDeleteDashboardUserMutation();
  const [updateUser, { isLoading: isUpdating }] =
    useUpdateDashboardUserMutation();
  const [createUser] = useCreateDashboardUserMutation();
  const [uploadMedia] = useCreateDashboardMediaMutation();

  const methods = useForm<IUserData>({
    defaultValues: USER_DEFAULT_VALUES,
  });
  const {
    reset,
    getValues,
    formState: { isSubmitting },
    handleSubmit,
  } = methods;

  const isSuperAdmin = currentUser?.role?.type === "super_admin";

  const visibleUsers = users.filter(
    (user: IUserData) =>
      !["super_admin", currentUser?.role?.type].includes(user.role?.type),
  );

  const visibleUserIds = visibleUsers.map((user: IUserData) => user.id);

  const hasSelection = selection.length > 0;

  const isIndeterminate =
    hasSelection && selection.length < visibleUserIds.length;

  const handleCreateUser = () => {
    setSelectedUserId(undefined);
    reset(USER_DEFAULT_VALUES);
    openModal();
  };

  const handleEditUser = (user: IUserData) => {
    reset(user);
    setSelectedUserId(user.id);
    openModal();
  };

  const handleDeleteUser = (userId: number) => {
    setSelectedUserId(userId);
    openDeleteDialog();
  };

  const handleBlockUser = (user: IUserData) => {
    reset(user);
    setSelectedUserId(user.id);
    openBlockDialog();
  };

  const uploadAvatar = async (avatar: File) => {
    const formData = new FormData();

    formData.append("files", avatar);

    formData.append(
      "fileInfo",
      JSON.stringify({
        alternativeText: avatar.name.replace(/\.[^/.]+$/, ""),
      }),
    );

    const data = await uploadMedia(formData).unwrap();
    console.log(data);

    return data[0].id;
  };

  const handleSubmitUser: SubmitHandler<IUserData> = async (formData) => {
    try {
      let avatarId = formData.avatar;

      if (formData.avatar instanceof File) {
        avatarId = await uploadAvatar(formData.avatar);
      }
      const payload = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        confirmed: formData.confirmed,
        blocked: formData.blocked,
        role: formData.role.id ? formData.role.id : formData.role,
        avatar: avatarId || null,
        addresses: formData.addresses || null,
      };

      console.log(formData.role);
      if (formData.id) {
        await updateUser({
          id: formData.id,
          body: payload,
        }).unwrap();

        toaster.create({
          title: "The User updated successfully.",
          type: "success",
          closable: true,
        });
      } else {
        await createUser({
          body: {
            ...payload,
            role: 1,
          },
        }).unwrap();

        toaster.create({
          title: "The User created successfully.",
          type: "success",
          closable: true,
        });
      }

      reset(USER_DEFAULT_VALUES);
      closeModal();
    } catch ({ data: error }) {
      console.error(error);
      toaster.create({
        title: `Failed to ${formData.id ? "update" : "create"} the User.`,
        description: error
          ? error.error.message
          : "An unexpected error occurred.",
        type: "error",
        closable: true,
      });
    }
  };

  const handleBlockToggle = async () => {
    if (!selectedUserId) return;

    const blocked = getValues("blocked");

    try {
      await updateUser({
        id: selectedUserId,
        body: {
          blocked: !blocked,
        },
      }).unwrap();

      toaster.create({
        title: `User ${blocked ? "unblocked" : "blocked"} successfully.`,
        type: "success",
        closable: true,
      });

      closeBlockDialog();
    } catch (error) {
      console.error(error);

      toaster.create({
        title: `Failed to ${blocked ? "unblock" : "block"} the User.`,
        type: "error",
        closable: true,
      });
    }
  };

  const handleDeleteSelectedUsers = async () => {
    const userIds = selection.length
      ? selection
      : selectedUserId
        ? [selectedUserId]
        : [];

    if (!userIds.length) return;

    try {
      await Promise.all(userIds.map((id) => deleteUser(id).unwrap()));

      toaster.create({
        title:
          userIds.length === 1
            ? "The User deleted successfully."
            : `${userIds.length} Users deleted successfully.`,
        type: "success",
        closable: true,
      });

      setSelection([]);
      setSelectedUserId(undefined);
      closeDeleteDialog();
    } catch (error) {
      console.error(error);

      toaster.create({
        title: "Failed to delete the User.",
        type: "error",
        closable: true,
      });
    }
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelection(checked === true ? visibleUserIds : []);
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    setSelection((previous) =>
      checked ? [...previous, userId] : previous.filter((id) => id !== userId),
    );
  };

  if (isLoadingUsers || isLoadingCurrentUser) return "Loading...";
  if (usersError) return "No Data Found";

  return (
    <>
      <Box>
        <Button
          variant="solid"
          colorPalette={"blue"}
          mr={3}
          onClick={handleCreateUser}
        >
          <FaUserPlus size={17} />
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
                checked={
                  isIndeterminate ? "indeterminate" : selection.length > 0
                }
                onCheckedChange={(changes) => handleSelectAll(changes.checked)}
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
        <Table.Body>
          {visibleUsers.map((user: IUserData) => (
            <UsersTableRow
              key={user.id}
              user={user}
              isSelected={selection.includes(user.id)}
              isSuperAdmin={isSuperAdmin}
              onSelect={handleSelectUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onBlock={handleBlockUser}
            />
          ))}
        </Table.Body>
      </Table.Root>
      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner zIndex={2}>
            <ActionBar.Content bg={bg} color={color}>
              <ActionBar.SelectionTrigger borderColor={color}>
                {selection.length} selected
              </ActionBar.SelectionTrigger>
              {isSuperAdmin && (
                <>
                  <ActionBar.Separator bg={color} />
                  <Button
                    variant="outline"
                    size="sm"
                    colorPalette={"red"}
                    onClick={openDeleteDialog}
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
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        description={
          "This action cannot be undone. This will permanently remove the user."
        }
        title={"Are you sure to remove this user?"}
        okText={{ icon: <BsTrash size={17} />, text: "Delete" }}
        onDeleteHandler={handleDeleteSelectedUsers}
        isLoading={isDeleting}
      />
      <AlertDialog
        isOpen={isBlockDialogOpen}
        onClose={closeBlockDialog}
        description={
          !getValues("blocked")
            ? "This user can't connect to his account when you block him."
            : ""
        }
        title={`Are you sure to ${!getValues("blocked") ? "Block" : "Unblock"} this user?`}
        okText={{
          icon: <FaUserAltSlash size={17} />,
          text: !getValues("blocked") ? "Block" : "Unblock",
        }}
        onDeleteHandler={handleBlockToggle}
        isLoading={isUpdating}
      />
      <ModalDialog
        isOpen={isModalOpen}
        isLoading={isSubmitting}
        title={isEditing ? "Edit User" : "Create User"}
        okText={
          isEditing
            ? { icon: <FaUserEdit size={17} />, text: "Update" }
            : { icon: <FaUserPlus size={17} />, text: "Create" }
        }
        onSave={handleSubmit(handleSubmitUser)}
        onClose={closeModal}
        styles={{ h: "90%" }}
      >
        <FormProvider {...methods}>
          {isEditing ? (
            <FormUpdateUser userId={selectedUserId} />
          ) : (
            <FormCreateUser />
          )}
        </FormProvider>
      </ModalDialog>
    </>
  );
};

export default UsersTable;
