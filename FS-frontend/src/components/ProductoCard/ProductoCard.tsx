import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";

type ProductoCardProps = {
  producto: Producto;
  categorias: Categoria[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onView: (producto: Producto) => void;
};

const ProductoCard = ({ producto, categorias, onEdit, onDelete, onView }: ProductoCardProps) => {
  // Obtener nombres de categorías a partir de los IDs
  const nombresCategorias = producto.categorias_ids
    .map((id) => categorias.find((cat) => cat.id === id)?.nombre)
    .filter(Boolean)
    .join(", ");

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
        {producto.descripcion}
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
        </div>
      </td>
    </tr>
  );
};

export default ProductoCard;
