import { useState, useEffect, useCallback, type ReactNode, useMemo } from "react";
import type { usuarioPublico, usuariosLogin, usuariosRegister } from "../types";
import * as authService from "../services/authService";
import  {AuthContext}  from "./AuthContext";
import type { AuthContextType} from "../types";


export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<usuarioPublico | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    authService.getCurrentUser()
      .then((u)=> {if(!cancelled) setUser(u);})
      .catch(() => { if(!cancelled) setUser(null); })
      .finally(() => { if(!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (data: usuariosLogin) => {
    await authService.login(data);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const  register = useCallback(async (data: usuariosRegister) => {
    await authService.register(data);
    await login({ email: data.email, password: data.password });
  }, [login]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout]
  );
  // Memorizo con useMemo el valor del contexto para evitar re-renderizados innecesarios en los componentes consumidores cuando el estado de autenticación no cambia.

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
