import { useState, useEffect } from "react";
import type { Categoria } from "../../types/categoria";
import FormAlert from "../FormAlert/FormAlert";

type CategoriaModalProps = {
  categoria: Categoria | null; // null = CREATE, tiene datos = EDIT
  onClose: () => void;
  onSubmit: (data: { nombre: string; descripcion: string; imagen_url?: string }) => void;
};

const CategoriaModal = ({ categoria, onClose, onSubmit }: CategoriaModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion);
      setImagenUrl(categoria.imagen_url || "");
    } else {
      setNombre("");
      setDescripcion("");
      setImagenUrl("");
    }
    setError("");
  }, [categoria]);

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
      imagen_url: imagenUrl || undefined,
    });
  };

  const esModoEditar = !!categoria;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {esModoEditar ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen
              </label>
              <input
                type="text"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
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
              {esModoEditar ? "Guardar cambios" : "Crear categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaModal;
