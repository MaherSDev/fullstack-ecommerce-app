import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages";
import AdminLayout from "@/admin/layout/AdminLayout";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/layout/AppLayout";
import LoginLayout from "@/layout/LoginLayout";
import Products from "@/pages/ProductsPage";
import ProductPage from "@/pages/Product";
import LoginPage from "@/pages/Login";
import ProtectedRoute from "@/layout/ProtectedRoutes";
import Dashboard from "./admin/pages/Dashboard";
import { SidebarContent } from "./admin/common/constants";
import Cart from "./pages/Cart";

function App() {
  return (
    <>
      <Routes>
        {/** Public Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:documentId" element={<ProductPage />} />
        </Route>

        {/** Routes Require Login ( Access Token) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            {[...SidebarContent.topMenu, ...SidebarContent.bottomMenu].map(
              ({ path, page }, key) => (
                <Route path={path} element={page} key={key} />
              ),
            )}
          </Route>
        </Route>

        {/** Handle Login Route for Login/Logout */}
        <Route path="/login" element={<LoginLayout />}>
          <Route index element={<LoginPage />} />
        </Route>
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
