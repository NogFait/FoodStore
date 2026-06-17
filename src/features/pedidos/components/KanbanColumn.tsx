import { useDroppable } from "@dnd-kit/core";
import type { PedidoResumen, EstadoPedidoCode } from "../types";
import type { Rol } from "../utils";
import KanbanCard from "./KanbanCard";

// Colores de columna — mirrors EstadoPedidoBadge COLORS
const HEADER_COLORS: Record<string, string> = {
  PENDIENTE:           "bg-yellow-100 text-yellow-800 border-yellow-300",
  CONFIRMADO:          "bg-blue-100 text-blue-800 border-blue-300",
  EN_PREPARACION:      "bg-orange-100 text-orange-800 border-orange-300",
  LISTO_PARA_RETIRAR:  "bg-purple-100 text-purple-800 border-purple-300",
  ENVIADO:             "bg-indigo-100 text-indigo-800 border-indigo-300",
  ENTREGADO:           "bg-green-100 text-green-800 border-green-300",
  CANCELADO:           "bg-red-100 text-red-800 border-red-300",
};

const ESTADO_NOMBRES: Record<string, string> = {
  PENDIENTE:           "Pendiente",
  CONFIRMADO:          "Confirmado",
  EN_PREPARACION:      "En preparación",
  LISTO_PARA_RETIRAR:  "Listo para retirar",
  ENVIADO:             "Enviado",
  ENTREGADO:           "Entregado",
  CANCELADO:           "Cancelado",
};

type Props = {
  estado: EstadoPedidoCode;
  pedidos: PedidoResumen[];
  rolesUsuario: Rol[];
  canCancelar: boolean;
  onView: (p: PedidoResumen) => void;
  onCancelar: (p: PedidoResumen) => void;
  onAvanzar: (p: PedidoResumen, hasta: EstadoPedidoCode) => void;
  isAdvancing: boolean;
};

const KanbanColumn = ({
  estado,
  pedidos,
  rolesUsuario,
  canCancelar,
  onView,
  onCancelar,
  onAvanzar,
  isAdvancing,
}: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: estado });
  const headerColor = HEADER_COLORS[estado] ?? "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div className="flex flex-col min-w-[220px] w-[220px]">
      {/* Column header */}
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-t-lg border ${headerColor} font-semibold text-xs uppercase tracking-wide`}
      >
        <span>{ESTADO_NOMBRES[estado] ?? estado}</span>
        <span className="ml-2 bg-white/60 rounded-full px-1.5 py-0.5 text-xs font-bold">
          {pedidos.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={[
          "flex-1 flex flex-col gap-2 p-2 rounded-b-lg border-x border-b border-gray-200 min-h-[200px]",
          "transition-colors duration-150",
          isOver ? "bg-indigo-50 border-indigo-300" : "bg-gray-50",
        ].join(" ")}
      >
        {pedidos.map((p) => (
          <KanbanCard
            key={p.id}
            pedido={p}
            rolesUsuario={rolesUsuario}
            canCancelar={canCancelar}
            onView={onView}
            onCancelar={onCancelar}
            onAvanzar={onAvanzar}
            isAdvancing={isAdvancing}
          />
        ))}

        {pedidos.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-4">Sin pedidos</p>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
