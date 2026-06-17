import { Navigate } from "react-router-dom";
import { useAuth, useIsAuthenticated } from "../hooks/useAuth";
import {Outlet} from "react-router-dom";
import { Spinner } from "../../../components/ui/Spinner";
import { rutaInicialParaRoles } from "../landing";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  if (isLoading) return <Spinner />;
// validamos que el usuario primero este autenticado, sino lo redirigimos al login
  if ( !isAuthenticated ) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function PublicRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  // Si el usuario ya está autenticado, lo redirigimos según su rol; sino accede a login/register.
  if (user) return <Navigate to={rutaInicialParaRoles(user.roles)} replace />;
  return <Outlet />;
}

export function RootRedirect() {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
}
