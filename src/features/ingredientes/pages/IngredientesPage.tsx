import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import IngredienteList from "../components/IngredienteList";
import IngredienteModal from "../components/IngredienteModal";
import IngredienteDetailModal from "../components/IngredienteDetailModal";
import ReponerStockModal from "../components/ReponerStockModal";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import type { Ingrediente } from "../types";
import { useIngredientes } from "../hooks/useIngredientes";
import { useIngredientesWS } from "../hooks/useIngredientesWS";
import { useRole } from "../../../hooks/useRole";
import { ajustarStock } from "../services/ingredienteService";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; ingrediente: Ingrediente }
  | { type: "detail"; ingrediente: Ingrediente }
  | { type: "confirm-delete"; ingredienteId: number }
  | { type: "reponer"; ingrediente: Ingrediente };

const IngredientesPage = () => {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const { isAdmin, isCaja } = useRole();
  const canStock = isAdmin || isCaja;

  const crud = useIngredientes();
  const queryClient = useQueryClient();

  // Subscribe to real-time stock events
  useIngredientesWS();

  const stockMutation = useMutation({
    mutationFn: ({ id, cantidad }: { id: number; cantidad: number }) =>
      ajustarStock(id, cantidad),
    onSuccess: (updated) => {
      toast.success(
        updated.stock_cantidad === 0
          ? `Ingrediente "${updated.nombre}" marcado como faltante`
          : `Stock de "${updated.nombre}" repuesto (${updated.stock_cantidad})`,
      );
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      setModal({ type: "none" });
    },
    onError: () => {
      toast.error("No se pudo actualizar el stock.");
    },
  });

  const handleCloseModal = () => setModal({ type: "none" });
  const handleEdit = (ingrediente: Ingrediente) =>
    setModal({ type: "edit", ingrediente });
  const handleView = (ingrediente: Ingrediente) =>
    setModal({ type: "detail", ingrediente });
  const handleDelete = (ingredienteId: number) =>
    setModal({ type: "confirm-delete", ingredienteId });

  const handleMarcarFaltante = (ingrediente: Ingrediente) => {
    stockMutation.mutate({ id: ingrediente.id, cantidad: 0 });
  };

  const handleReponer = (ingrediente: Ingrediente) => {
    setModal({ type: "reponer", ingrediente });
  };

  const handleConfirmReponer = (cantidad: number) => {
    if (modal.type === "reponer") {
      stockMutation.mutate({ id: modal.ingrediente.id, cantidad });
    }
  };

  const handleConfirmDelete = () => {
    if (modal.type === "confirm-delete") {
      crud.deleteMutation.mutate(modal.ingredienteId);
      setModal({ type: "none" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ingredientes</h1>
            <p className="mt-1 text-sm text-gray-500">
              {crud.data
                ? `${crud.data.length} ingredientes encontrados`
                : "Cargando..."}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setModal({ type: "create" })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Ingrediente
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Alérgenos:
            </label>
            <select
              value={
                crud.pagination.es_alergeno === undefined
                  ? ""
                  : String(crud.pagination.es_alergeno)
              }
              onChange={(e) => {
                const val = e.target.value;
                crud.setPagination((prev) => ({
                  ...prev,
                  es_alergeno: val === "" ? undefined : val === "true",
                  skip: 0,
                }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos</option>
              <option value="true">Solo alérgenos</option>
              <option value="false">Sin alérgenos</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() =>
                crud.setPagination((prev) => ({
                  ...prev,
                  skip: Math.max(0, prev.skip - prev.limit),
                }))
              }
              disabled={crud.pagination.skip === 0}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página{" "}
              {Math.floor(crud.pagination.skip / crud.pagination.limit) + 1}
            </span>
            <button
              onClick={() =>
                crud.setPagination((prev) => ({
                  ...prev,
                  skip: prev.skip + prev.limit,
                }))
              }
              disabled={!crud.data || crud.data.length < crud.pagination.limit}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>

        {crud.isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}

        {crud.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">
              Ocurrió un error al cargar los ingredientes
            </p>
            <button
              onClick={() => void crud.refetch()}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {crud.data && crud.data.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay ingredientes
            </h3>
            <p className="text-gray-500 mb-6">
              Comenzá agregando tu primer ingrediente
            </p>
          </div>
        )}

        {crud.data && crud.data.length > 0 && (
          <IngredienteList
            ingredientes={crud.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onMarcarFaltante={handleMarcarFaltante}
            onReponer={handleReponer}
            isAdmin={isAdmin}
            canStock={canStock}
          />
        )}
      </div>

      {modal.type === "create" && (
        <IngredienteModal
          isOpen={true}
          ingrediente={null}
          onClose={handleCloseModal}
          onSubmit={(data) =>
            crud.createMutation.mutate(data, {
              onSuccess: () => setModal({ type: "none" }),
            })
          }
        />
      )}

      {modal.type === "edit" && (
        <IngredienteModal
          isOpen={true}
          ingrediente={modal.ingrediente}
          onClose={handleCloseModal}
          onSubmit={(data) =>
            crud.updateMutation.mutate(
              { id: modal.ingrediente.id, data: data },
              { onSuccess: () => setModal({ type: "none" }) },
            )
          }
        />
      )}

      {modal.type === "detail" && (
        <IngredienteDetailModal
          ingrediente={modal.ingrediente}
          onClose={handleCloseModal}
        />
      )}

      {modal.type === "confirm-delete" && (
        <ConfirmModal
          isOpen={true}
          title="Eliminar ingrediente"
          message="¿Estás seguro de eliminar este ingrediente? Esta acción no se puede deshacer."
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
        />
      )}

      {modal.type === "reponer" && (
        <ReponerStockModal
          isOpen={true}
          ingredienteNombre={modal.ingrediente.nombre}
          isPending={stockMutation.isPending}
          onConfirm={handleConfirmReponer}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default IngredientesPage;
