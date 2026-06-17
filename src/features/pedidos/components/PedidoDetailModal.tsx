import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import EstadoPedidoBadge from "./EstadoPedidoBadge";
import { usePedidoDetalle } from "../hooks/usePedidos";
import { getIngredientesProducto } from "../../productos/services/productoService";
import type { ProductoIngrediente } from "../../productos/services/productoService";
import { ajustarStock } from "../../ingredientes/services/ingredienteService";
import { useRole } from "../../../hooks/useRole";

type Props = {
  pedidoId: number;
  onClose: () => void;
  onAvanzar: (id: number) => void;
  onCancelar: (id: number) => void;
  isMutating: boolean;
};

type ProductoIngredientesRowProps = {
  productoId: number;
  pedidoId: number;
};

const ProductoIngredientesRow = ({ productoId, pedidoId }: ProductoIngredientesRowProps) => {
  const { canStock } = useRole();
  const queryClient = useQueryClient();

  const { data: ingredientes, isLoading } = useQuery({
    queryKey: ["producto-ingredientes", productoId],
    queryFn: () => getIngredientesProducto(productoId),
  });

  const marcarFaltante = useMutation({
    mutationFn: (ingredienteId: number) => ajustarStock(ingredienteId, 0),
    onSuccess: () => {
      toast.success("Ingrediente marcado como faltante");
      void queryClient.invalidateQueries({ queryKey: ["producto-ingredientes", productoId] });
      void queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      void queryClient.invalidateQueries({ queryKey: ["productos"] });
      void queryClient.invalidateQueries({ queryKey: ["pedido", pedidoId] });
      void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
    onError: () => {
      toast.error("No se pudo marcar el ingrediente como faltante");
    },
  });

  if (isLoading) {
    return (
      <div className="mt-1 px-2 py-1 text-xs text-gray-400">Cargando ingredientes…</div>
    );
  }

  if (!ingredientes || ingredientes.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 px-2 space-y-1">
      {ingredientes.map((ing: ProductoIngrediente) => (
        <div
          key={ing.ingrediente_id}
          className="flex items-center justify-between gap-2 py-1 border-b border-gray-100 last:border-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-gray-700 truncate">{ing.nombre}</span>
            {ing.es_removible && (
              <span className="text-xs text-gray-400 italic">Removible</span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {ing.stock_cantidad === 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Faltante
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {ing.stock_cantidad}
              </span>
            )}
            {canStock && ing.stock_cantidad > 0 && (
              <button
                onClick={() => marcarFaltante.mutate(ing.ingrediente_id)}
                disabled={marcarFaltante.isPending}
                className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                Marcar faltante
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
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

const PedidoDetailModal = ({
  pedidoId,
  onClose,
  onAvanzar,
  onCancelar,
  isMutating,
}: Props) => {
  const { data: pedido, isLoading, error } = usePedidoDetalle(pedidoId);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Detalle de Pedido
            </h2>
            {pedido && (
              <p className="text-sm text-gray-500">
                #{pedido.id} · {fmtDate(pedido.created_at)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {isLoading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 text-sm">
                No se pudo cargar el pedido
              </p>
            </div>
          )}

          {pedido && (
            <div className="space-y-4">
              {/* Estado + Modalidad */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Estado actual
                  </p>
                  <EstadoPedidoBadge estado={pedido.estado_pedido} size="md" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Modalidad
                  </p>
                  <p className="font-medium text-gray-900">
                    {pedido.modalidad_entrega === "DELIVERY"
                      ? "🛵 Delivery"
                      : "🏪 Retiro local"}
                  </p>
                </div>
              </div>

              {/* Cliente / Pago / Entrega */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Cliente
                  </p>
                  <p className="text-gray-900 font-medium">
                    Usuario #{pedido.usuario_id}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Forma de pago
                  </p>
                  <p className="text-gray-900 font-medium">
                    {pedido.forma_pago_snap ?? "—"}
                  </p>
                </div>
                <div className="sm:col-span-2 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    {pedido.modalidad_entrega === "DELIVERY"
                      ? "Dirección de entrega"
                      : "Punto de retiro"}
                  </p>
                  <p className="text-gray-900">
                    {pedido.direccion_snap ?? "Retiro en el local"}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                  Items ({pedido.detalles.length})
                </p>
                <div className="space-y-2">
                  {pedido.detalles.map((d) => (
                    <div
                      key={d.producto_id}
                      className="px-3 py-2 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {d.nombre_snap}
                          </p>
                          <p className="text-xs text-gray-500">
                            {d.cantidad} ×{" "}
                            {fmtMoney(d.precio_unit_snap)}
                            {d.personalizacion.length > 0 &&
                              ` · ${d.personalizacion.length} personalización(es)`}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap ml-3">
                          {fmtMoney(d.subtotal_snap)}
                        </p>
                      </div>
                      <ProductoIngredientesRow
                        productoId={d.producto_id}
                        pedidoId={pedido.id}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Notas */}
              {pedido.notas && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-700 uppercase font-medium mb-1">
                    Notas del cliente
                  </p>
                  <p className="text-amber-900 text-sm">{pedido.notas}</p>
                </div>
              )}

              {/* Totales */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {fmtMoney(pedido.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-gray-900">
                    {fmtMoney(pedido.costo_envio)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {fmtMoney(pedido.total)}
                  </span>
                </div>
              </div>

              {/* Historial */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                  Historial de estados
                </p>
                <ol className="relative border-l border-gray-300 ml-3 space-y-3">
                  {pedido.historial_estado_pedido.map((h, i) => (
                    <li key={i} className="ml-4">
                      <span className="absolute -left-1.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
                      <p className="text-sm text-gray-900">
                        {h.estado_anterior
                          ? `${h.estado_anterior} → ${h.estado_nuevo}`
                          : `Creado en ${h.estado_nuevo}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {fmtDate(h.fecha_cambio)} · por usuario #{h.usuario_id}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>

        {pedido && (
          <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-end gap-2">
            {pedido.estado_pedido.permite_cancelar && (
              <button
                onClick={() => onCancelar(pedido.id)}
                disabled={isMutating}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium disabled:opacity-50"
              >
                Cancelar pedido
              </button>
            )}
            {!pedido.estado_pedido.es_terminal && (
              <button
                onClick={() => onAvanzar(pedido.id)}
                disabled={isMutating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                Avanzar estado
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidoDetailModal;
