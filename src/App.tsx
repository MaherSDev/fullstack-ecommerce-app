import { Route, Routes } from "react-router-dom";
import HomePage from "./pages";
import AboutPage from "./pages/AboutPage";
import Products from "./components/ProductsPage";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </>
  );
}

export default App;
