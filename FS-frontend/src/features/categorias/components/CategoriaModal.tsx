import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import type { Categoria } from "../../../types/categoria";

type CategoriaModalProps = {
  categoria: Categoria | null;
  onClose: () => void;
  onSubmit: (data: { nombre: string; descripcion: string; imagen_url?: string }) => void;
};

const CategoriaModal = ({ categoria, onClose, onSubmit }: CategoriaModalProps) => {
  const form = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      imagen_url: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre,
        descripcion: value.descripcion,
        imagen_url: value.imagen_url || undefined,
      });
    },
  });

  useEffect(() => {
    if (categoria) {
      form.setFieldValue("nombre", categoria.nombre);
      form.setFieldValue("descripcion", categoria.descripcion);
      form.setFieldValue("imagen_url", categoria.imagen_url || "");
    } else {
      form.setFieldValue("nombre", "");
      form.setFieldValue("descripcion", "");
      form.setFieldValue("imagen_url", "");
    }
  }, [categoria]);

  const esModoEditar = !!categoria;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {esModoEditar ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <form.Field
                name="nombre"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? { message: "El nombre es obligatorio" } : undefined,
                }}
                children={(field) => (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    {field.state.meta.errors && (
                      <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <form.Field
                name="descripcion"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? { message: "La descripción es obligatoria" } : undefined,
                }}
                children={(field) => (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    {field.state.meta.errors && (
                      <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
              <form.Field
                name="imagen_url"
                children={(field) => (
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                )}
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
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : esModoEditar ? "Guardar cambios" : "Crear categoría"}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaModal;
