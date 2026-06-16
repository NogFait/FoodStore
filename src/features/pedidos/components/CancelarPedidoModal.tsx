import { useState } from "react";

type Props = {
  isOpen: boolean;
  pedidoId: number;
  isPending: boolean;
  onConfirm: (motivo: string) => void;
  onCancel: () => void;
};

/**
 * Modal de cancelación de pedido.
 * Requiere un motivo no vacío antes de habilitar la confirmación (RN-05).
 */
const CancelarPedidoModal = ({ isOpen, pedidoId, isPending, onConfirm, onCancel }: Props) => {
  const [motivo, setMotivo] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const trimmed = motivo.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
  };

  const handleClose = () => {
    setMotivo("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
            Cancelar pedido #{pedidoId}
          </h3>
          <p className="text-gray-500 text-center text-sm mb-4">
            Esta acción no se puede deshacer.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo de cancelación <span className="text-red-500">*</span>
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Indicá el motivo de la cancelación"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
          />
          {motivo.trim() === "" && (
            <p className="mt-1 text-xs text-red-500">El motivo es obligatorio.</p>
          )}
        </div>

        <div className="flex border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="flex-1 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending || motivo.trim() === ""}
            className="flex-1 py-3 text-red-600 font-medium border-l border-gray-200 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Cancelando…" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelarPedidoModal;
