/**
 * Lógica de transiciones del Kanban de pedidos.
 * Mirror del mapa backend (app/modules/pedido/utils.py).
 * Fuente única de verdad para permisos de UI y columnas visibles por rol.
 */

import type { EstadoPedidoCode, EstadoPedidoOut } from "./types";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type Rol = "ADMIN" | "COCINA" | "CAJA";

export interface Transicion {
  /** Estado origen */
  desde: EstadoPedidoCode;
  /** Estado destino */
  hasta: EstadoPedidoCode;
  /** Roles que pueden ejecutar esta transición */
  roles: Rol[];
}

// ---------------------------------------------------------------------------
// Metadata de estados (espeja ESTADOS_PEDIDO_SEED del backend)
// ---------------------------------------------------------------------------

interface EstadoMeta {
  nombre: string;
  orden: number;
  es_terminal: boolean;
  permite_cancelar: boolean;
}

const ESTADO_METADATA: Record<EstadoPedidoCode, EstadoMeta> = {
  PENDIENTE:          { nombre: "Pendiente",          orden: 1,  es_terminal: false, permite_cancelar: true  },
  CONFIRMADO:         { nombre: "Confirmado",          orden: 2,  es_terminal: false, permite_cancelar: true  },
  EN_PREPARACION:     { nombre: "En preparación",      orden: 3,  es_terminal: false, permite_cancelar: false },
  LISTO_PARA_RETIRAR: { nombre: "Listo para retirar",  orden: 4,  es_terminal: false, permite_cancelar: false },
  ENVIADO:            { nombre: "Enviado",              orden: 5,  es_terminal: false, permite_cancelar: false },
  ENTREGADO:          { nombre: "Entregado",            orden: 6,  es_terminal: true,  permite_cancelar: false },
  CANCELADO:          { nombre: "Cancelado",            orden: 99, es_terminal: true,  permite_cancelar: false },
};

/**
 * Construye un EstadoPedidoOut completo a partir de un código de estado,
 * usando la metadata estática que espeja el seed del backend.
 */
export function construirEstadoPedido(codigo: EstadoPedidoCode): EstadoPedidoOut {
  const meta = ESTADO_METADATA[codigo];
  return {
    codigo,
    nombre: meta.nombre,
    orden: meta.orden,
    es_terminal: meta.es_terminal,
    permite_cancelar: meta.permite_cancelar,
  };
}

// ---------------------------------------------------------------------------
// Mapa de transiciones (mirror del backend)
// ---------------------------------------------------------------------------

export const TRANSICIONES: Transicion[] = [
  { desde: "PENDIENTE",          hasta: "CONFIRMADO",         roles: ["CAJA", "ADMIN"] },
  { desde: "CONFIRMADO",         hasta: "EN_PREPARACION",     roles: ["CAJA", "COCINA", "ADMIN"] },
  { desde: "EN_PREPARACION",     hasta: "LISTO_PARA_RETIRAR", roles: ["COCINA", "ADMIN"] },
  { desde: "EN_PREPARACION",     hasta: "ENVIADO",            roles: ["COCINA", "ADMIN"] },
  { desde: "LISTO_PARA_RETIRAR", hasta: "ENTREGADO",          roles: ["ADMIN"] },
  { desde: "ENVIADO",            hasta: "ENTREGADO",          roles: ["ADMIN"] },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Devuelve las transiciones posibles desde un estado para un conjunto de roles.
 */
export function transicionesPermitidas(
  desde: EstadoPedidoCode,
  rolesUsuario: Rol[],
): Transicion[] {
  return TRANSICIONES.filter(
    (t) =>
      t.desde === desde &&
      t.roles.some((r) => rolesUsuario.includes(r)),
  );
}

/**
 * Indica si un rol puede mover un pedido desde `desde` hacia `hasta`.
 */
export function puedeAvanzar(
  desde: EstadoPedidoCode,
  hasta: EstadoPedidoCode,
  rolesUsuario: Rol[],
): boolean {
  return TRANSICIONES.some(
    (t) =>
      t.desde === desde &&
      t.hasta === hasta &&
      t.roles.some((r) => rolesUsuario.includes(r)),
  );
}

/**
 * Dado el estado actual de un pedido y los roles del usuario,
 * devuelve el estado destino inmediato (primer match) que puede ejecutar,
 * o null si no puede avanzar ninguno.
 */
export function siguienteEstadoPermitido(
  desde: EstadoPedidoCode,
  rolesUsuario: Rol[],
): EstadoPedidoCode | null {
  const transiciones = transicionesPermitidas(desde, rolesUsuario);
  return transiciones.length > 0 ? transiciones[0].hasta : null;
}

/**
 * Columnas que un conjunto de roles puede VER en el Kanban.
 * ADMIN ve todas. COCINA/CAJA ven las columnas donde tienen al menos una
 * transición saliente O entrante.
 */
export function columnasVisibles(rolesUsuario: Rol[]): EstadoPedidoCode[] {
  const ALL: EstadoPedidoCode[] = [
    "PENDIENTE",
    "CONFIRMADO",
    "EN_PREPARACION",
    "LISTO_PARA_RETIRAR",
    "ENVIADO",
    "ENTREGADO",
    "CANCELADO",
  ];

  if (rolesUsuario.includes("ADMIN")) return ALL;

  const involucrados = new Set<EstadoPedidoCode>();
  for (const t of TRANSICIONES) {
    if (t.roles.some((r) => rolesUsuario.includes(r))) {
      involucrados.add(t.desde);
      involucrados.add(t.hasta);
    }
  }
  // Siempre mostrar CANCELADO y ENTREGADO como terminales de referencia
  involucrados.add("CANCELADO");
  involucrados.add("ENTREGADO");

  return ALL.filter((e) => involucrados.has(e));
}

/**
 * El destino esperado al hacer drop sobre una columna.
 * Retorna null si el drop no corresponde a una transición válida para ese rol.
 */
export function destinoValido(
  desde: EstadoPedidoCode,
  columnaDestino: EstadoPedidoCode,
  rolesUsuario: Rol[],
): EstadoPedidoCode | null {
  if (puedeAvanzar(desde, columnaDestino, rolesUsuario)) return columnaDestino;
  return null;
}
