import { useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import type { Producto } from "../../../types/producto";
import type { Categoria } from "../../../types/categoria";
import type { Ingrediente } from "../../../types/ingrediente";

type ProductoListProps = {
  productos: Producto[];
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onView: (producto: Producto) => void;
  isAdmin: boolean;
};

const ProductoList = ({ productos, categorias, ingredientes, onEdit, onDelete, onView, isAdmin }: ProductoListProps) => {
  const columns = useMemo(
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
        accessorFn: (row: Producto) => row.categorias_ids?.map(id => categorias.find(c => c.id === id)?.nombre).join(", ") || "—",
      },
      {
        header: "Ingredientes",
        accessorFn: (row: Producto) => row.ingredientes_ids?.map(id => ingredientes.find(i => i.id === id)?.nombre).join(", ") || "—",
      },
      {
        header: "Precio",
        accessorFn: (row: Producto) => row.precio_base != null ? `$${row.precio_base.toFixed(2)}` : "—",
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
    [categorias, ingredientes, isAdmin]
  );

  const table = useReactTable({
    data: productos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Productos</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductoList;
