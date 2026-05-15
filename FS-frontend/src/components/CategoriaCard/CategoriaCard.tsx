import type { Categoria } from "../../types/categoria";

type CategoriaCardProps = {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
  onView: (categoria: Categoria) => void;
  isAdmin: boolean;
};

const CategoriaCard = ({ categoria, onEdit, onDelete, onView, isAdmin }: CategoriaCardProps) => {
  return (
    <tr className="bg-white hover:bg-indigo-50 transition-colors duration-200">
      <td className="px-6 py-4 text-sm text-indigo-600 font-semibold">
        {categoria.id}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {categoria.nombre}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {categoria.descripcion}
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onView(categoria)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
          >
            Ver
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(categoria)}
                className="px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(categoria.id)}
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

export default CategoriaCard;
