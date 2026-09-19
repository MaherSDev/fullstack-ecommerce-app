import { ADDRESS_FORM_INPUTS } from "@/admin/common/constants/fromData";
import { getCitiesByCountries, getCountries } from "@/admin/utils";
import {
  useCreateDashboardAddressMutation,
  useUpdateDashboardAddressMutation,
  useUpdateDashboardDefaultAddressMutation,
} from "@/app/services/address";
import { toaster } from "@/components/ui/toaster";
import type { IAddress, ICity, ICountry } from "@/interfaces";
import {
  Box,
  Button,
  Checkbox,
  createListCollection,
  Field,
  For,
  HStack,
  Input,
  InputGroup,
  NativeSelect,
  Portal,
  Select,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  useForm,
  type Path,
  type SubmitHandler,
} from "react-hook-form";
import { BiUndo } from "react-icons/bi";
import { MdAddLocationAlt, MdEditLocationAlt } from "react-icons/md";

interface IProps {
  userId: number | undefined;
  defaultAddress: IAddress | undefined;
  addressToUpdate: IAddress | undefined;
  onClose: () => void;
}

const createDefaultValues = (userId: number | undefined): IAddress => ({
  documentId: "",
  id: -1,
  country: null,
  city: null,
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  phoneNumber: "",
  fullName: "",
  user: userId,
});

const AddressForm = ({
  userId = -1,
  defaultAddress,
  addressToUpdate,
  onClose,
}: IProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IAddress>({
    defaultValues: createDefaultValues(userId),
  });
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(false);
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);
  const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false);

  const [createAddress] = useCreateDashboardAddressMutation();

  const [updateAddress] = useUpdateDashboardAddressMutation();

  const [updateDefaultAddress] = useUpdateDashboardDefaultAddressMutation();

  const countryCollection = useMemo(
    () =>
      createListCollection({
        items: countries,
        itemToString: (country) => country.name,
        itemToValue: (country) => country.id.toString(),
      }),
    [countries],
  );

  useEffect(() => {
    if (!addressToUpdate) {
      reset(createDefaultValues(userId));
      setSelectedCountry(undefined);
      setCities([]);
      setIsDefaultAddress(false);

      return;
    }

    reset({
      documentId: addressToUpdate.documentId,
      id: addressToUpdate.id,
      country: addressToUpdate.country ?? null,
      city: addressToUpdate.city ?? null,
      addressLine1: addressToUpdate.addressLine1 ?? "",
      addressLine2: addressToUpdate.addressLine2 ?? "",
      postalCode: addressToUpdate.postalCode ?? "",
      phoneNumber: addressToUpdate.phoneNumber ?? "",
      fullName: addressToUpdate.fullName ?? "",
      user: userId,
    });

    setSelectedCountry(addressToUpdate.country ?? undefined);

    setIsDefaultAddress(false);
  }, [addressToUpdate, reset, userId]);

  useEffect(() => {
    let isMounted = true;

    const loadCountries = async () => {
      setIsLoadingCountries(true);

      try {
        const data = await getCountries();

        if (isMounted) {
          setCountries(data);
        }
      } catch (error) {
        console.error("Failed to load countries:", error);

        toaster.create({
          title: "Failed to load countries.",
          type: "error",
          closable: true,
        });
      } finally {
        if (isMounted) {
          setIsLoadingCountries(false);
        }
      }
    };

    loadCountries();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCountry?.id) {
      setCities([]);
      return;
    }

    let isMounted = true;

    const loadCities = async () => {
      setIsLoadingCities(true);
      setCities([]);

      try {
        const data = await getCitiesByCountries(selectedCountry.id);
        if (isMounted) {
          setCities(data);
        }
      } catch (error) {
        console.error("Failed to load cities:", error);

        if (isMounted) {
          setCities([]);
        }

        toaster.create({
          title: "Failed to load cities.",
          type: "error",
          closable: true,
        });
      } finally {
        if (isMounted) {
          setIsLoadingCities(false);
        }
      }
    };

    loadCities();

    return () => {
      isMounted = false;
    };
  }, [selectedCountry]);

  const handleSubmitAddress: SubmitHandler<IAddress> = async (data, e) => {
    e?.preventDefault();
    const payload = {
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      postalCode: data.postalCode,
      phoneNumber: data.phoneNumber,
      fullName: data.fullName,
      city: data.city,
      country: data.country?.id,
      user: userId,
    };

    try {
      let addressId: number;

      if (addressToUpdate) {
        const response = await updateAddress({
          id: addressToUpdate.documentId,
          body: payload,
        }).unwrap();

        addressId = response.data.id;

        toaster.create({
          title: "The address was updated successfully.",
          type: "success",
          closable: true,
        });
      } else {
        const response = await createAddress(payload).unwrap();

        addressId = response.data.id;

        toaster.create({
          title: "The address was created successfully.",
          type: "success",
          closable: true,
        });
      }

      if (isDefaultAddress) {
        await updateDefaultAddress({
          id: userId,
          body: {
            defaultAddress: addressId,
          },
        }).unwrap();

        toaster.create({
          title: "The default address was updated successfully.",
          type: "success",
          closable: true,
        });
      }

      onClose();
    } catch (error) {
      console.error("Failed to save address:", error);

      toaster.create({
        title: `Failed to ${
          addressToUpdate ? "update" : "create"
        } the address.`,
        type: "error",
        closable: true,
      });
    }
  };

  return (
    <Box w={"full"} paddingBlock={2}>
      <VStack
        gap={3}
        as="form"
        w="full"
        maxW={"600px"}
        onSubmit={handleSubmit(handleSubmitAddress)}
        alignItems={"flex-start"}
      >
        {/* Country */}
        <Field.Root invalid={!!errors.country}>
          <Field.Label>Country</Field.Label>
          <Controller
            control={control}
            name="country"
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Select.Root
                collection={countryCollection}
                value={field.value ? [field.value.id.toString()] : []}
                onValueChange={({ value }) => {
                  const currentCountry = countries.find(
                    (country) => country.id === Number(value[0]),
                  );

                  if (!currentCountry) return;

                  field.onChange(currentCountry);
                  setSelectedCountry(currentCountry);
                }}
                onInteractOutside={field.onBlur}
                width="250px"
                disabled={isLoadingCountries}
                borderColor={`${errors.country ? "red" : "input-border"}`}
              >
                <Select.HiddenSelect />

                <Select.Control>
                  <Select.Trigger>
                    {field.value ? (
                      <HStack>
                        <Text fontSize="lg">{field.value.emoji}</Text>

                        <Text>{field.value.name}</Text>
                      </HStack>
                    ) : (
                      <Select.ValueText placeholder="Select Country" />
                    )}
                  </Select.Trigger>

                  <Select.IndicatorGroup>
                    {isLoadingCountries ? (
                      <Spinner size="sm" colorPalette="blue" />
                    ) : (
                      <Select.Indicator />
                    )}
                  </Select.IndicatorGroup>
                </Select.Control>

                <Portal>
                  <Select.Positioner>
                    <Select.Content maxH="300px">
                      {countries?.length
                        ? countries.map((country) => (
                            <Select.Item key={country.id} item={country}>
                              <HStack w="full" justify="space-between">
                                <HStack gap={3}>
                                  <Text fontSize="lg">{country.emoji}</Text>

                                  <Text>{country.name}</Text>
                                </HStack>

                                <Select.ItemIndicator />
                              </HStack>
                            </Select.Item>
                          ))
                        : ""}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            )}
          />
          <Field.ErrorText>{errors.country?.message}</Field.ErrorText>
        </Field.Root>
        {/* City */}
        <Field.Root
          invalid={!!errors.city}
          disabled={!selectedCountry || isLoadingCities}
        >
          <Controller
            control={control}
            name="city"
            rules={{ required: "City is required" }}
            render={({ field }) => {
              return (
                <>
                  <Field.Label>City</Field.Label>
                  <NativeSelect.Root size="sm" width="250px">
                    <NativeSelect.Field
                      placeholder="Select City"
                      value={field.value?.id}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                      borderColor={`${errors.city ? "red" : "input-border"}`}
                    >
                      {!cities.length ? (
                        <option value="">
                          {isLoadingCities
                            ? "Loading cities..."
                            : "No cities available"}
                        </option>
                      ) : (
                        <For each={cities}>
                          {(city: ICity) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          )}
                        </For>
                      )}
                    </NativeSelect.Field>

                    {isLoadingCities ? (
                      <NativeSelect.Indicator>
                        <Spinner size="sm" colorPalette="blue" />
                      </NativeSelect.Indicator>
                    ) : (
                      <NativeSelect.Indicator />
                    )}
                  </NativeSelect.Root>
                </>
              );
            }}
          />
          <Field.ErrorText>{errors.city?.message}</Field.ErrorText>
        </Field.Root>
        {/* Phone Number */}
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <Field.Root invalid={!!errors.phoneNumber} w="full">
              <Field.Label fontWeight="medium">Phone Number</Field.Label>

              <InputGroup
                startAddon={
                  <Text minW="40px" textAlign="center">
                    {field.value
                      ? `${field.value.iso2} +${field.value.phoneCode}`
                      : "---"}
                  </Text>
                }
              >
                <Input
                  placeholder="Phone Number"
                  {...register("phoneNumber", {
                    minLength: {
                      value: 3,
                      message: "Phone Number should be at least 3 characters",
                    },
                  })}
                  borderColor={errors.phoneNumber ? "red" : "input-border"}
                />
              </InputGroup>

              <Field.ErrorText>{errors.phoneNumber?.message}</Field.ErrorText>
            </Field.Root>
          )}
        />
        {ADDRESS_FORM_INPUTS.map(({ name, label, placeholder, validation }) => {
          const fieldName = name as keyof IAddress;
          const fieldError = errors[fieldName];
          return (
            <Field.Root invalid={!!fieldError} key={label}>
              <Field.Label fontWeight={"medium"}>{label}</Field.Label>
              <Input
                placeholder={placeholder}
                {...register(name as Path<IAddress>, {
                  ...validation,
                  pattern:
                    selectedCountry?.postalCodeRegex && name === "postalCode"
                      ? {
                          value: new RegExp(selectedCountry.postalCodeRegex),
                          message: "Invalid postal code format",
                        }
                      : validation?.pattern,
                  minLength:
                    name === "postalCode" &&
                    selectedCountry?.postalCodeFormat?.length
                      ? {
                          value: Number(
                            selectedCountry.postalCodeFormat.length,
                          ),
                          message: `Postal code should be ${selectedCountry.postalCodeFormat.length} characters long`,
                        }
                      : validation?.minLength,
                })}
                borderColor={`${fieldError ? "red" : "input-border"}`}
              />
              <Field.ErrorText>{fieldError?.message}</Field.ErrorText>
            </Field.Root>
          );
        })}
        {addressToUpdate?.id !== defaultAddress?.id && (
          <Checkbox.Root
            checked={isDefaultAddress}
            onCheckedChange={({ checked }) =>
              setIsDefaultAddress(checked === true)
            }
          >
            <Checkbox.HiddenInput />

            <Checkbox.Control rounded="full" />

            <Checkbox.Label>Set as default address</Checkbox.Label>
          </Checkbox.Root>
        )}
        <HStack w={"full"}>
          <Button type="button" variant="outline" flex={1} onClick={onClose}>
            <BiUndo size={17} />
            Cancel
          </Button>
          <Button
            type="submit"
            flex={1}
            variant="solid"
            colorPalette={"blue"}
            mr={3}
            loading={isSubmitting}
          >
            {addressToUpdate?.id ? (
              <>
                <MdEditLocationAlt size={17} /> Update
              </>
            ) : (
              <>
                <MdAddLocationAlt size={17} /> Create
              </>
            )}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default AddressForm;
