import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import PedidoTable from "./PedidoTable";
import EstadoPedidoBadge from "./EstadoPedidoBadge";
import type { PedidoResumen } from "../types";

type PedidoListProps = {
  pedidos: PedidoResumen[];
  onView: (pedido: PedidoResumen) => void;
  onAvanzar: (pedido: PedidoResumen) => void;
  onCancelar: (pedido: PedidoResumen) => void;
};

const fmtMoney = (v: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Number(v));

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const PedidoList = ({
  pedidos,
  onView,
  onAvanzar,
  onCancelar,
}: PedidoListProps) => {
  const columns = useMemo<ColumnDef<PedidoResumen>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => (
          <span className="font-semibold text-gray-900">#{row.original.id}</span>
        ),
      },
      {
        header: "Cliente",
        accessorKey: "usuario_id",
        cell: ({ row }) => (
          <span className="text-gray-700">Usuario #{row.original.usuario_id}</span>
        ),
      },
      {
        header: "Modalidad",
        accessorKey: "modalidad_entrega",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
            {row.original.modalidad_entrega === "DELIVERY"
              ? "🛵 Delivery"
              : "🏪 Retiro local"}
          </span>
        ),
      },
      {
        header: "Estado",
        accessorFn: (row) => row.estado_pedido.codigo,
        cell: ({ row }) => <EstadoPedidoBadge estado={row.original.estado_pedido} />,
      },
      {
        header: "Total",
        accessorKey: "total",
        cell: ({ row }) => (
          <span className="font-semibold text-gray-900">
            {fmtMoney(row.original.total)}
          </span>
        ),
      },
      {
        header: "Fecha",
        accessorKey: "created_at",
        cell: ({ row }) => (
          <span className="text-gray-500 text-xs">
            {fmtDate(row.original.created_at)}
          </span>
        ),
      },
      {
        header: "Acciones",
        cell: ({ row }) => {
          const p = row.original;
          const puedeAvanzar = !p.estado_pedido.es_terminal;
          const puedeCancelar = p.estado_pedido.permite_cancelar;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => onView(p)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                Ver
              </button>
              {puedeAvanzar && (
                <button
                  onClick={() => onAvanzar(p)}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                >
                  Avanzar
                </button>
              )}
              {puedeCancelar && (
                <button
                  onClick={() => onCancelar(p)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [onView, onAvanzar, onCancelar],
  );

  return (
    <div className="max-w-7xl mx-auto mt-4 px-4">
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
        <PedidoTable data={pedidos} columns={columns} />
      </div>
    </div>
  );
};

export default PedidoList;
