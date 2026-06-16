import { Navigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import ProductosPage from "../features/productos/pages/ProductosPage";
import CategoriasPage from "../features/categorias/pages/CategoriasPage";
import IngredientesPage from "../features/ingredientes/pages/IngredientesPage";
import UnidadesMedidaPage from "../features/unidades-medida/pages/UnidadesMedidaPage";
import PedidosPage from "../features/pedidos/pages/PedidosPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import {
  ProtectedRoute,
  PublicRoute,
} from "../features/auth/components/ProtectedRoute";
import { useIsAuthenticated } from "../features/auth/hooks/useAuth";
import { FullScreenSpinner } from "../components/ui/Spinner";
import AdminLayout from "../components/layout/AdminLayout";

//fx para que verifique si hay usuario logueado, si no encuentra pal login, si encuentra al panel del admin
function RootRedirect() {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  if (isLoading) return <FullScreenSpinner />;
  return <Navigate to={isAuthenticated ? "/categorias" : "/login"} replace />;
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
          <Route path="/unidades-medida" element={<UnidadesMedidaPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
