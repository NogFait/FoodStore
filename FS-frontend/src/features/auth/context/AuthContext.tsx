import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { usuarioPublico, usuariosLogin, usuariosRegister } from "../../../types/usuario";
import * as authService from "../services/authService";

type AuthContextType = {
  user: usuarioPublico | null;
  isLoading: boolean;
  login: (data: usuariosLogin) => Promise<void>;
  register: (data: usuariosRegister) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<usuarioPublico | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser()
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (data: usuariosLogin) => {
    await authService.login(data);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const register = useCallback(async (data: usuariosRegister) => {
    await authService.register(data);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
