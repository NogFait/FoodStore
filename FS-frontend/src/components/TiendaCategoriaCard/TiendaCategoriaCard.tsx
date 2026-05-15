import { useState } from "react";
import type { Categoria } from "../../types/categoria";

type TiendaCategoriaCardProps = {
  categoria: Categoria;
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

const TiendaCategoriaCard = ({ categoria }: TiendaCategoriaCardProps) => {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !categoria.imagen_url || imgError;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
      {showPlaceholder ? (
        <div
          className={`h-40 bg-gradient-to-br ${placeholderGradient(categoria.nombre)} flex items-center justify-center`}
        >
          <span className="text-4xl font-bold text-white/80">
            {categoria.nombre.charAt(0).toUpperCase()}
          </span>
        </div>
      ) : (
        <div className="h-40 overflow-hidden">
          <img
            src={categoria.imagen_url}
            alt={categoria.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{categoria.nombre}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{categoria.descripcion}</p>
      </div>
    </div>
  );
};

export default TiendaCategoriaCard;
