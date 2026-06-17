import { useDraggable } from "@dnd-kit/core";
import type { PedidoResumen } from "../types";
import type { EstadoPedidoCode } from "../types";
import type { Rol } from "../utils";
import { transicionesPermitidas } from "../utils";

const fmtMoney = (v: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Number(v));

type Props = {
  pedido: PedidoResumen;
  rolesUsuario: Rol[];
  canCancelar: boolean;
  onView: (p: PedidoResumen) => void;
  onCancelar: (p: PedidoResumen) => void;
  onAvanzar: (p: PedidoResumen, hasta: EstadoPedidoCode) => void;
  isAdvancing: boolean;
};

const KanbanCard = ({
  pedido,
  rolesUsuario,
  canCancelar,
  onView,
  onCancelar,
  onAvanzar,
  isAdvancing,
}: Props) => {
  const estadoCodigo = pedido.estado_pedido.codigo as EstadoPedidoCode;
  const transiciones = transicionesPermitidas(estadoCodigo, rolesUsuario);
  const esDraggable = !pedido.estado_pedido.es_terminal && transiciones.length > 0;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: pedido.id,
    disabled: !esDraggable,
    data: { pedido },
  });

  return (
    <div
      ref={setNodeRef}
      {...(esDraggable ? { ...listeners, ...attributes } : {})}
      className={[
        "bg-white rounded-lg border shadow-sm p-3 select-none",
        "transition-shadow duration-150",
        esDraggable ? "cursor-grab active:cursor-grabbing hover:shadow-md" : "cursor-default",
        isDragging ? "opacity-40 shadow-xl scale-95" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-indigo-600">#{pedido.id}</span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            pedido.modalidad_entrega === "DELIVERY"
              ? "bg-blue-100 text-blue-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {pedido.modalidad_entrega === "DELIVERY" ? "Delivery" : "Retiro"}
        </span>
      </div>

      {/* Info */}
      <p className="text-sm text-gray-700 mb-0.5">
        Cliente #{pedido.usuario_id}
      </p>
      <p className="text-xs text-gray-500 mb-2">
        {fmtMoney(pedido.total)}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onView(pedido)}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Ver
        </button>

        {transiciones.map((t) => (
          <button
            key={t.hasta}
            onClick={() => onAvanzar(pedido, t.hasta)}
            disabled={isAdvancing}
            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            → {t.hasta.replace(/_/g, " ")}
          </button>
        ))}

        {canCancelar && pedido.estado_pedido.permite_cancelar && (
          <button
            onClick={() => onCancelar(pedido)}
            disabled={isAdvancing}
            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
