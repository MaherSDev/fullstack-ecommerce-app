import { Route, Routes } from "react-router-dom";
import HomePage from "./pages";
import AboutPage from "./pages/AboutPage";
import Team from "./pages/Team";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Products from "./components/ProductsPage";
import { Box } from "@chakra-ui/react";
import { Toaster } from "./components/ui/toaster";
import AppLayout from "./layout/AppLayout";
import ProductPage from "./components/Product";

function App() {
  return (
    <>
      {/* <NavBar /> */}
      <Box as={"div"} h="calc(100dvh - 64px)">
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:documentId" element={<ProductPage />} />
            <Route path="/team" element={<Team />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
      <Toaster />
    </>
  );
}

export default App;
