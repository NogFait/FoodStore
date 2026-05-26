// Decimal viaja como string desde el backend (precisión exacta)
export type DecimalStr = string;

export type ModalidadEntrega = "DELIVERY" | "RETIRO_LOCAL";

export interface EstadoPedidoOut {
  codigo: string;
  nombre: string;
  orden: number;
  es_terminal: boolean;
  permite_cancelar: boolean;
}

export interface DetallePedidoOut {
  producto_id: number;
  cantidad: number;
  nombre_snap: string;
  precio_unit_snap: DecimalStr;
  subtotal_snap: DecimalStr;
  personalizacion: number[];
}

export interface HistorialEstadoOut {
  estado_anterior: string | null;
  estado_nuevo: string;
  usuario_id: number;
  fecha_cambio: string; // ISO 8601
}

export interface PedidoResumen {
  id: number;
  usuario_id: number;
  modalidad_entrega: ModalidadEntrega;
  estado_pedido: EstadoPedidoOut;
  subtotal: DecimalStr;
  costo_envio: DecimalStr;
  total: DecimalStr;
  created_at: string;
}

export interface PedidoResponse {
  id: number;
  usuario_id: number;
  modalidad_entrega: ModalidadEntrega;
  direccion_id: number | null;
  forma_pago_id: number;
  estado_pedido: EstadoPedidoOut;
  subtotal: DecimalStr;
  costo_envio: DecimalStr;
  total: DecimalStr;
  notas: string | null;
  forma_pago_snap: string | null;
  direccion_snap: string | null;
  detalles: DetallePedidoOut[];
  historial_estado_pedido: HistorialEstadoOut[];
  created_at: string;
}

// Hardcodeados — no hay endpoint para listarlos todavía
export const ESTADOS_PEDIDO_CODES = [
  "PENDIENTE",
  "CONFIRMADO",
  "EN_PREPARACION",
  "LISTO_PARA_RETIRAR",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
] as const;

export type EstadoPedidoCode = (typeof ESTADOS_PEDIDO_CODES)[number];
