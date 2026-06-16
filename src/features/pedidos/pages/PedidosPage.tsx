import { useState } from "react";
import { toast } from "sonner";
import PedidoDetailModal from "../components/PedidoDetailModal";
import CancelarPedidoModal from "../components/CancelarPedidoModal";
import KanbanBoard from "../components/KanbanBoard";
import { usePedidos } from "../hooks/usePedidos";
import { usePedidosWS } from "../../../hooks/usePedidosWS";
import { useWsStore } from "../../../store/wsStore";
import { useRole } from "../../../hooks/useRole";
import type { PedidoResumen } from "../types";
import type { Rol } from "../utils";
import { avanzarEstado } from "../services/pedidoService";

type ModalState =
  | { type: "none" }
  | { type: "detail"; pedidoId: number }
  | { type: "confirm-cancelar"; pedido: PedidoResumen };

const PedidosPage = () => {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const { data, isLoading, error, refetch, cancelarMutation } = usePedidos();
  const { reconnect } = usePedidosWS();
  const wsStatus = useWsStore((s) => s.status);
  const { isAdmin, isCocina, isCaja } = useRole();

  const closeModal = () => setModal({ type: "none" });

  const handleView = (p: PedidoResumen) =>
    setModal({ type: "detail", pedidoId: p.id });

  const handleCancelar = (p: PedidoResumen) =>
    setModal({ type: "confirm-cancelar", pedido: p });

  const cancelarFromDetail = (id: number) =>
    setModal({
      type: "confirm-cancelar",
      pedido: { id } as PedidoResumen,
    });

  // avanzarFromDetail delegates directly to the backend — KanbanBoard handles
  // the Kanban transitions; detail modal just needs a simple advance
  const avanzarFromDetail = (id: number) => {
    const pedido = data?.find((p) => p.id === id);
    if (!pedido) return;

    void avanzarEstado(id)
      .then((updated) => {
        toast.success(`Pedido #${id} → ${updated.estado_pedido.nombre}`);
        closeModal();
        void refetch();
      })
      .catch((err: unknown) => {
        let message = "No se pudo avanzar el pedido.";
        if (err !== null && typeof err === "object" && "response" in err) {
          const response = (err as { response?: { data?: { detail?: string }; status?: number } }).response;
          const detail = response?.data?.detail;
          const status = response?.status;
          if (status === 409) {
            message = `Ingrediente faltante: ${detail ?? "ingrediente sin stock"}`;
          } else if (status === 403) {
            message = "Sin permisos para esta transición.";
          } else if (status === 400) {
            message = detail ?? "Transición no válida.";
          } else if (typeof detail === "string") {
            message = detail;
          }
        }
        toast.error(message);
      });
  };

  const rolesUsuario: Rol[] = [
    ...(isAdmin ? (["ADMIN"] as Rol[]) : []),
    ...(isCocina ? (["COCINA"] as Rol[]) : []),
    ...(isCaja ? (["CAJA"] as Rol[]) : []),
  ];

  const confirmCancelar = (motivo: string) => {
    if (modal.type === "confirm-cancelar") {
      cancelarMutation.mutate(
        { id: modal.pedido.id, motivo },
        { onSuccess: closeModal },
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
            <p className="mt-1 text-sm text-gray-500">
              {data ? `${data.length} pedidos en pantalla` : "Cargando..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* WS indicator */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                wsStatus === "connected"
                  ? "bg-green-100 text-green-700"
                  : wsStatus === "connecting"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  wsStatus === "connected"
                    ? "bg-green-500"
                    : wsStatus === "connecting"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                }`}
              />
              {wsStatus === "connected"
                ? "En vivo"
                : wsStatus === "connecting"
                  ? "Conectando…"
                  : "Desconectado"}
            </span>
            {wsStatus !== "connected" && (
              <button
                onClick={() => reconnect()}
                className="text-xs text-indigo-600 hover:underline"
              >
                Reconectar
              </button>
            )}
            <button
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refrescar
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">No se pudieron cargar los pedidos</p>
            <button
              onClick={() => void refetch()}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Kanban board */}
        {data && !isLoading && (
          <KanbanBoard
            pedidos={data}
            rolesUsuario={rolesUsuario}
            canCancelar={isAdmin}
            onView={handleView}
            onCancelar={handleCancelar}
          />
        )}
      </div>

      {/* Modals */}
      {modal.type === "detail" && (
        <PedidoDetailModal
          pedidoId={modal.pedidoId}
          onClose={closeModal}
          onAvanzar={avanzarFromDetail}
          onCancelar={cancelarFromDetail}
          isMutating={cancelarMutation.isPending}
        />
      )}

      {modal.type === "confirm-cancelar" && (
        <CancelarPedidoModal
          isOpen={true}
          pedidoId={modal.pedido.id}
          isPending={cancelarMutation.isPending}
          onConfirm={confirmCancelar}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default PedidosPage;
