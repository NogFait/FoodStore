import { useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import type { Ingrediente } from "../types";

type IngredienteListProps = {
  ingredientes: Ingrediente[];
  onEdit: (ingrediente: Ingrediente) => void;
  onDelete: (id: number) => void;
  onView: (ingrediente: Ingrediente) => void;
  onMarcarFaltante: (ingrediente: Ingrediente) => void;
  onReponer: (ingrediente: Ingrediente) => void;
  isAdmin: boolean;
  canStock: boolean;
};

const IngredienteList = ({
  ingredientes = [],
  onEdit,
  onDelete,
  onView,
  onMarcarFaltante,
  onReponer,
  isAdmin,
  canStock,
}: IngredienteListProps) => {
  const safeIngredientes = Array.isArray(ingredientes) ? ingredientes : [];

  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      { header: "Nombre", accessorKey: "nombre" },
      { header: "Descripcion", accessorKey: "descripcion" },
      {
        header: "Alergeno",
        accessorFn: (row: Ingrediente) => (row.es_alergeno ? "Sí ⚠️" : "No"),
      },
      {
        header: "Stock",
        cell: ({ row }: { row: { original: Ingrediente } }) => {
          const { stock_cantidad } = row.original;
          return (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                stock_cantidad === 0
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {stock_cantidad === 0 ? "Faltante" : stock_cantidad}
            </span>
          );
        },
      },
      {
        header: "Acciones",
        cell: ({ row }: { row: { original: Ingrediente } }) => (
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => onView(row.original)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Ver
            </button>

            {canStock && (
              <>
                {row.original.stock_cantidad === 0 ? (
                  <button
                    onClick={() => onReponer(row.original)}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                  >
                    Reponer
                  </button>
                ) : (
                  <button
                    onClick={() => onMarcarFaltante(row.original)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                  >
                    Marcar faltante
                  </button>
                )}
              </>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => onEdit(row.original)}
                  className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(row.original.id)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [isAdmin, canStock, onView, onEdit, onDelete, onMarcarFaltante, onReponer],
  );

  const table = useReactTable({
    data: safeIngredientes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredientes</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
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

export default IngredienteList;
