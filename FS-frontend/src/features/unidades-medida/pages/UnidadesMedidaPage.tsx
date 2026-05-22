import { useState } from "react";
import { useCrudOperations } from "../../../hooks/useCrudOperations";
import UnidadMedidaList from "../components/UnidadMedidaList";
import UnidadMedidaModal from "../components/UnidadMedidaModal";
import UnidadMedidaDetailModal from "../components/UnidadMedidaDetailModal";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import type { UnidadMedida } from "../types";
import { useAuth } from "../../auth/hooks/useAuth";
import { getUnidadesMedida, createUnidadMedida, updateUnidadMedida, deleteUnidadMedida } from "../services/unidadMedidaService";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; unidad: UnidadMedida }
  | { type: "detail"; unidad: UnidadMedida }
  | { type: "confirm-delete"; unidadId: number };

const UnidadesMedidaPage = () => {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const { user } = useAuth();
  const isAdmin = user?.roles.includes("admin") ?? false;

  const crud = useCrudOperations<UnidadMedida>(
    ["unidades-medida"],
    (p) => getUnidadesMedida(p),
    (d) => createUnidadMedida(d as Omit<UnidadMedida, "id">),
    (id, d) => updateUnidadMedida(id, d as Partial<UnidadMedida>),
    (id) => deleteUnidadMedida(id),
  );

  const handleCloseModal = () => setModal({ type: "none" });
  const handleEdit = (unidad: UnidadMedida) => setModal({ type: "edit", unidad });
  const handleView = (unidad: UnidadMedida) => setModal({ type: "detail", unidad });
  const handleDelete = (unidadId: number) => setModal({ type: "confirm-delete", unidadId });

  const handleConfirmDelete = () => {
    if (modal.type === "confirm-delete") {
      crud.deleteMutation.mutate(modal.unidadId);
      setModal({ type: "none" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Unidades de Medida</h1>
            <p className="mt-1 text-sm text-gray-500">
              {crud.data ? `${crud.data.length} unidades encontradas` : "Cargando..."}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setModal({ type: "create" })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Unidad
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => crud.setPagination((prev) => ({ ...prev, skip: Math.max(0, prev.skip - prev.limit) }))}
              disabled={crud.pagination.skip === 0}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {Math.floor(crud.pagination.skip / crud.pagination.limit) + 1}
            </span>
            <button
              onClick={() => crud.setPagination((prev) => ({ ...prev, skip: prev.skip + prev.limit }))}
              disabled={!crud.data || crud.data.length < crud.pagination.limit}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>

        {crud.isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        )}

        {crud.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-600 font-medium">Ocurrió un error al cargar las unidades de medida</p>
            <button onClick={() => crud.refetch()} className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Reintentar
            </button>
          </div>
        )}

        {crud.data && crud.data.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay unidades de medida</h3>
            <p className="text-gray-500 mb-6">Comenzá agregando tu primera unidad de medida</p>
          </div>
        )}

        {crud.data && crud.data.length > 0 && (
          <UnidadMedidaList
            unidades={crud.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {modal.type === "create" && (
        <UnidadMedidaModal
          unidad={null}
          onClose={handleCloseModal}
          onSubmit={(data) => crud.createMutation.mutate(data as any, { onSuccess: () => setModal({ type: "none" }) })}
        />
      )}

      {modal.type === "edit" && (
        <UnidadMedidaModal
          unidad={modal.unidad}
          onClose={handleCloseModal}
          onSubmit={(data) => crud.updateMutation.mutate({ id: modal.unidad.id, data: data as any }, { onSuccess: () => setModal({ type: "none" }) })}
        />
      )}

      {modal.type === "detail" && (
        <UnidadMedidaDetailModal
          unidad={modal.unidad}
          onClose={handleCloseModal}
        />
      )}

      {modal.type === "confirm-delete" && (
        <ConfirmModal
          isOpen={true}
          title="Eliminar unidad de medida"
          message="¿Estás seguro de eliminar esta unidad de medida? Esta acción no se puede deshacer."
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default UnidadesMedidaPage;
