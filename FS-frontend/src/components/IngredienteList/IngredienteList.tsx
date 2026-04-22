import type { Ingrediente } from "../../types/ingrediente";
import IngredienteCard from "../IngredienteCard/IngredienteCard";

type IngredienteListProps = {
  ingredientes: Ingrediente[];
  onEdit: (ingrediente: Ingrediente) => void;
  onDelete: (id: number) => void;
  onView: (ingrediente: Ingrediente) => void;
};

const IngredienteList = ({ ingredientes, onEdit, onDelete, onView}: IngredienteListProps) => {
  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredientes</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Descripcion</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Alergeno</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ingredientes.map((ingrediente) => (
              <IngredienteCard
                key={ingrediente.id}
                ingrediente={ingrediente}
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

export default IngredienteList;