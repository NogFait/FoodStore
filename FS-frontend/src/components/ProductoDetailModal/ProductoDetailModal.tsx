import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";
import type { Ingrediente } from "../../types/ingrediente";

type ProductoDetailModalProps = {
  producto: Producto;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  onClose: () => void;
};

const ProductoDetailModal = ({ producto, categorias, ingredientes, onClose }: ProductoDetailModalProps) => {
  // Obtener nombres de categorías
  const nombresCategorias = producto.categorias_ids
    .map((id) => categorias.find((cat) => cat.id === id)?.nombre)
    .filter(Boolean)
    .join(", ");

  // Obtener nombres de ingredientes
  const nombresIngredientes = producto.ingredientes_ids
    .map((id) => ingredientes.find((ing) => ing.id === id)?.nombre)
    .filter(Boolean)
    .join(", ");

  // Obtener ingredientes alérgenos
  const ingredientesAlergen = producto.ingredientes_ids
    .filter((id) => ingredientes.find((ing) => ing.id === id)?.es_alergeno)
    .map((id) => ingredientes.find((ing) => ing.id === id)?.nombre)
    .filter(Boolean);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Detalle de Producto</h2>
            <p className="text-sm text-gray-500">#{producto.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Nombre</p>
              <p className="text-gray-900 font-medium">{producto.nombre}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Descripción</p>
              <p className="text-gray-700">{producto.descripcion}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Precio Base</p>
              <p className="text-gray-900 font-medium">${producto.precio_base.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Stock</p>
              <p className={`font-medium ${producto.stock_cantidad === 0 ? "text-red-500" : "text-gray-900"}`}>
                {producto.stock_cantidad === 0 ? "Sin stock" : producto.stock_cantidad}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Categorías</p>
              <p className="text-gray-700">
                {producto.categorias_ids.length > 0 ? nombresCategorias : "Sin categorías"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Ingredientes</p>
              <p className="text-gray-700">
                {producto.ingredientes_ids?.length > 0 ? nombresIngredientes : "Sin ingredientes"}
              </p>
              {ingredientesAlergen.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {ingredientesAlergen.map((nombre) => (
                    <span key={nombre} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      ⚠️ Alérgeno: {nombre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetailModal;
