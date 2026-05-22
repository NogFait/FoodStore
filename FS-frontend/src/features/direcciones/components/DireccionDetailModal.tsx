import type { Direccion } from "../types";

type DireccionDetailModalProps = {
  direccion: Direccion;
  onClose: () => void;
};

const DireccionDetailModal = ({ direccion, onClose }: DireccionDetailModalProps) => {
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
            <h2 className="text-lg font-semibold text-gray-900">Detalle de Dirección</h2>
            <p className="text-sm text-gray-500">#{direccion.id}</p>
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
            {direccion.es_principal && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-green-700">Dirección principal</span>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Alias</p>
              <p className="text-gray-900 font-medium">{direccion.alias}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Dirección</p>
              <p className="text-gray-900">{direccion.linea1}</p>
              {direccion.linea2 && (
                <p className="text-gray-600 text-sm">{direccion.linea2}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Ciudad</p>
                <p className="text-gray-900 font-medium">{direccion.ciudad}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Provincia</p>
                <p className="text-gray-900 font-medium">{direccion.provincia}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Código Postal</p>
              <p className="text-gray-900 font-medium">{direccion.codigo_postal}</p>
            </div>

            {(direccion.latitud || direccion.longitud) && (
              <div className="grid grid-cols-2 gap-4">
                {direccion.latitud && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Latitud</p>
                    <p className="text-gray-900 font-medium font-mono">{direccion.latitud}</p>
                  </div>
                )}
                {direccion.longitud && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Longitud</p>
                    <p className="text-gray-900 font-medium font-mono">{direccion.longitud}</p>
                  </div>
                )}
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

export default DireccionDetailModal;
