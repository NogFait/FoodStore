import type { Producto } from "../types";
import type { Categoria } from "../../categorias/types";
import type { Ingrediente } from "../../ingredientes/types";
import type { UnidadMedida } from "../../unidades-medida/types";

type ProductoDetailModalProps = {
  producto: Producto;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  unidadesMedida: UnidadMedida[];
  onClose: () => void;
};

const ProductoDetailModal = ({ producto, categorias, ingredientes, unidadesMedida, onClose }: ProductoDetailModalProps) => {
  const nombresCategorias = producto.categorias_ids
    .map((id) => categorias.find((cat) => cat.id === id)?.nombre)
    .filter(Boolean)
    .join(", ");

  const nombresIngredientes = producto.ingredientes_ids
    .map((id) => ingredientes.find((ing) => ing.id === id)?.nombre)
    .filter(Boolean);

  const ingredientesAlergen = producto.ingredientes_ids
    .filter((id) => ingredientes.find((ing) => ing.id === id)?.es_alergeno)
    .map((id) => ingredientes.find((ing) => ing.id === id)?.nombre)
    .filter(Boolean);

  const unid = (id: number | null | undefined) =>
    unidadesMedida.find((u) => u.id === id);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center">
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

        {producto.imagenes_url && (
          <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
            <img
              src={producto.imagenes_url}
              alt={producto.nombre}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Nombre</p>
              <p className="text-gray-900 font-medium">{producto.nombre}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Descripción</p>
              <p className="text-gray-700">{producto.descripcion}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Precio</p>
                <p className="text-gray-900 font-medium">${producto.precio_base.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Stock</p>
                <p className={`font-medium ${producto.stock_cantidad === 0 ? "text-red-500" : "text-gray-900"}`}>
                  {producto.stock_cantidad === 0 ? "Sin stock" : producto.stock_cantidad}
                </p>
              </div>
            </div>
            {producto.unidad_venta_id && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Unidad de Venta</p>
                <p className="text-gray-900 font-medium">
                  {unid(producto.unidad_venta_id)?.nombre ?? producto.unidad_venta_id}
                </p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Categorías</p>
              <p className="text-gray-700">
                {producto.categorias_ids?.length > 0 ? nombresCategorias : "Sin categorías"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Ingredientes</p>
              {producto.ingredientes && producto.ingredientes.length > 0 ? (
                <div className="space-y-2">
                  {producto.ingredientes.map((pi) => {
                    const ing = ingredientes.find((i) => i.id === pi.ingrediente_id);
                    return (
                      <div
                        key={pi.ingrediente_id}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${
                          ing?.es_alergeno
                            ? "border-amber-200 bg-amber-50/50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-medium">{ing?.nombre ?? "?"}</span>
                          {ing?.es_alergeno && (
                            <span className="text-[10px] uppercase tracking-wider text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-semibold">
                              Alérgeno
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {pi.cantidad != null && (
                            <span>
                              {pi.cantidad} {unid(pi.unidad_medida_id)?.simbolo ?? ""}
                            </span>
                          )}
                          {pi.es_removible && (
                            <span className="text-indigo-500 font-medium">Removible</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-700">
                  {producto.ingredientes_ids?.length > 0
                    ? nombresIngredientes.join(", ")
                    : "Sin ingredientes"}
                </p>
              )}
              {ingredientesAlergen.length > 0 && !producto.ingredientes?.length && (
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
