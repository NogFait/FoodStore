import { useAuth } from "../features/auth/hooks/useAuth";

/**
 * Centralized role-check hook.
 * Replaces the repeated `user?.roles?.includes("ADMIN") ?? false` inline pattern.
 */
export function useRole() {
  const { user } = useAuth();
  const roles = user?.roles ?? [];

  const isAdmin = roles.includes("ADMIN");
  const isCocina = roles.includes("COCINA");
  const isCaja = roles.includes("CAJA");
  const isClient = roles.includes("CLIENT");

  const canStock = isAdmin || isCaja || isCocina;

  /**
   * `can` helper — role-gate for UI actions.
   * Currently maps to simple role membership; can be extended with
   * action-level granularity when the FSM permissions are wired up.
   */
  function can(action: "gestion-catalogo" | "ver-pedidos" | "cancelar-pedido" | "gestionar-usuarios"): boolean {
    switch (action) {
      case "gestion-catalogo":
        return isAdmin;
      case "ver-pedidos":
        return isAdmin || isCocina || isCaja;
      case "cancelar-pedido":
        return isAdmin;
      case "gestionar-usuarios":
        return isAdmin;
      default:
        return false;
    }
  }

  return { isAdmin, isCocina, isCaja, isClient, canStock, can };
}
