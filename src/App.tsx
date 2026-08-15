import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CartPage from "./pages/CartPage";
import CatalogPage from "./pages/CatalogPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/categoria/:slug" element={<CatalogPage />} />
        <Route path="/produto/:id" element={<ProductPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
