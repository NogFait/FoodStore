import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRole } from "../../hooks/useRole";

interface NavItem {
  path: string;
  label: string;
  visible: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, canStock, can } = useRole();

  // Visibilidad por ítem; un grupo se muestra si tiene al menos un ítem visible.
  const groups: NavGroup[] = [
    {
      group: "Operación",
      items: [
        { path: "/pedidos", label: "Pedidos", visible: can("ver-pedidos") },
        // Ingredientes (stock) es operativo: lo gestionan ADMIN, CAJA y COCINA.
        { path: "/ingredientes", label: "Ingredientes", visible: canStock },
      ],
    },
    {
      group: "Catálogo",
      items: [
        { path: "/productos", label: "Productos", visible: isAdmin },
        { path: "/categorias", label: "Categorías", visible: isAdmin },
        { path: "/unidades-medida", label: "Unidades de medida", visible: isAdmin },
      ],
    },
    {
      group: "Administración",
      items: [
        { path: "/usuarios", label: "Usuarios", visible: isAdmin },
        { path: "/dashboard", label: "Dashboard", visible: isAdmin },
      ],
    },
  ];

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleGroup = (group: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  const visibleGroups = groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.visible) }))
    .filter((g) => g.items.length > 0);

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] flex-shrink-0">
      <nav className="py-4 px-3 space-y-4">
        {visibleGroups.map((group) => {
          const isCollapsed = collapsed.has(group.group);
          return (
            <div key={group.group}>
              <button
                onClick={() => toggleGroup(group.group)}
                className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
              >
                <span>{group.group}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {!isCollapsed && (
                <div className="mt-1 space-y-1">
                  {group.items.map((link) => {
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
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
