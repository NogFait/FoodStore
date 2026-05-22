import { useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import type { Direccion } from "../types";

type DireccionListProps = {
  direcciones: Direccion[];
  onEdit: (direccion: Direccion) => void;
  onDelete: (id: number) => void;
  onView: (direccion: Direccion) => void;
};

const DireccionList = ({ direcciones, onEdit, onDelete, onView }: DireccionListProps) => {
  const columns = useMemo(
    () => [
      {
        header: "Alias",
        accessorKey: "alias",
      },
      {
        header: "Dirección",
        cell: ({ row }: { row: { original: Direccion } }) => (
          <span className="text-sm text-gray-600">
            {row.original.linea1}
            {row.original.linea2 && <span>, {row.original.linea2}</span>}
          </span>
        ),
      },
      {
        header: "Ciudad",
        accessorKey: "ciudad",
      },
      {
        header: "Principal",
        cell: ({ row }: { row: { original: Direccion } }) =>
          row.original.es_principal ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              Principal
            </span>
          ) : null,
      },
      {
        header: "Acciones",
        cell: ({ row }: { row: { original: Direccion } }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onView(row.original)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Ver
            </button>
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
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: direcciones,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Direcciones</h2>
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

export default DireccionList;
