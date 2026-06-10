import { useMemo } from "react";
import type { Categoria } from "../types";

type CategoriaDetailModalProps = {
  categoria: Categoria;
  onClose: () => void;
  categorias: Categoria[];
};

const CategoriaDetailModal = ({ categoria, onClose, categorias }: CategoriaDetailModalProps) => {
  const subcategorias = useMemo(
    () => categorias.filter((c) => c.parent_id === categoria.id),
    [categorias, categoria.id]
  );

  const padre = categoria.parent_id
    ? categorias.find((c) => c.id === categoria.parent_id)
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Detalle de Categoría</h2>
            <p className="text-sm text-gray-500">#{categoria.id}</p>
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

        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Nombre</p>
              <p className="text-gray-900 font-medium">{categoria.nombre}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Descripción</p>
              <p className="text-gray-700">{categoria.descripcion}</p>
            </div>

            {padre && (
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <p className="text-xs text-indigo-500 uppercase font-medium mb-1">Categoría Padre</p>
                <p className="text-gray-900 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {padre.nombre}
                </p>
              </div>
            )}

            {!padre && (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <p className="text-xs text-amber-500 uppercase font-medium mb-1">Tipo</p>
                <p className="text-gray-900 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Categoría Raíz
                </p>
              </div>
            )}

            {subcategorias.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                  Subcategorías ({subcategorias.length})
                </p>
                <ul className="space-y-1">
                  {subcategorias.map((sub) => (
                    <li key={sub.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {sub.nombre}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {categoria.imagen_url && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Imagen</p>
                <img
                  src={categoria.imagen_url}
                  alt={categoria.nombre}
                  className="max-w-full h-32 object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
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

export default CategoriaDetailModal;
