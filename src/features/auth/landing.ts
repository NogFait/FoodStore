import type { Role } from "./types";

/**
 * Ruta de inicio del panel según los roles del usuario.
 * - ADMIN: catálogo (categorías), su vista de gestión por defecto.
 * - COCINA / CAJA: el tablero de pedidos, su pantalla operativa.
 * - Resto: catálogo por defecto.
 */
export function rutaInicialParaRoles(roles: Role[] | null | undefined): string {
  const r = roles ?? [];
  if (r.includes("ADMIN")) return "/categorias";
  if (r.includes("COCINA") || r.includes("CAJA")) return "/pedidos";
  return "/categorias";
}
