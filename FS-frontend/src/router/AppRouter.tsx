import { Navigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import ProductosPage from "../features/productos/pages/ProductosPage";
import CategoriasPage from "../features/categorias/pages/CategoriasPage";
import IngredientesPage from "../features/ingredientes/pages/IngredientesPage";
import PedidosPage from "../features/pedidos/pages/PedidosPage";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import { ProtectedRoute, PublicRoute } from "../features/auth/components/ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/categorias" replace />} />
      <Route
        path="/productos"
        element={
          <ProtectedRoute>
            <ProductosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categorias"
        element={
          <ProtectedRoute>
            <CategoriasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ingredientes"
        element={
          <ProtectedRoute>
            <IngredientesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <ProtectedRoute>
            <PedidosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
