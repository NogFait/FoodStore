import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold tracking-tight">
              TiendaOnline
            </Link>
          </div>
          <div className="flex gap-1">
            <Link
              to="/categorias"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/categorias")
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Categorías
            </Link>
            <Link
              to="/productos"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/productos")
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Productos
            </Link>
            <Link
              to="/ingredientes"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/ingredientes")
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Ingredientes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
