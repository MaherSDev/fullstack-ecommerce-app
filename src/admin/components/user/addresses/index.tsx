import { useState } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import {
  AbsoluteCenter,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  RadioGroup,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  useDeleteDashboardAddressMutation,
  useGetDashboardUserAddressesQuery,
  useUpdateDashboardDefaultAddressMutation,
} from "@/app/services/address";
import type { IAddress } from "@/interfaces";
import { BsTrash } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import AlertDialog from "@/shared/AlertDialog";
import { toaster } from "@/components/ui/toaster";
import { MdAddLocationAlt, MdEditLocationAlt } from "react-icons/md";

interface IProps {
  userId: number | undefined;
}

const Overlay = ({ bg = "" }) => (
  <AbsoluteCenter h="full" w="full" bg={bg} rounded="md" p="4" zIndex={1}>
    <HStack gap="3">
      <Spinner size="sm" colorPalette="blue" />
      <Text fontSize="sm" color="fg.muted">
        Loading...
      </Text>
    </HStack>
  </AbsoluteCenter>
);

const Addresses = ({ userId = -1 }: IProps) => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>();
  const [addressToUpdate, setAddressToUpdate] = useState<IAddress>();
  const { data: userAddresses, isLoading: isLoadingAddresses } =
    useGetDashboardUserAddressesQuery(userId);
  const [deleteAddress, { isLoading: isDeleting }] =
    useDeleteDashboardAddressMutation();

  const [updateDefaultAddress, { isLoading: isUpdatingDefault }] =
    useUpdateDashboardDefaultAddressMutation();

  const {
    open: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onClose: closeDeleteDialog,
  } = useDisclosure();

  const addresses = userAddresses?.addresses ?? [];
  const defaultAddress = userAddresses?.defaultAddress;

  const isFormMode = isOpenForm;
  const isListLoading = isLoadingAddresses || isUpdatingDefault;

  const openCreateForm = () => {
    setAddressToUpdate(undefined);
    setIsOpenForm(true);
  };

  const openUpdateForm = (address: IAddress) => {
    setAddressToUpdate(address);
    setIsOpenForm(true);
  };

  const closeForm = () => {
    setAddressToUpdate(undefined);
    setIsOpenForm(false);
  };

  const openDeleteConfirmation = (addressId: string) => {
    setSelectedAddressId(addressId);
    openDeleteDialog();
  };

  const handleDeleteAddress = async () => {
    if (!selectedAddressId) {
      return;
    }

    const addressBeingDeleted = addresses.find(
      (address: IAddress) => address.documentId === selectedAddressId,
    );

    const isDeletingDefaultAddress =
      defaultAddress?.documentId === selectedAddressId;

    const remainingAddresses = addresses.filter(
      (address: IAddress) => address.documentId !== selectedAddressId,
    );

    try {
      await deleteAddress(selectedAddressId).unwrap();

      /*
       * If the deleted address was the default address:
       * - No remaining address → warn the admin/user.
       * - Remaining addresses → automatically assign the first
       *   remaining address as the new default.
       */
      if (isDeletingDefaultAddress) {
        if (remainingAddresses.length === 0) {
          toaster.create({
            title:
              "You deleted the default address. You need to create a new address to receive orders.",
            type: "warning",
            closable: true,
          });
        } else {
          const newDefaultAddress = remainingAddresses[0];

          await updateDefaultAddress({
            id: userId,
            body: {
              defaultAddress: newDefaultAddress.id,
            },
          }).unwrap();

          toaster.create({
            title:
              "The address was deleted and a new default address was selected.",
            type: "success",
            closable: true,
          });
        }
      } else {
        toaster.create({
          title: "The address was deleted successfully.",
          type: "success",
          closable: true,
        });
      }
    } catch (error) {
      console.error("Failed to delete address:", error, addressBeingDeleted);

      toaster.create({
        title: "Failed to delete the address.",
        type: "error",
        closable: true,
      });
    } finally {
      setSelectedAddressId(undefined);
      closeDeleteDialog();
    }
  };

  const handleDefaultAddressChange = async (value: string | null) => {
    if (!value) {
      return;
    }

    try {
      await updateDefaultAddress({
        id: userId,
        body: {
          defaultAddress: Number(value),
        },
      }).unwrap();

      toaster.create({
        title: "The default address was updated successfully.",
        type: "success",
        closable: true,
      });
    } catch (error) {
      console.error("Failed to update default address:", error);

      toaster.create({
        title: "Failed to update the default address.",
        type: "error",
        closable: true,
      });
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        description={
          "This action cannot be undone. This will permanently remove the address."
        }
        title={"Are you sure to remove this address?"}
        okText={{ icon: <BsTrash size={17} />, text: "Delete" }}
        onDeleteHandler={handleDeleteAddress}
        isLoading={isDeleting}
      />
      <HStack w="full" justify={"space-between"} align={"center"} mb={3}>
        <Heading as={"h3"}>
          {isFormMode ? (
            <HStack gap={1}>
              <IconButton
                variant="plain"
                size="md"
                aria-label="Back to addresses"
                onClick={closeForm}
              >
                <IoIosArrowBack size={20} />
              </IconButton>

              <Text>
                {addressToUpdate ? "Update Address" : "Add New Address"}
              </Text>
            </HStack>
          ) : (
            "Addresses"
          )}
        </Heading>
        {!isFormMode && (
          <Button
            variant="solid"
            colorPalette="blue"
            mr={3}
            onClick={openCreateForm}
          >
            <MdAddLocationAlt size={17} />
            New Address
          </Button>
        )}
      </HStack>
      {isFormMode ? (
        <AddressForm
          userId={userId}
          defaultAddress={defaultAddress}
          addressToUpdate={addressToUpdate}
          onClose={closeForm}
        />
      ) : (
        <Box w="full" paddingEnd={"2"}>
          {isListLoading && (
            <Overlay bg={isUpdatingDefault ? "bg/80" : undefined} />
          )}
          {!isLoadingAddresses && !addresses.length ? (
            <Text>There is no address for this user.</Text>
          ) : (
            <RadioGroup.Root
              w="full"
              onValueChange={({ value }) => handleDefaultAddressChange(value)}
              value={
                defaultAddress?.id !== undefined
                  ? defaultAddress.id.toString()
                  : ""
              }
            >
              <VStack gap={3}>
                {addresses.map((address: IAddress) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    defaultAddress={defaultAddress}
                  >
                    <HStack
                      justify={"flex-start"}
                      alignItems={"stretch"}
                      gap={"none"}
                    >
                      <IconButton
                        variant="plain"
                        colorPalette="blue"
                        aria-label="Edit address"
                        onClick={() => openUpdateForm(address)}
                        flex={1}
                        rounded="none"
                      >
                        <MdEditLocationAlt size={17} />
                      </IconButton>
                      <IconButton
                        variant="plain"
                        colorPalette="red"
                        aria-label="Delete address"
                        onClick={() =>
                          openDeleteConfirmation(address.documentId)
                        }
                        flex={1}
                        rounded="none"
                      >
                        <BsTrash size={17} />
                      </IconButton>
                    </HStack>
                  </AddressCard>
                ))}
              </VStack>
            </RadioGroup.Root>
          )}
        </Box>
      )}
    </>
  );
};

export default Addresses;
