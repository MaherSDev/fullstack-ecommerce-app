import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages";
import Admin from "@/pages/Admin";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/layout/AppLayout";
import LoginLayout from "@/layout/LoginLayout";
import Products from "@/pages/ProductsPage";
import ProductPage from "@/pages/Product";
import LoginPage from "@/pages/Login";
import ProtectedRoute from "@/layout/ProtectedRoutes";

function App() {
  return (
    <>
      <Routes>
        {/** Public Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:documentId" element={<ProductPage />} />
        </Route>

        {/** Routes Require Login ( Access Token) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Admin />} />
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
