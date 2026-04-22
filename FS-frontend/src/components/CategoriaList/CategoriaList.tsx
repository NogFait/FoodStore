import type { Categoria } from "../../types/categoria";
import CategoriaCard from "../CategoriaCard/CategoriaCard";

type CategoriaListProps = {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
  onView: (categoria: Categoria) => void;
};

const CategoriaList = ({ categorias, onEdit, onDelete, onView }: CategoriaListProps) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Categorías</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categorias.map((categoria) => (
              <CategoriaCard
                key={categoria.id}
                categoria={categoria}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriaList;
