import { useState, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PedidoResumen, EstadoPedidoCode } from "../types";
import type { Rol } from "../utils";
import { destinoValido, columnasVisibles, construirEstadoPedido } from "../utils";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import { avanzarEstado } from "../services/pedidoService";

type Props = {
  pedidos: PedidoResumen[];
  rolesUsuario: Rol[];
  canCancelar: boolean;
  onView: (p: PedidoResumen) => void;
  onCancelar: (p: PedidoResumen) => void;
};

const KanbanBoard = ({
  pedidos,
  rolesUsuario,
  canCancelar,
  onView,
  onCancelar,
}: Props) => {
  const queryClient = useQueryClient();
  const [advancingId, setAdvancingId] = useState<number | null>(null);
  const [activePedido, setActivePedido] = useState<PedidoResumen | null>(null);

  const columnas = columnasVisibles(rolesUsuario);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  /** Optimistically move a pedido to a new estado in all cached lists */
  const applyOptimistic = useCallback(
    (pedidoId: number, nuevoEstado: EstadoPedidoCode) => {
      queryClient.setQueriesData<PedidoResumen[]>(
        { queryKey: ["pedidos"] },
        (prev) => {
          if (!prev) return prev;
          return prev.map((p) =>
            p.id === pedidoId
              ? { ...p, estado_pedido: construirEstadoPedido(nuevoEstado) }
              : p,
          );
        },
      );
    },
    [queryClient],
  );

  /** Revert optimistic move */
  const revertOptimistic = useCallback(
    (pedidoId: number, estadoAnterior: EstadoPedidoCode) => {
      applyOptimistic(pedidoId, estadoAnterior);
    },
    [applyOptimistic],
  );

  const handleAvanzar = useCallback(
    async (pedido: PedidoResumen, hasta: EstadoPedidoCode) => {
      if (advancingId !== null) return;
      const estadoAnterior = pedido.estado_pedido.codigo as EstadoPedidoCode;

      setAdvancingId(pedido.id);
      applyOptimistic(pedido.id, hasta);

      try {
        const updated = await avanzarEstado(pedido.id, { nuevo_estado: hasta });
        toast.success(
          `Pedido #${pedido.id} → ${updated.estado_pedido.nombre}`,
        );
        // Sync with server truth
        applyOptimistic(pedido.id, updated.estado_pedido.codigo as EstadoPedidoCode);
        queryClient.invalidateQueries({ queryKey: ["pedido", pedido.id] });
      } catch (err: unknown) {
        revertOptimistic(pedido.id, estadoAnterior);

        let message = "No se pudo avanzar el pedido.";
        if (
          err !== null &&
          typeof err === "object" &&
          "response" in err
        ) {
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
      } finally {
        setAdvancingId(null);
      }
    },
    [advancingId, applyOptimistic, revertOptimistic, queryClient],
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { data } = event.active;
    const pedido = (data.current as { pedido?: PedidoResumen } | undefined)?.pedido;
    if (pedido) setActivePedido(pedido);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePedido(null);
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id as number;
    const targetColumn = over.id as EstadoPedidoCode;

    const pedido = pedidos.find((p) => p.id === draggedId);
    if (!pedido) return;

    const desde = pedido.estado_pedido.codigo as EstadoPedidoCode;
    if (desde === targetColumn) return; // same column — no-op

    const destino = destinoValido(desde, targetColumn, rolesUsuario);
    if (!destino) {
      toast.warning("Movimiento no permitido para tu rol o no es la siguiente transición válida.");
      return;
    }

    void handleAvanzar(pedido, destino);
  };

  // Group pedidos by estado
  const porEstado = (estado: EstadoPedidoCode) =>
    pedidos.filter((p) => p.estado_pedido.codigo === estado);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4">
        {columnas.map((estado) => (
          <KanbanColumn
            key={estado}
            estado={estado}
            pedidos={porEstado(estado)}
            rolesUsuario={rolesUsuario}
            canCancelar={canCancelar}
            onView={onView}
            onCancelar={onCancelar}
            onAvanzar={handleAvanzar}
            isAdvancing={advancingId !== null}
          />
        ))}
      </div>

      {/* Drag overlay — ghost card */}
      <DragOverlay>
        {activePedido ? (
          <div className="rotate-2 scale-105 opacity-90 shadow-2xl">
            <KanbanCard
              pedido={activePedido}
              rolesUsuario={rolesUsuario}
              canCancelar={false}
              onView={() => undefined}
              onCancelar={() => undefined}
              onAvanzar={() => undefined}
              isAdvancing={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
