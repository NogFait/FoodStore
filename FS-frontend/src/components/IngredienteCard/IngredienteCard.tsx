import type { Ingrediente } from "../../types/ingrediente";

type IngredienteCardProps = {
  ingrediente: Ingrediente;
  onEdit: (ingrediente: Ingrediente) => void;
  onDelete: (id: number) => void;
  onView: (ingrediente: Ingrediente) => void;
  isAdmin: boolean;
};

const IngredienteCard = ({ ingrediente, onEdit, onDelete, onView, isAdmin }: IngredienteCardProps) => {
  return (
    <tr className="bg-white hover:bg-indigo-50 transition-colors duration-200">
      <td className="px-6 py-4 text-sm text-indigo-600 font-semibold">
        {ingrediente.id}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {ingrediente.nombre}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {ingrediente.descripcion}
      </td>
      <td className="px-6 py-4 text-sm">
        <span className={`px-3 py-1 rounded-full font-medium ${ingrediente.es_alergeno ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {ingrediente.es_alergeno ? "Sí" : "No"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onView(ingrediente)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
          >
            Ver
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(ingrediente)}
                className="px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(ingrediente.id)}
                className="px-3 py-1.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default IngredienteCard;