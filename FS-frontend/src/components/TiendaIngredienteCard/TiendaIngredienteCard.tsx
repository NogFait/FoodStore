import type { Ingrediente } from "../../types/ingrediente";

type TiendaIngredienteCardProps = {
  ingrediente: Ingrediente;
};

const TiendaIngredienteCard = ({ ingrediente }: TiendaIngredienteCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 border-l-4 border-indigo-500">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">{ingrediente.nombre}</h3>
        {ingrediente.es_alergeno && (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
            Alérgeno
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 line-clamp-2">{ingrediente.descripcion}</p>
      {ingrediente.es_alergeno && (
        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Puede causar reacciones alérgicas
        </p>
      )}
    </div>
  );
};

export default TiendaIngredienteCard;
