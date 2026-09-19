import type { IUserData } from "@/interfaces";
import { Avatar, Checkbox, IconButton, Table } from "@chakra-ui/react";
import { FaUserAltSlash, FaUserEdit } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";

interface UsersTableRowProps {
  user: IUserData;
  isSelected: boolean;
  isSuperAdmin: boolean;
  onSelect: (userId: number, checked: boolean) => void;
  onEdit: (user: IUserData) => void;
  onDelete: (userId: number) => void;
  onBlock: (user: IUserData) => void;
}

const UsersTableRow = ({
  user,
  isSelected,
  isSuperAdmin,
  onSelect,
  onEdit,
  onDelete,
  onBlock,
}: UsersTableRowProps) => {
  return (
    <Table.Row
      data-selected={isSelected ? "" : undefined}
      color={{ base: "gray.700", _dark: "gray.300" }}
      fontWeight="medium"
      fontSize="md"
      className="users-table-row"
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label={`Select ${user.fullName}`}
          checked={isSelected}
          onCheckedChange={(changes) =>
            onSelect(user.id, changes.checked === true)
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>

      <Table.Cell w="70px">
        <Avatar.Root boxSize="40px">
          {user?.avatar ? (
            <Avatar.Image
              src={`${import.meta.env.VITE_SERVER_URL}${user?.avatar?.url}`}
              alt={user.avatar?.alternativeText}
            />
          ) : (
            <Avatar.Fallback name={user.fullName} />
          )}
        </Avatar.Root>
      </Table.Cell>

      <Table.Cell>{user.fullName}</Table.Cell>

      <Table.Cell>{user.email}</Table.Cell>

      <Table.Cell>{user.username}</Table.Cell>

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
        {isSuperAdmin && (
          <>
            <IconButton
              variant="plain"
              colorPalette="blue"
              mr={1}
              aria-label={`Edit ${user.fullName}`}
              onClick={() => onEdit(user)}
            >
              <FaUserEdit size={17} />
            </IconButton>

            <IconButton
              variant="plain"
              colorPalette="red"
              mr={1}
              aria-label={`Delete ${user.fullName}`}
              onClick={() => onDelete(user.id)}
            >
              <BsTrash size={17} />
            </IconButton>
          </>
        )}

        <IconButton
          variant="plain"
          colorPalette={user.blocked ? "red" : "black"}
          mr={1}
          aria-label={
            user.blocked ? `Unblock ${user.fullName}` : `Block ${user.fullName}`
          }
          onClick={() => onBlock(user)}
        >
          <FaUserAltSlash size={17} />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  );
};

export default UsersTableRow;
