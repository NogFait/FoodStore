import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/categorias", label: "Categorías" },
  { path: "/productos", label: "Productos" },
  { path: "/ingredientes", label: "Ingredientes" },
  { path: "/unidades-medida", label: "Unidades" },
  { path: "/pedidos", label: "Pedidos" },
  { path: "/dashboard", label: "Dashboard" }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] flex-shrink-0">
      <nav className="py-4 px-3 space-y-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
