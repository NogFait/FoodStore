import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/useAuth";
import {Outlet} from "react-router-dom";
import { Spinner } from "../../../components/ui/Spinner";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  if (isLoading) return <Spinner />;
// validamos que el usuario primero este autenticado, sino lo redirigimos al login
  if ( !isAuthenticated ) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  if (isLoading) return <Spinner />;
  // Si el usuario ya está autenticado, lo redirigimos al panel de admin, sino lo dejamos acceder a las rutas públicas como login o register
  if (isAuthenticated) return <Navigate to="/categorias" replace />;
  return <Outlet />;
}

export function RootRedirect() {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
}
