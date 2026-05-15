import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";
import type { Ingrediente } from "../../types/ingrediente";

type ProductoCardProps = {
  producto: Producto;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onView: (producto: Producto) => void;
  isAdmin: boolean;
};

const ProductoCard = ({ producto, categorias, ingredientes, onEdit, onDelete, onView, isAdmin }: ProductoCardProps) => {
  // Obtener nombres de categorías
  const nombresCategorias = producto.categorias_ids
    .map((id) => categorias.find((cat) => cat.id === id)?.nombre)
    .filter(Boolean)
    .join(", ");

  // Obtener nombres de ingredientes
  const nombresIngredientes = producto.ingredientes_ids
    ?.map((id) => ingredientes.find((ing) => ing.id === id)?.nombre)
    .filter(Boolean)
    .join(", ");

  // Verificar si tiene alérgenos
  const tieneAlergenOS = producto.ingredientes_ids?.some(
    (id) => ingredientes.find((ing) => ing.id === id)?.es_alergeno
  );

  return (
    <tr className="bg-white hover:bg-indigo-50 transition-colors duration-200">
      <td className="px-6 py-4 text-sm text-indigo-600 font-semibold">
        {producto.id}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {producto.nombre}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {nombresCategorias || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {nombresIngredientes || "-"}
        {tieneAlergenOS && (
          <span className="ml-1 text-amber-500" title="Contiene alérgenos">⚠️</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-green-600">
        ${producto.precio_base.toFixed(2)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {producto.stock_cantidad === 0 ? (
          <span className="text-red-500 font-medium">Sin stock</span>
        ) : (
          producto.stock_cantidad
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onView(producto)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
          >
            Ver
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(producto)}
                className="px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(producto.id)}
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

export default ProductoCard;
