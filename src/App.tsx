import { Route, Routes } from "react-router-dom";
import HomePage from "./pages";
import AboutPage from "./pages/AboutPage";
import Team from "./pages/Team";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Products from "./components/ProductsPage";
import NavBar from "./layout/NavBar";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <>
      <NavBar />
      <Box as={"div"} h="calc(100dvh - 64px)">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/team" element={<Team />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
