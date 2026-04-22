import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CategoriaList from "../components/CategoriaList/CategoriaList";
import CategoriaModal from "../components/CategoriaModal/CategoriaModal";
import CategoriaDetailModal from "../components/CategoriaDetailModal/CategoriaDetailModal";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import type { Categoria } from "../types/categoria";
import { fetchApi } from "../lib/api";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; categoria: Categoria }
  | { type: "detail"; categoria: Categoria }
  | { type: "confirm-delete"; categoriaId: number };

const CategoriasPage = () => {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 20,
  });

  const getCategorias = async () => {
    return fetchApi<Categoria[]>("/categorias/", {
      skip: pagination.skip,
      limit: pagination.limit,
    });
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["categorias", pagination],
    queryFn: getCategorias,
    staleTime: 10000 * 60,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Categoria, "id">) => {
      return fetchApi<Categoria>("/categorias/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setModal({ type: "none" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return fetchApi<void>(`/categorias/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Omit<Categoria, "id"> }) => {
      return fetchApi<Categoria>(`/categorias/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setModal({ type: "none" });
    },
  });

  // Handlers
  const handleCloseModal = () => {
    setModal({ type: "none" });
  };

  const handleCreate = (data: { nombre: string; descripcion: string }) => {
    createMutation.mutate(data);
  };

  const handleEdit = (categoria: Categoria) => {
    setModal({ type: "edit", categoria });
  };

  const handleUpdate = (id: number, data: Omit<Categoria, "id">) => {
    updateMutation.mutate({ id, data });
  };

  const handleView = (categoria: Categoria) => {
    setModal({ type: "detail", categoria });
  };

  const handleDelete = (id: number) => {
    setModal({ type: "confirm-delete", categoriaId: id });
  };

  const handleConfirmDelete = () => {
    if (modal.type === "confirm-delete") {
      deleteMutation.mutate(modal.categoriaId);
      setModal({ type: "none" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
            <p className="mt-1 text-sm text-gray-500">
              {data ? `${data.length} categorías encontradas` : "Cargando..."}
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Categoría
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, skip: Math.max(0, prev.skip - prev.limit) }))}
              disabled={pagination.skip === 0}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {Math.floor(pagination.skip / pagination.limit) + 1}
            </span>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, skip: prev.skip + prev.limit }))}
              disabled={!data || data.length < pagination.limit}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">Ocurrió un error al cargar las categorías</p>
            <button onClick={() => refetch()} className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Reintentar
            </button>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías</h3>
            <p className="text-gray-500 mb-6">Comenza agregando tu primera categoría</p>
            <button
              onClick={() => setModal({ type: "create" })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200"
            >
              Agregar Categoría
            </button>
          </div>
        )}

        {data && data.length > 0 && (
          <CategoriaList
            categorias={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </div>

      {/* Modal: CREATE */}
      {modal.type === "create" && (
        <CategoriaModal
          categoria={null}
          onClose={handleCloseModal}
          onSubmit={handleCreate}
        />
      )}

      {/* Modal: EDIT */}
      {modal.type === "edit" && (
        <CategoriaModal
          categoria={modal.categoria}
          onClose={handleCloseModal}
          onSubmit={(data) => handleUpdate(modal.categoria.id, data)}
        />
      )}

      {/* Modal: DETAIL */}
      {modal.type === "detail" && (
        <CategoriaDetailModal
          categoria={modal.categoria}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal: CONFIRM DELETE */}
      {modal.type === "confirm-delete" && (
        <ConfirmModal
          isOpen={true}
          title="Eliminar categoría"
          message="¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer."
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CategoriasPage;
