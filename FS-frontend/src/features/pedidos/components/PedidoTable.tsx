import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import type { PedidoResumen } from "../types";

type PedidoTableProps = {
  data: PedidoResumen[];
  columns: ColumnDef<PedidoResumen>[];
};

const PedidoTable = ({ data, columns }: PedidoTableProps) => {
  "use no memo";

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
              <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PedidoTable;
