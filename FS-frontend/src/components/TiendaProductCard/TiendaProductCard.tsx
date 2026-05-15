import { useState } from "react";
import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";

type TiendaProductCardProps = {
  producto: Producto;
  categorias: Categoria[];
};

const placeholderGradient = (name: string) => {
  const colors = [
    "from-indigo-400 to-purple-500",
    "from-emerald-400 to-teal-500",
    "from-rose-400 to-pink-500",
    "from-amber-400 to-orange-500",
    "from-cyan-400 to-blue-500",
    "from-fuchsia-400 to-violet-500",
  ];
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const TiendaProductCard = ({ producto, categorias }: TiendaProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !producto.imagenes_url || imgError;

  const nombresCategorias = producto.categorias_ids
    .map((id) => categorias.find((c) => c.id === id)?.nombre)
    .filter(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {showPlaceholder ? (
        <div
          className={`h-48 bg-gradient-to-br ${placeholderGradient(producto.nombre)} flex items-center justify-center`}
        >
          <span className="text-5xl font-bold text-white/80">
            {producto.nombre.charAt(0).toUpperCase()}
          </span>
        </div>
      ) : (
        <div className="h-48 overflow-hidden">
          <img
            src={producto.imagenes_url}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="p-5">
        {producto.stock_cantidad === 0 ? (
          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full mb-2">
            Sin stock
          </span>
        ) : producto.stock_cantidad <= 5 ? (
          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full mb-2">
            Quedan {producto.stock_cantidad}
          </span>
        ) : (
          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full mb-2">
            Disponible
          </span>
        )}

        <h3 className="text-lg font-bold text-gray-900 mb-1">{producto.nombre}</h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{producto.descripcion}</p>

        {nombresCategorias.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {nombresCategorias.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-2xl font-bold text-indigo-600">
            ${producto.precio_base.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TiendaProductCard;
