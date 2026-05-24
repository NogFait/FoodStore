import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {Outlet} from "react-router-dom";
import { Spinner } from "../../../components/ui/Spinner";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
// validamos que el usuario primero exista o tenga id o rol. si no tiene, pal lobby, o login XD
  if ( !user || !user.id || !user.role ) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function PublicRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  if (user && user.id && user.role) {
    return <Navigate to="/categorias" replace />;
  }

  return <Outlet />;
}
