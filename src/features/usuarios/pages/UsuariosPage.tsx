import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as usuariosService from "../services/usuariosService";
import type { UsuarioPublico } from "../types";
import type { Role } from "../../auth/types";

const QUERY_KEY = ["admin", "usuarios"] as const;
const ROLES_KEY = ["admin", "roles"] as const;

const ALL_ROLES: Role[] = ["ADMIN", "COCINA", "CAJA", "CLIENT"];

function useUsuarios() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: usuariosService.getUsuarios,
    staleTime: 30_000,
  });
}

function useRoles() {
  return useQuery({
    queryKey: ROLES_KEY,
    queryFn: usuariosService.getRoles,
    staleTime: 5 * 60 * 1000,
  });
}

type RolModalState =
  | { type: "none" }
  | { type: "assign"; usuario: UsuarioPublico }
  | { type: "remove"; usuario: UsuarioPublico; rol: Role };

const UsuariosPage = () => {
  const queryClient = useQueryClient();
  const { data: usuarios, isLoading, error, refetch } = useUsuarios();
  useRoles(); // prefetch for the assign modal

  const [rolModal, setRolModal] = useState<RolModalState>({ type: "none" });
  const [selectedRol, setSelectedRol] = useState<Role>("CLIENT");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  const toggleEstadoMutation = useMutation({
    mutationFn: (u: UsuarioPublico) =>
      u.disabled ? usuariosService.activarUsuario(u.id) : usuariosService.desactivarUsuario(u.id),
    onSuccess: (updated) => {
      toast.success(
        updated.disabled
          ? `${updated.username} desactivado`
          : `${updated.username} activado`,
      );
      invalidate();
    },
    onError: () => toast.error("No se pudo actualizar el estado del usuario"),
  });

  const asignarRolMutation = useMutation({
    mutationFn: ({ userId, rol }: { userId: number; rol: Role }) =>
      usuariosService.asignarRol(userId, { rol_codigo: rol }),
    onSuccess: () => {
      toast.success("Rol asignado correctamente");
      invalidate();
      setRolModal({ type: "none" });
    },
    onError: () => toast.error("No se pudo asignar el rol"),
  });

  const quitarRolMutation = useMutation({
    mutationFn: ({ userId, rol }: { userId: number; rol: Role }) =>
      usuariosService.quitarRol(userId, rol),
    onSuccess: () => {
      toast.success("Rol removido correctamente");
      invalidate();
      setRolModal({ type: "none" });
    },
    onError: () => toast.error("No se pudo remover el rol"),
  });

  const isMutating =
    toggleEstadoMutation.isPending ||
    asignarRolMutation.isPending ||
    quitarRolMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de usuarios y asignación de roles
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refrescar
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">No se pudieron cargar los usuarios</p>
            <button
              onClick={() => refetch()}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {usuarios && usuarios.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No hay usuarios registrados.</p>
          </div>
        )}

        {usuarios && usuarios.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Usuario</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Roles</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">#{u.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{u.username}</p>
                      <p className="text-xs text-gray-500">{u.full_name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((rol) => (
                          <span
                            key={rol}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
                          >
                            {rol}
                            <button
                              title={`Quitar rol ${rol}`}
                              disabled={isMutating}
                              onClick={() =>
                                setRolModal({ type: "remove", usuario: u, rol })
                              }
                              className="ml-0.5 text-indigo-400 hover:text-red-600 disabled:opacity-50"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <button
                          title="Asignar rol"
                          disabled={isMutating}
                          onClick={() => setRolModal({ type: "assign", usuario: u })}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          + Rol
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.disabled
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {u.disabled ? "Inactivo" : "Activo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        disabled={isMutating}
                        onClick={() => toggleEstadoMutation.mutate(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                          u.disabled
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {u.disabled ? "Activar" : "Desactivar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign role modal */}
      {rolModal.type === "assign" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Asignar rol
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Usuario: <strong>{rolModal.usuario.username}</strong>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={selectedRol}
                onChange={(e) => setSelectedRol(e.target.value as Role)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex border-t border-gray-200">
              <button
                onClick={() => setRolModal({ type: "none" })}
                className="flex-1 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={asignarRolMutation.isPending}
                onClick={() =>
                  asignarRolMutation.mutate({
                    userId: rolModal.usuario.id,
                    rol: selectedRol,
                  })
                }
                className="flex-1 py-3 text-indigo-600 font-medium border-l border-gray-200 hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {asignarRolMutation.isPending ? "Asignando…" : "Asignar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove role confirm modal */}
      {rolModal.type === "remove" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quitar rol
              </h3>
              <p className="text-gray-600 text-sm">
                ¿Quitar el rol <strong>{rolModal.rol}</strong> de{" "}
                <strong>{rolModal.usuario.username}</strong>?
              </p>
            </div>
            <div className="flex border-t border-gray-200">
              <button
                onClick={() => setRolModal({ type: "none" })}
                className="flex-1 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={quitarRolMutation.isPending}
                onClick={() =>
                  quitarRolMutation.mutate({
                    userId: rolModal.usuario.id,
                    rol: rolModal.rol,
                  })
                }
                className="flex-1 py-3 text-red-600 font-medium border-l border-gray-200 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {quitarRolMutation.isPending ? "Quitando…" : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
