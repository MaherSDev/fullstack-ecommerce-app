import Dashboard from "@/admin/pages/Dashboard";
import ManageCategories from "@/admin/pages/ManageCategories";
import ManageProducts from "@/admin/pages/ManageProducts";
import Media from "@/admin/pages/Media";
import type { INavLinks } from "@/interfaces";
import {
  FiBox,
  FiGrid,
  FiShoppingCart,
  FiUsers,
  FiUser,
  FiBarChart2,
  FiSettings,
  FiImage,
} from "react-icons/fi";

const today = new Date();
const dayInMs = 1000 * 60 * 60 * 24;

export const SidebarContent: INavLinks = {
  topMenu: [
    {
      label: "Dashboard",
      path: "",
      icon: <FiGrid />,
      page: <Dashboard />,
    },
    {
      label: "Products",
      path: "products",
      icon: <FiBox />,
      page: <ManageProducts />,
    },
    {
      label: "Categories",
      path: "categories",
      icon: <FiGrid />,
      page: <ManageCategories />,
    },

    {
      label: "Orders",
      path: "orders",
      icon: <FiShoppingCart />,
      page: <div>Orders</div>,
    },
    {
      label: "Users",
      path: "users",
      icon: <FiUsers />,
      page: <div>Users</div>,
    },
    {
      label: "Customers",
      path: "customers",
      icon: <FiUser />,
      page: <div>Customers</div>,
    },
    {
      label: "Media",
      path: "media",
      icon: <FiImage />,
      page: <Media />,
    },
  ],
  bottomMenu: [
    {
      label: "Reports",
      path: "reports",
      icon: <FiBarChart2 />,
      page: <div>Reports</div>,
    },
    {
      label: "Settings",
      path: "settings",
      icon: <FiSettings />,
      page: <div>Settings</div>,
    },
  ],
};

export const users = [
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://i.pravatar.cc/300?u=po",
    createdAt: "April 18, 2026",
  },
  {
    name: "Daniel Martinez",
    email: "daniel.m@example.com",
    avatar: "https://i.pravatar.cc/300?u=iu",
    createdAt: "April 18, 2026",
  },
  {
    name: "Olivia Brown",
    email: "olivia.b@example.com",
    avatar: "https://i.pravatar.cc/300?u=ac",
    createdAt: "April 17, 2026",
  },
  {
    name: "James Taylor",
    email: "james.t@example.com",
    avatar: "https://i.pravatar.cc/300?u=pc",
    createdAt: "April 17, 2026",
  },
];
export const modules = [
  {
    label: "Products",
    value: 138,
    icon: {
      color: "blue.500",
      bg: "blue.200",
      element: <FiBox />,
    },
    growValue: 12.5,
  },
  {
    label: "Categories",
    value: 12,
    icon: {
      color: "green.500",
      bg: "green.200",
      element: <FiGrid />,
    },
    growValue: 7.2,
  },
  {
    label: "Orders",
    value: 532,
    icon: {
      color: "purple.500",
      bg: "purple.200",
      element: <FiShoppingCart />,
    },
    growValue: 15.3,
  },
  {
    label: "Users",
    value: 8,
    icon: {
      color: "orange.500",
      bg: "orange.200",
      element: <FiUsers />,
    },
    growValue: 2.1,
  },
  {
    label: "Customers",
    value: 180,
    icon: {
      color: "red.500",
      bg: "red.200",
      element: <FiUser />,
    },
    growValue: "13",
  },
];

export const orders = [
  {
    id: 1,
    orderNumber: "#ORD-1048",
    customer: "john doe",
    status: "completed",
    cost: 129.99,
    createdAt: "April 18, 2026",
  },
  {
    id: 2,
    orderNumber: "#ORD-1047",
    customer: "jane smith",
    status: "processing",
    cost: 5140.5,
    createdAt: "April 18, 2026",
  },
  {
    id: 3,
    orderNumber: "#ORD-1046",
    customer: "michael brown",
    status: "shipped",
    cost: 199.0,
    createdAt: "April 17, 2026",
  },
  {
    id: 4,
    orderNumber: "#ORD-1048",
    customer: "emily johnson",
    status: "completed",
    cost: 1800.50,
    createdAt: "April 17, 2026",
  },
  {
    id: 5,
    orderNumber: "#ORD-1047",
    customer: "david wilson",
    status: "cancelled",
    cost: 79.9,
    createdAt: "April 16, 2026",
  },
];
export const orderStatusColors = {
  completed: {
    color: "green.600",
    bg: "green.200",
  },
  processing: {
    color: "orange.600",
    bg: "orange.200",
  },
  shipped: {
    color: "blue.600",
    bg: "blue.200",
  },
  cancelled: {
    color: "red.600",
    bg: "red.200",
  },
};

export const topSalesProducts = [
  {
    id: 155,
    title: "Bluetooth Speaker",
    price: 50,
    sold: 222,
    thumbnail: {
      id: 44,
      name: "cat_img7.png",
      alternativeText: "Bluetooth Speaker",
      url: "/uploads/cat_img7_5193f31832.png",
    },
  },
  {
    id: 156,
    title: "Lenovo slip pro",
    price: 500,
    sold: 51,
    thumbnail: {
      id: 45,
      name: "Laptop.png",
      alternativeText: "Lenovo slip pro",
      url: "/uploads/Laptop_f679d08608.png",
    },
  },
  {
    id: 158,
    title: "JBL HeadPhones",
    price: 70,
    sold: 130,
    thumbnail: {
      id: 46,
      name: "cat_img3.png",
      alternativeText: "JBL HeadPhones",
      url: "/uploads/cat_img3_4e72ccbaf5.png",
    },
  },
  {
    id: 160,
    title: "Apple Smartwatch",
    price: 410,
    sold: 129,
    thumbnail: {
      id: 47,
      name: "cat_img4.png",
      alternativeText: "Apple Smartwatch",
      url: "/uploads/cat_img4_09204f3884.png",
    },
  },
];

export const sales = [
  {
    orders: 18600,
    revenue: 1200,
    month: new Date(+today - dayInMs * 6),
  },
  {
    orders: 17500,
    revenue: 2500.5,
    month: new Date(+today - dayInMs * 5),
  },
  {
    orders: 19000,
    revenue: 2500,
    month: new Date(+today - dayInMs * 4),
  },
  {
    orders: 19500,
    revenue: 1800,
    month: new Date(+today - dayInMs * 3),
  },
  {
    orders: 19600,
    revenue: 3000,
    month: new Date(+today - dayInMs * 2),
  },
  {
    orders: 19600,
    revenue: 3000,
    month: new Date(+today - dayInMs),
  },
  {
    orders: 19600,
    revenue: 3000,
    month: new Date(+today),
  },
];

export const categories = [
  { name: "Smartphones", value: 15, color: "blue.solid" },
  { name: "Computers", value: 35, color: "orange.solid" },
  { name: "Accessories", value: 69, color: "pink.solid" },
  { name: "Xbox & Playstation", value: 19, color: "green.solid" },
  { name: "Smartphones", value: 15, color: "blue.solid" },
  { name: "Computers", value: 35, color: "orange.solid" },
  { name: "Accessories", value: 69, color: "pink.solid" },
  { name: "Xbox & Playstation", value: 19, color: "green.solid" },
];
