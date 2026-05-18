import type { ReactNode } from "react";
import { FiArrowUp } from "react-icons/fi";
import {
  Box,
  Stat,
  Card,
  HStack,
  FormatNumber,
  Highlight,
  Icon,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

const StatusCard = ({
  label,
  value,
  growValue,
  icon,
}: {
  label: string;
  value: number;
  growValue: string;
  icon: {
    color: string;
    bg: string;
    element: ReactNode;
  };
}) => {
  const color = useColorModeValue("gray.800", "gray.100");
  const hoverBg = useColorModeValue("blue.50", "gray.800");

  return (
    <Card.Root
      borderRadius="2xl"
      transition={"all .1s ease-in"}
      boxShadow="sm"
      _hover={{ bg: hoverBg, scale: 1.07 }}
    >
      <Card.Body p={4}>
        <HStack>
          <Box p={4} bg={icon.bg} borderRadius={"xl"}>
            <Icon strokeWidth={1.5} size={"2xl"} color={icon.color}>
              {icon.element}
            </Icon>
          </Box>

          <Stat.Root color={color}>
            <Stat.Label color={"inherit"}>{label}</Stat.Label>
            <Stat.ValueText>
              <FormatNumber
                value={value}
                style="decimal"
                maximumFractionDigits={0}
              />
            </Stat.ValueText>
            <Stat.HelpText mb="2" display={"flex"} alignItems={"center"}>
              <Icon color={"green.fg"}>
                <FiArrowUp size={"14px"} />
              </Icon>
              <Highlight
                query={`${growValue}%`}
                styles={{ px: "0.5", color: "green.500", fontWeight: "bold" }}
              >
                {`${growValue}% vs last week`}
              </Highlight>
            </Stat.HelpText>
          </Stat.Root>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

export default StatusCard;