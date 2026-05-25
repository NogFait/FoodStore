import { useState } from "react";
import PedidoList from "../components/PedidoList";
import PedidoDetailModal from "../components/PedidoDetailModal";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import { usePedidos } from "../hooks/usePedidos";
import { ESTADOS_PEDIDO_CODES } from "../types";
import type { PedidoResumen } from "../types";

type ModalState =
  | { type: "none" }
  | { type: "detail"; pedidoId: number }
  | { type: "confirm-avanzar"; pedido: PedidoResumen }
  | { type: "confirm-cancelar"; pedido: PedidoResumen };

const PedidosPage = () => {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const {
    data,
    isLoading,
    error,
    refetch,
    filters,
    setFilters,
    avanzarMutation,
    cancelarMutation,
  } = usePedidos();

  const closeModal = () => setModal({ type: "none" });

  const handleView = (p: PedidoResumen) =>
    setModal({ type: "detail", pedidoId: p.id });
  const handleAvanzar = (p: PedidoResumen) =>
    setModal({ type: "confirm-avanzar", pedido: p });
  const handleCancelar = (p: PedidoResumen) =>
    setModal({ type: "confirm-cancelar", pedido: p });

  const confirmAvanzar = () => {
    if (modal.type === "confirm-avanzar") {
      avanzarMutation.mutate(modal.pedido.id, { onSuccess: closeModal });
    }
  };

  const confirmCancelar = () => {
    if (modal.type === "confirm-cancelar") {
      cancelarMutation.mutate(modal.pedido.id, { onSuccess: closeModal });
    }
  };

  const avanzarFromDetail = (id: number) => {
    avanzarMutation.mutate(id, { onSuccess: closeModal });
  };

  const cancelarFromDetail = (id: number) => {
    cancelarMutation.mutate(id, { onSuccess: closeModal });
  };

  const isMutating = avanzarMutation.isPending || cancelarMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
            <p className="mt-1 text-sm text-gray-500">
              {data ? `${data.length} pedidos en pantalla` : "Cargando..."}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refrescar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Estado:</label>
            <select
              value={filters.estado_codigo ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setFilters((prev) => ({
                  ...prev,
                  estado_codigo: val === "" ? undefined : val,
                  offset: 0,
                }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos</option>
              {ESTADOS_PEDIDO_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  offset: Math.max(0, prev.offset - prev.limit),
                }))
              }
              disabled={filters.offset === 0}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {Math.floor(filters.offset / filters.limit) + 1}
            </span>
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  offset: prev.offset + prev.limit,
                }))
              }
              disabled={!data || data.length < filters.limit}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">
              No se pudieron cargar los pedidos
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {data && data.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay pedidos para mostrar
            </h3>
            <p className="text-gray-500">
              Probá cambiar el filtro o esperá a que entren nuevos pedidos.
            </p>
          </div>
        )}

        {data && data.length > 0 && (
          <PedidoList
            pedidos={data}
            onView={handleView}
            onAvanzar={handleAvanzar}
            onCancelar={handleCancelar}
          />
        )}
      </div>

      {modal.type === "detail" && (
        <PedidoDetailModal
          pedidoId={modal.pedidoId}
          onClose={closeModal}
          onAvanzar={avanzarFromDetail}
          onCancelar={cancelarFromDetail}
          isMutating={isMutating}
        />
      )}

      {modal.type === "confirm-avanzar" && (
        <ConfirmModal
          isOpen={true}
          title="Avanzar estado"
          message={`¿Avanzar el pedido #${modal.pedido.id} al siguiente estado?`}
          onConfirm={confirmAvanzar}
          onCancel={closeModal}
        />
      )}

      {modal.type === "confirm-cancelar" && (
        <ConfirmModal
          isOpen={true}
          title="Cancelar pedido"
          message={`¿Cancelar el pedido #${modal.pedido.id}? Esta acción no se puede deshacer.`}
          onConfirm={confirmCancelar}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default PedidosPage;
