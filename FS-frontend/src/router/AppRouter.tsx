import { Navigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import ProductosPage from "../features/productos/pages/ProductosPage";
import CategoriasPage from "../features/categorias/pages/CategoriasPage";
import IngredientesPage from "../features/ingredientes/pages/IngredientesPage";
import UnidadesMedidaPage from "../features/unidades-medida/pages/UnidadesMedidaPage";
import PedidosPage from "../features/pedidos/pages/PedidosPage";
import DireccionesPage from "../features/direcciones/pages/DireccionesPage";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import { ProtectedRoute, PublicRoute } from "../features/auth/components/ProtectedRoute";
import { useAuth } from "../features/auth/hooks/useAuth";


//fx para que verifique si hay usuario logueado, si no encuentra pal login, si encuentra al panel del admin
function RootRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }
  if (user && user.id && Array.isArray(user.roles)) {
    return <Navigate to="/categorias" replace />;
  }
  return <Navigate to="/login" replace />;
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
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
        path="/unidades-medida"
        element={
          <ProtectedRoute>
            <UnidadesMedidaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/direcciones"
        element={
          <ProtectedRoute>
            <DireccionesPage />
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
