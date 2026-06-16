import { useAuthStore } from "../../../store/authStore";

/**
 * useAuth — stable public API consumed by all feature components.
 * Reads from the Zustand authStore; AuthProvider bootstraps it on mount.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);

  return { user, isLoading, login, register, logout };
}

export function useIsAuthenticated() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { isAuthenticated: !!user, isLoading };
}
