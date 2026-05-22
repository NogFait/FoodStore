import { useMemo } from "react";
import type { Categoria } from "../types";

type CategoriaListProps = {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
  onView: (categoria: Categoria) => void;
  isAdmin: boolean;
};

type TreeNode = Categoria & { depth: number; isLast: boolean[] };

function buildTree(categorias: Categoria[]): TreeNode[] {
  const map = new Map<number | null, Categoria[]>();
  categorias.forEach((c) => {
    const k = c.parent_id ?? null;
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(c);
  });
  map.forEach((v) => v.sort((a, b) => a.id - b.id));

  const flat: TreeNode[] = [];
  function walk(parentId: number | null, depth: number, isLast: boolean[]) {
    const children = map.get(parentId) || [];
    children.forEach((c, i) => {
      const last = i === children.length - 1;
      flat.push({ ...c, depth, isLast: [...isLast, last] });
      walk(c.id, depth + 1, [...isLast, last]);
    });
  }
  walk(null, 0, []);
  return flat;
}

function TreePrefix({ depth, isLast }: { depth: number; isLast: boolean[] }) {
  if (depth === 0) return null;
  const parts: string[] = [];
  for (let i = 0; i < depth - 1; i++) {
    parts.push(isLast[i] ? "   " : "│  ");
  }
  parts.push(isLast[depth - 1] ? "└─ " : "├─ ");
  return <span className="text-gray-300 font-mono whitespace-pre">{parts.join("")}</span>;
}

const CategoriaList = ({ categorias, onEdit, onDelete, onView, isAdmin }: CategoriaListProps) => {
  const tree = useMemo(() => buildTree(categorias), [categorias]);

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Categorías</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider hidden sm:table-cell">Descripción</th>
              <th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tree.map((node) => (
              <tr key={node.id} className="hover:bg-indigo-50/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <TreePrefix depth={node.depth} isLast={node.isLast} />
                    <span className={`text-sm font-medium text-gray-900 ${node.depth > 0 ? "text-gray-700" : ""}`}>
                      {node.nombre}
                    </span>
                    {node.depth === 0 && (
                      <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold ml-1">Raíz</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell max-w-xs truncate">
                  {node.descripcion}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onView(node)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      Ver
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEdit(node)}
                          className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(node.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriaList;
