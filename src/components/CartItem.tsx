import {
  activeCartItem,
  changeCartItemQty,
  removeCartItem,
} from "@/app/features/cartSlice";
import {
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "@/app/services/cartItem";
import type { ICartItem } from "@/interfaces";
import {
  Box,
  Checkbox,
  createListCollection,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Portal,
  Select,
  Text,
} from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import ProductSalePrice from "./ui/ProductSalePrice";

interface IProps {
  item: ICartItem;
  checkbox?: boolean;
}

const CartItem = ({ item, checkbox = true }: IProps) => {
  const { product, quantity, documentId, discount, active } = item;
  const dispatch = useDispatch();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const deleteCartItemHandler = async () => {
    dispatch(removeCartItem(documentId));
    try {
      const res = await deleteCartItem(documentId);

      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const quantityHandler = async (e: { value: string[] }) => {
    dispatch(changeCartItemQty({ documentId, quantity: parseInt(e.value[0]) }));
    try {
      const res = await updateCartItem({
        documentId,
        body: {
          data: { quantity: parseInt(e.value[0]) },
        },
      });

      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const selectItemHandler = async (checked: boolean) => {
    dispatch(activeCartItem({ documentId, active: checked }));
    try {
      const res = await updateCartItem({
        documentId,
        body: {
          data: { active: checked },
        },
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const quantityOptions = Array.from(
    { length: product.stock },
    (_, i) => i + 1,
  );

  const optionsCollection = createListCollection({
    items: [
      ...quantityOptions.map((option) => ({
        value: option.toString(),
        label: option.toString(),
      })),
    ],
  });

  return (
    <Box
      _notLast={{
        borderBottomWidth: "1px",
        borderColor: "divider",
      }}
      mx={4}
      py={5}
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        align={{ base: "stretch", sm: "center" }}
        gap={4}
      >
        {checkbox && (
          <Checkbox.Root
            size="md"
            top="0.5"
            aria-label="Select row"
            checked={active}
            onCheckedChange={({ checked }) =>
              selectItemHandler(checked === true)
            }
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control borderRadius={"md"} />
          </Checkbox.Root>
        )}
        <RouterLink to={`/products/${product.documentId}`}>
          <Image
            src={`${import.meta.env.VITE_SERVER_URL}${product.thumbnail?.url}`}
            alt={product.thumbnail?.alternativeText || product.title}
            mx={{ base: "auto", sm: 0 }}
            w={{ base: "10rem", sm: "8rem" }}
            borderRadius="2xl"
            bg="gray.300"
            objectFit="contain"
            flexShrink={0}
          />
        </RouterLink>

        <Box display="flex" flexDirection="column" gap={2} w="full" flex="1">
          {/* Product name and remove button */}
          <Flex align="center" justify="space-between" gap={3}>
            <Heading
              as="h2"
              fontSize={"lg"}
              fontWeight="semibold"
              lineClamp="2"
            >
              {product.title}
            </Heading>

            <IconButton
              aria-label={`Remove ${product.title} from cart`}
              variant="ghost"
              colorPalette="red"
              onClick={deleteCartItemHandler}
              size={"xs"}
            >
              <Icon size="md" color="tomato">
                <BsTrash />
              </Icon>
            </IconButton>
          </Flex>

          {/* Product size */}
          <HStack gap={3} fontSize="sm">
            <Text fontWeight="semibold">Size:</Text>
            <Text color="secondary-text-color">59874SA4</Text>
          </HStack>

          {/* Product color */}
          <HStack gap={3} fontSize="sm">
            <Text fontWeight="semibold">Color:</Text>
            <Text color="secondary-text-color">gray</Text>
          </HStack>

          {/* Price and quantity controls */}
          <Flex align="center" justify="space-between" gap={3}>
            <Box>
              <ProductSalePrice price={product.price} discount={discount} />
            </Box>
            <Select.Root
              collection={optionsCollection}
              defaultValue={["spirited_away"]}
              size="sm"
              width="100px"
              value={[quantity.toString()]}
              onValueChange={quantityHandler}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger justifyContent="flex-start">
                  <Select.Label>QTY :</Select.Label>
                  <Select.ValueText fontWeight={"bold"} ml={1} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content alignContent={"right"}>
                    {optionsCollection.items.map((qty) => (
                      <Select.Item
                        item={qty}
                        key={qty.value}
                        w="full"
                        justifyContent={
                          qty.value === quantity.toString()
                            ? "space-between"
                            : "right"
                        }
                      >
                        <Select.ItemIndicator />
                        {qty.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default CartItem;
