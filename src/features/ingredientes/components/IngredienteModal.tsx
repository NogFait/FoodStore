import { useIngredienteForm } from "../hooks/useIngredienteForm";
import type { Ingrediente } from "../types";

type IngredienteModalProps = {
  isOpen: boolean;
  ingrediente: Ingrediente | null;
  onClose: () => void;
  onSubmit: (data: Omit<Ingrediente, "id">) => void;
};

const IngredienteModal = ({ isOpen, ingrediente, onClose, onSubmit }: IngredienteModalProps) => {
  const { form, titulo } = useIngredienteForm(ingrediente, isOpen, onSubmit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">{titulo}</h2>
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

            <div className="flex items-center gap-3">
              <form.Field
                name="es_alergeno"
                children={(field) => (
                  <input
                    type="checkbox"
                    id="esAlergeno"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                )}
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
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredienteModal;
