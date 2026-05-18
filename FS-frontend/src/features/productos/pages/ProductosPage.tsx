import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProductoList from "../components/ProductoList";
import type { Producto } from "../../../types/producto";
import ProductoModal from "../components/ProductoModal";
import ProductoDetailModal from "../components/ProductoDetailModal";
import ConfirmModal from "../../../shared/components/ConfirmModal/ConfirmModal";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProductos, createProducto, updateProducto, deleteProducto } from "../services/productoService";
import { getCategorias } from "../../categorias/services/categoriaService";
import { getIngredientes } from "../../ingredientes/services/ingredienteService";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; producto: Producto }
  | { type: "detail"; producto: Producto }
  | { type: "confirm-delete"; productoId: number };

const ProductosPage = () => {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 20,
    disponible: undefined as boolean | undefined,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["productos", pagination],
    queryFn: () =>
      getProductos({
        skip: pagination.skip,
        limit: pagination.limit,
        disponible: pagination.disponible,
      }),
    staleTime: 10000 * 60,
  });

  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => getCategorias({ limit: 100 }),
    staleTime: 10000 * 60,
  });

  const { data: ingredientes } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: () => getIngredientes({ limit: 100 }),
    staleTime: 10000 * 60,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Producto, "id">) => createProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      setModal({ type: "none" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Producto, "id"> }) =>
      updateProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      setModal({ type: "none" });
    },
  });

  const handleCloseModal = () => {
    setModal({ type: "none" });
  };

  const handleCreate = (data: Omit<Producto, "id">) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (id: number, data: Omit<Producto, "id">) => {
    updateMutation.mutate({ id, data });
  };

  const handleEdit = (producto: Producto) => {
    setModal({ type: "edit", producto });
  };

  const handleView = (producto: Producto) => {
    setModal({ type: "detail", producto });
  };

  const handleDelete = (id: number) => {
    setModal({ type: "confirm-delete", productoId: id });
  };

  const handleConfirmDelete = () => {
    if (modal.type === "confirm-delete") {
      deleteMutation.mutate(modal.productoId);
      setModal({ type: "none" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="mt-1 text-sm text-gray-500">
              {data ? `${data.length} productos encontrados` : "Cargando..."}
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
              Nuevo Producto
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Disponibilidad:</label>
            <select
              value={pagination.disponible === undefined ? "" : String(pagination.disponible)}
              onChange={(e) => {
                const val = e.target.value;
                setPagination((prev) => ({
                  ...prev,
                  disponible: val === "" ? undefined : val === "true",
                  skip: 0,
                }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos</option>
              <option value="true">Con stock</option>
              <option value="false">Sin stock</option>
            </select>
          </div>

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
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-600 font-medium">Ocurrio un error al cargar los productos</p>
            <button onClick={() => refetch()} className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Reintentar
            </button>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay productos</h3>
            <p className="text-gray-500 mb-6">Comenza agregando tu primer producto</p>
          </div>
        )}

        {data && data.length > 0 && (
          <ProductoList
            productos={data}
            categorias={categorias || []}
            ingredientes={ingredientes || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {modal.type === "create" && (
        <ProductoModal
          isOpen={modal.type === "create"}
          producto={null}
          onClose={handleCloseModal}
          onSubmit={handleCreate}
          categorias={categorias || []}
          ingredientes={ingredientes || []}
        />
      )}

      {modal.type === "edit" && (
        <ProductoModal
          isOpen={modal.type === "edit"}
          producto={modal.producto}
          onClose={handleCloseModal}
          onSubmit={(data) => handleUpdate(modal.producto.id, data)}
          categorias={categorias || []}
          ingredientes={ingredientes || []}
        />
      )}

      {modal.type === "detail" && (
        <ProductoDetailModal
          producto={modal.producto}
          categorias={categorias || []}
          ingredientes={ingredientes || []}
          onClose={handleCloseModal}
        />
      )}

      {modal.type === "confirm-delete" && (
        <ConfirmModal
          isOpen={true}
          title="Eliminar producto"
          message="¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductosPage;
