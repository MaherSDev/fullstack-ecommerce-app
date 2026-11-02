import { HStack, Text, FormatNumber, Stat } from "@chakra-ui/react";

interface IProps {
  price: number;
  discount: number;
}

const ProductSalePrice = ({ price, discount }: IProps) => {
  const priceAfterDiscount = price - price * (discount / 100);

  return (
    <Stat.Root>
      <Stat.ValueText justifyContent={"center"}>
        <HStack
          fontWeight="semibold"
          fontSize={"xl"}
          alignItems={"flex-end"}
        >
          {discount ? (
            <>
              <Text
                fontWeight="medium"
                fontSize={"lg"}
                color={"gray.400"}
                textDecorationLine={"line-through"}
              >
                <FormatNumber value={price} style="currency" currency="USD" />
              </Text>
              <Text color={"primary"}>
                <FormatNumber
                  value={priceAfterDiscount}
                  style="currency"
                  currency="USD"
                />
              </Text>
            </>
          ) : (
            <Text>
              <FormatNumber value={price} style="currency" currency="USD" />
            </Text>
          )}
        </HStack>
      </Stat.ValueText>
    </Stat.Root>
  );
};

export default ProductSalePrice;
