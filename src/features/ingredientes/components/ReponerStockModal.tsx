import { useState } from "react";

type Props = {
  isOpen: boolean;
  ingredienteNombre: string;
  isPending: boolean;
  onConfirm: (cantidad: number) => void;
  onCancel: () => void;
};

const ReponerStockModal = ({
  isOpen,
  ingredienteNombre,
  isPending,
  onConfirm,
  onCancel,
}: Props) => {
  const [cantidad, setCantidad] = useState<string>("");

  if (!isOpen) return null;

  const cantidadNum = parseInt(cantidad, 10);
  const esValida = !isNaN(cantidadNum) && cantidadNum > 0;

  const handleConfirm = () => {
    if (!esValida) return;
    onConfirm(cantidadNum);
  };

  const handleClose = () => {
    setCantidad("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
            Reponer stock
          </h3>
          <p className="text-gray-500 text-center text-sm mb-4">
            {ingredienteNombre}
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva cantidad <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Ej: 10"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          {!esValida && cantidad !== "" && (
            <p className="mt-1 text-xs text-red-500">
              Ingresá una cantidad mayor a 0.
            </p>
          )}
        </div>

        <div className="flex border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="flex-1 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending || !esValida}
            className="flex-1 py-3 text-green-600 font-medium border-l border-gray-200 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Guardando…" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReponerStockModal;
