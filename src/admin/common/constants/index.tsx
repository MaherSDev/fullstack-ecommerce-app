import Categories from "@/admin/pages/Categories";
import Dashboard from "@/admin/pages/Dashboard";
import ManageProducts from "@/admin/pages/ManageProducts";
import Settings from "@/admin/pages/Settings";
import type { INavLinks } from "@/interfaces";
import { FiCompass, FiHome, FiSettings, FiTrendingUp } from "react-icons/fi";

export const SidebarContent: INavLinks[] = [
  {
    label: "Home",
    path: "",
    icon: <FiHome />,
    page: <Dashboard />,
  },
  {
    label: "Products",
    path: "products",
    icon: <FiTrendingUp />,
    page: <ManageProducts />,
  },
  {
    label: "Categories",
    path: "categories",
    icon: <FiCompass />,
    page: <Categories />,
  },
  {
    label: "Settings",
    path: "settings",
    icon: <FiSettings />,
    page: <Settings />,
  },
];
