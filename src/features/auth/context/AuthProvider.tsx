import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../../store/authStore";

/**
 * AuthProvider: thin bootstrapper that hydrates the authStore on mount.
 * The store is the source of truth — this component only triggers the
 * initial getCurrentUser() call so the rest of the app can be synchronous.
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
