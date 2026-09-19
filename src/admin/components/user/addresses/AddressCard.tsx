import { useColorModeValue } from "@/components/ui/color-mode";
import type { IAddress } from "@/interfaces";
import {
  Card,
  Heading,
  HStack,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaLocationArrow, FaUser } from "react-icons/fa";
import { MdCall } from "react-icons/md";

interface IProps {
  address: IAddress;
  defaultAddress?: IAddress;
  children: React.ReactNode;
}

const AddressCard = ({ address, defaultAddress, children }: IProps) => {
  const {
    country,
    city,
    addressLine1,
    addressLine2,
    fullName,
    phoneNumber,
    postalCode,
  } = address;

  const bodyColor = useColorModeValue("gray.800", "gray.300");
  const headerBg = useColorModeValue("gray.100", "gray.900");
  const isDefaultAddress = defaultAddress?.id === address.id;

  return (
    <Card.Root
      size="sm"
      w="full"
      borderWidth="1px"
      borderColor="border.default"
    >
      <Card.Header bg={headerBg} px={3} py={2}>
        <HStack justify="space-between" align="center" gap={3}>
          <Heading as="h4" size="md" fontWeight="normal" fontFamily="inherit">
            <Text>
              {country?.emoji} {country?.name} - {city?.name}
            </Text>
          </Heading>

          {children}
        </HStack>
      </Card.Header>
      <Card.Body color={bodyColor} px={4} py={3}>
        <VStack align="flex-start" gap={2}>
          <HStack gap={2}>
            <FaUser />
            <Text>{fullName}</Text>
          </HStack>

          <HStack gap={2}>
            <MdCall />
            <Text>{phoneNumber}</Text>
          </HStack>

          <HStack align="flex-start" gap={2}>
            <FaLocationArrow />
            <VStack align="flex-start" gap={0}>
              <Text>{addressLine1}</Text>
              {addressLine2 && <Text>{addressLine2}</Text>}
              <Text>{postalCode}</Text>
            </VStack>
          </HStack>

          <RadioGroup.Item
            value={address.id.toString()}
            mt={2}
            _hover={{
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText
              fontWeight={isDefaultAddress ? "bold" : "normal"}
              textDecoration={isDefaultAddress ? "underline" : "none"}
            >
              {isDefaultAddress ? "Default address" : "Set as default address"}
            </RadioGroup.ItemText>
          </RadioGroup.Item>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default AddressCard;
