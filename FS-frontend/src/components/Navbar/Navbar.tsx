import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

const Navbar = () => {
  const location = useLocation();
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white text-xl font-bold tracking-tight">
            TiendaOnline
          </Link>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : user ? (
              <>
                <span className="text-white/90 text-sm font-medium">
                  {user.full_name}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-white/15 rounded-lg hover:bg-white/25 transition-all"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/login"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/register"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
