import { useMemo} from "react";
import ProductoTable from "./ProductoTable";
import type { Producto } from "../types";
import type { Categoria } from "../../categorias/types";
import type { Ingrediente } from "../../ingredientes/types";
import { indexarPorId, resolveNombres } from "../utils/lookups";
import type { ColumnDef } from "@tanstack/react-table";

type ProductoListProps = {
  productos: Producto[];
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onView: (producto: Producto) => void;
  isAdmin: boolean;
};

const ProductoList = ({
  productos = [],
  categorias = [],
  ingredientes = [],
  onEdit,
  onDelete,
  onView,
  isAdmin,
}: ProductoListProps) => {
  const categoriasMap = useMemo(() => indexarPorId(categorias), [categorias]);
  const ingredientesMap = useMemo(() => indexarPorId(ingredientes), [ingredientes]);
  const columns = useMemo<ColumnDef<Producto>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Nombre",
        accessorKey: "nombre",
      },
      {
        header: "Categorías",
        accessorFn: (row) =>
          resolveNombres(row.categorias_ids, categoriasMap).join(", ") || "—",
      },
      {
        header: "Ingredientes",
        accessorFn: (row) =>
          resolveNombres(row.ingredientes_ids, ingredientesMap).join(", ") || "—",
      },
      {
        header: "Precio",
        accessorFn: (row: Producto) =>
          row.precio_base != null ? `$${row.precio_base.toFixed(2)}` : "—",
      },
      {
        header: "Stock",
        accessorKey: "stock_cantidad",
      },
      {
        header: "Acciones",
        cell: ({ row }: { row: { original: Producto } }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onView(row.original)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Ver
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => onEdit(row.original)}
                  className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(row.original.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [categoriasMap, ingredientesMap, isAdmin, onEdit, onDelete, onView],
  );
  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Productos</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
        <ProductoTable data={productos} columns={columns} />
      </div>
    </div>
  );
};

export default ProductoList;
