import { Navigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import ProductosPage from "../pages/ProductosPage";
import CategoriasPage from "../pages/CategoriasPage";
import IngredientesPage from "../pages/IngredientesPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/categorias" replace />} />
      <Route path="/productos" element={<ProductosPage />} />
      <Route path="/categorias" element={<CategoriasPage />} />
      <Route path="/ingredientes" element={<IngredientesPage />} />
    </Routes>
  );
};

export default AppRouter;
