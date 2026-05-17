import { useColorModeValue } from "@/components/ui/color-mode";
import {
  Box,
  Flex,
  Text,
  VStack,
  Grid,
  HStack,
  Avatar,
  Stack,
  Heading,
  FormatNumber,
  Highlight,
  Table,
  List,
  Image,
  Center,
} from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import {
  categories,
  modules,
  orders,
  orderStatusColors,
  sales,
  topSalesProducts,
  users,
} from "../common/constants";
import DashboardCard from "../common/Components/DashboardCard";
import StatusCard from "../common/Components/DashboardStatusCard";

function CustomTooltip(props: Partial<TooltipContentProps<string, string>>) {
  const bg = useColorModeValue("white", "black");

  const { active, payload, label } = props;
  if (!active || !payload || payload.length === 0) return null;
  return (
    <Box rounded="md" bg={bg} p="3" shadow={"md"}>
      <Stack gap={"4px"}>
        <Text fontWeight={"semibold"}>
          {label
            ? new Date(label).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : ""}
        </Text>
        {payload.map((item) => (
          <HStack key={item.name} gap={6}>
            <HStack>
              <Box boxSize="2" bg={item.color} rounded="full" />
              <Text fontWeight={"normal"} textTransform={"capitalize"}>
                {item.name}
              </Text>
            </HStack>
            <Text fontWeight={"semibold"}>
              <FormatNumber
                value={Number(item?.value)}
                style="currency"
                currency="USD"
                maximumFractionDigits={0}
              />
            </Text>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
}

const DashboardContent = () => {
  const categoriesChart = useChart({
    data: categories,
  });
  const salesChart = useChart({
    data: sales,
    series: [
      { name: "orders", color: "teal.solid", yAxisId: "left" },
      { name: "revenue", color: "purple.solid", yAxisId: "right" },
    ],
  });

  return (
    <Box flex={1} p={1}>
      <Heading as={"h1"} fontSize="2xl" fontWeight="bold" mb={6}>
        Dashboard
      </Heading>

      <Grid
        templateColumns="repeat(auto-fit, minmax(230px, 1fr))"
        gap={4}
        mb={6}
      >
        {modules.map((module, key) => (
          <StatusCard
            key={key}
            label={module.label}
            value={module.value}
            growValue={module.growValue.toString()}
            icon={module.icon}
          />
        ))}
      </Grid>

      <Flex mb={6} gap={6} flexWrap={"wrap"}>
        <DashboardCard title="Sales Overview" flex={"1"} minW={"600px"}>
          <Chart.Root maxH="sm" chart={salesChart}>
            <LineChart data={salesChart.data} responsive>
              <CartesianGrid
                stroke={salesChart.color("gray.400")}
                vertical={false}
                yAxisId={"left"}
              />
              <XAxis
                axisLine={false}
                dataKey={salesChart.key("month")}
                tickFormatter={(value) =>
                  value.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
                stroke={salesChart.color("border")}
                tickMargin={10}
              >
                <Label value="Month" position="bottom" />
              </XAxis>
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value)
                }
                yAxisId="left"
                dataKey={salesChart.key("orders")}
                stroke={salesChart.color("border")}
              >
                <Label
                  value="Orders"
                  position="left"
                  angle={-90}
                  offset={-10}
                />
              </YAxis>
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                    currency: "USD",
                    style: "currency",
                  }).format(value)
                }
                yAxisId="right"
                orientation="right"
                dataKey={salesChart.key("revenue")}
                stroke={salesChart.color("border")}
              >
                <Label value="Revenue" position="right" angle={90} offset={0} />
              </YAxis>
              <Tooltip
                animationDuration={100}
                cursor={{ stroke: salesChart.color("border") }}
                content={<CustomTooltip />}
              />
              <Legend
                verticalAlign="top"
                align="left"
                wrapperStyle={{ marginTop: -10, marginRight: 20 }}
                content={<Chart.Legend />}
              />
              {salesChart.series.map((item) => (
                <Line
                  yAxisId={item.yAxisId}
                  key={item.name}
                  isAnimationActive={false}
                  dataKey={salesChart.key(item.name)}
                  fill={salesChart.color(item.color)}
                  stroke={salesChart.color(item.color)}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </Chart.Root>
        </DashboardCard>
        <DashboardCard
          title="Recent Orders"
          xlDown={{ flex: 1 }}
          minW={"550px"}
          path="orders"
        >
          <Table.Root size="sm">
            <Table.Body>
              {orders.map((order) => (
                <Table.Row key={order.id} h={16} bg={"transparent"}>
                  <Table.Cell fontWeight={"semibold"}>
                    {order.orderNumber}
                  </Table.Cell>
                  <Table.Cell color={"fg.muted"}>{order.createdAt}</Table.Cell>
                  <Table.Cell color={"fg.muted"}>{order.customer}</Table.Cell>
                  <Table.Cell>
                    <Highlight
                      query={order.status}
                      styles={{
                        fontWeight: "semibold",
                        textTransform: "capitalize",
                        py: 1.5,
                        px: 2.5,
                        borderRadius: "xl",
                        color: orderStatusColors[order.status].color,
                        bg: orderStatusColors[order.status].bg,
                      }}
                    >
                      {order.status}
                    </Highlight>
                  </Table.Cell>
                  <Table.Cell fontWeight={"semibold"} textAlign="end">
                    <FormatNumber
                      value={order.cost}
                      notation="compact"
                      compactDisplay="short"
                      style="currency"
                      currency="USD"
                      maximumFractionDigits={2}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </DashboardCard>
      </Flex>

      <Grid templateColumns="repeat(auto-fit, minmax(400px , 1fr))" gap={6}>
        <DashboardCard title="Top Products" path="products">
          <List.Root as="ol" variant="plain">
            {topSalesProducts.map((product) => (
              <List.Item my={2} key={product.id}>
                <HStack gap="2" w={"full"} justifyContent={"space-between"}>
                  <HStack>
                    <Box bg={"gray.200"} borderRadius={"full"} p={1}>
                      <Image
                        src={`${import.meta.env.VITE_SERVER_URL}${product.thumbnail.url}`}
                        alt={product.thumbnail.alternativeText}
                        boxSize={"50px"}
                        objectFit={"cover"}
                      />
                    </Box>
                    <VStack gap={0} alignItems={"start"}>
                      <Text fontWeight="medium" textStyle="sm">
                        {product.title}
                      </Text>
                      <Text color="fg.muted" textStyle="sm">
                        {product.sold} sold
                      </Text>
                    </VStack>
                  </HStack>
                  <Stack>
                    <Text fontWeight={"semibold"} textStyle="sm">
                      <FormatNumber
                        value={product.price * product.sold}
                        style="currency"
                        currency="USD"
                        maximumFractionDigits={0}
                      />
                    </Text>
                  </Stack>
                </HStack>
              </List.Item>
            ))}
          </List.Root>
        </DashboardCard>

        <DashboardCard title="Top Categories" flex={"1"} path="categories">
          <Center h={"full"}>
            <HStack w={"full"}>
              <Chart.Root chart={categoriesChart} flex={1}>
                <PieChart responsive>
                  <Tooltip
                    cursor={false}
                    animationDuration={100}
                    content={<Chart.Tooltip hideLabel />}
                  />
                  <Pie
                    innerRadius={"75%"}
                    outerRadius={"100%"}
                    isAnimationActive={false}
                    data={categoriesChart.data}
                    dataKey={categoriesChart.key("value")}
                    nameKey={"name"}
                    shape={(props) => (
                      <Sector
                        {...props}
                        fill={categoriesChart.color(props.payload!.color)}
                      />
                    )}
                  >
                    <Label
                      content={({ viewBox }) => (
                        <Chart.RadialText
                          viewBox={viewBox}
                          title={categoriesChart
                            .getTotal("value")
                            .toLocaleString()}
                          description="Total Products"
                          gap={20}
                        />
                      )}
                    />
                  </Pie>
                </PieChart>
              </Chart.Root>
              <List.Root as="ol" variant="plain">
                {categoriesChart.data.slice(0, 6).map((cat) => (
                  <List.Item key={cat.value} my={2}>
                    <HStack gap="2" w={"full"} justifyContent={"space-between"}>
                      <HStack>
                        <Box
                          bg={cat.color}
                          borderRadius={"full"}
                          boxSize={"10px"}
                        />
                        <Text
                          fontWeight="medium"
                          textStyle="sm"
                          textWrapMode={"nowrap"}
                        >
                          {cat.name.length > 12
                            ? cat.name.slice(0, 12) + "..."
                            : cat.name}
                        </Text>
                      </HStack>
                      <Text fontWeight={"semibold"} textStyle="sm">
                        <FormatNumber
                          value={cat.value / categoriesChart.getTotal("value")}
                          style="percent"
                          maximumFractionDigits={0}
                        />
                      </Text>
                    </HStack>
                  </List.Item>
                ))}
              </List.Root>
            </HStack>
          </Center>
        </DashboardCard>

        <DashboardCard title="New Customers" path="customers">
          <VStack gap="4" alignItems={"left"}>
            {users.map((user) => (
              <HStack key={user.email} gap="2" justifyContent={"space-between"}>
                <HStack>
                  <Avatar.Root>
                    <Avatar.Fallback textStyle="sm" name={user.name} />
                    <Avatar.Image src={user.avatar} />
                  </Avatar.Root>
                  <VStack gap={0} alignItems={"start"}>
                    <Text fontWeight="medium" textStyle="sm">
                      {user.name}
                    </Text>
                    <Text color="fg.muted" textStyle="sm">
                      {user.email}
                    </Text>
                  </VStack>
                </HStack>
                <Stack>
                  <Text color="fg.muted" textStyle="sm">
                    {user.createdAt}
                  </Text>
                </Stack>
              </HStack>
            ))}
          </VStack>
        </DashboardCard>
      </Grid>
    </Box>
  );
};

export default function Dashboard() {
  return (
    <Flex>
      <DashboardContent />
    </Flex>
  );
}
