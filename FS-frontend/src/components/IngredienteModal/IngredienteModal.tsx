import { useState, useEffect } from "react";
import type { Ingrediente } from "../../types/ingrediente";
import FormAlert from "../FormAlert/FormAlert";

type IngredienteModalProps = {
  isOpen: boolean;
  ingrediente: Ingrediente | null;
  onClose: () => void;
  onSubmit: (data: Omit<Ingrediente, "id">) => void;
};

const IngredienteModal = ({ isOpen, ingrediente, onClose, onSubmit }: IngredienteModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [esAlergeno, setEsAlergeno] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ingrediente) {
      setNombre(ingrediente.nombre);
      setDescripcion(ingrediente.descripcion);
      setEsAlergeno(ingrediente.es_alergeno);
    } else {
      setNombre("");
      setDescripcion("");
      setEsAlergeno(false);
    }
    setError("");
  }, [ingrediente, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }
    onSubmit({
      nombre,
      descripcion,
      es_alergeno: esAlergeno,
    });
  };

  const esModoEditar = !!ingrediente;
  const titulo = esModoEditar ? "Editar Ingrediente" : "Nuevo Ingrediente";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">{titulo}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <FormAlert message={error} onClose={() => setError("")} />
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="esAlergeno"
                checked={esAlergeno}
                onChange={(e) => setEsAlergeno(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="esAlergeno" className="text-sm font-medium text-gray-700">
                Es alérgeno
              </label>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredienteModal;