import { useState, useMemo } from "react";
import ProductoList from "../components/ProductoList";
import ProductoModal from "../components/ProductoModal";
import ProductoDetailModal from "../components/ProductoDetailModal";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import type { Producto } from "../types";
import { useProductos } from "../hooks/useProductos";
import { useRole } from "../../../hooks/useRole";
import { useProductoFormData } from "../hooks/useProductoFormData";
import { ProductListSkeleton } from "../../../components/ui/Skeleton";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; producto: Producto }
  | { type: "detail"; producto: Producto }
  | { type: "confirm-delete"; productoId: number };

const ProductosPage = () => {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [searchText, setSearchText] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<number | "">("");
  const { isAdmin } = useRole();

  const crud = useProductos();

  const { categorias, ingredientes, unidadesMedida } = useProductoFormData();

  const filteredProductos = useMemo(() => {
    if (!crud.data) return undefined;
    let result: Producto[] = crud.data;

    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      result = result.filter((p) => p.nombre.toLowerCase().includes(q));
    }

    if (categoriaFilter !== "") {
      result = result.filter((p) => p.categorias_ids.includes(categoriaFilter as number));
    }

    return result;
  }, [crud.data, searchText, categoriaFilter]);

  const handleCloseModal = () => setModal({ type: "none" });

  const handleEdit = (producto: Producto) =>
    setModal({ type: "edit", producto });
  const handleView = (producto: Producto) =>
    setModal({ type: "detail", producto });
  const handleDelete = (productoId: number) =>
    setModal({ type: "confirm-delete", productoId });

  const handleConfirmDelete = () => {
    if (modal.type === "confirm-delete") {
      crud.deleteMutation.mutate(modal.productoId);
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
              {filteredProductos !== undefined
                ? `${filteredProductos.length} productos encontrados`
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
              Nuevo Producto
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          {/* Text search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-52"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Categoría:</label>
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value === "" ? "" : Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Disponibilidad filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Disponibilidad:
            </label>
            <select
              value={
                crud.pagination.disponible === undefined
                  ? ""
                  : String(crud.pagination.disponible)
              }
              onChange={(e) => {
                const val = e.target.value;
                crud.setPagination((prev) => ({
                  ...prev,
                  disponible: val === "" ? undefined : val === "true",
                  skip: 0,
                }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="true">Disponible</option>
              <option value="false">No disponible</option>
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

        {crud.isLoading && <ProductListSkeleton count={6} />}

        {crud.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-red-600 font-medium">
              Ocurrio un error al cargar los productos
            </p>
            <button
              onClick={() => crud.refetch()}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {filteredProductos && filteredProductos.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay productos
            </h3>
            <p className="text-gray-500 mb-6">
              {searchText || categoriaFilter !== ""
                ? "No se encontraron productos con los filtros aplicados"
                : "Comenzá agregando tu primer producto"}
            </p>
          </div>
        )}

        {filteredProductos && filteredProductos.length > 0 && (
          <ProductoList
            productos={filteredProductos}
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
          onSubmit={(data) =>
            crud.createMutation.mutate(data, {
              onSuccess: () => setModal({ type: "none" }),
            })
          }
          categorias={categorias || []}
          ingredientes={ingredientes || []}
          unidadesMedida={unidadesMedida || []}
        />
      )}

      {modal.type === "edit" && (
        <ProductoModal
          isOpen={modal.type === "edit"}
          producto={modal.producto}
          onClose={handleCloseModal}
          onSubmit={(data) =>
            crud.updateMutation.mutate(
              { id: modal.producto.id, data: data },
              { onSuccess: () => setModal({ type: "none" }) },
            )
          }
          categorias={categorias || []}
          ingredientes={ingredientes || []}
          unidadesMedida={unidadesMedida || []}
        />
      )}

      {modal.type === "detail" && (
        <ProductoDetailModal
          producto={modal.producto}
          categorias={categorias || []}
          ingredientes={ingredientes || []}
          unidadesMedida={unidadesMedida || []}
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
