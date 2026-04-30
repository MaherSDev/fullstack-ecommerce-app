import Dashboard from "@/admin/pages/Dashboard";
import ManageCategories from "@/admin/pages/ManageCategories";
import ManageProducts from "@/admin/pages/ManageProducts";
import Media from "@/admin/pages/Media";
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
    page: <ManageCategories />,
  },
  {
    label: "Media",
    path: "media",
    icon: <FiSettings />,
    page: <Media />,
  },
];
