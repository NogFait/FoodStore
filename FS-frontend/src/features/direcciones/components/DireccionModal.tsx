import { useDireccionForm } from "../hooks/useDireccionForm";
import type { Direccion } from "../types";

type DireccionModalProps = {
  direccion: Direccion | null;
  onClose: () => void;
  onSubmit: (data: Omit<Direccion, "id" | "usuario_id">) => void;
};

const DireccionModal = ({ direccion, onClose, onSubmit }: DireccionModalProps) => {
  const { form, esModoEditar, titulo } = useDireccionForm(direccion, onSubmit);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{titulo}</h2>
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
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alias *</label>
              <form.Field
                name="alias"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? { message: "El alias es obligatorio" } : undefined,
                }}
                children={(field) => (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="ej: Casa, Trabajo"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
              <form.Field
                name="linea1"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? { message: "La dirección es obligatoria" } : undefined,
                }}
                children={(field) => (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Calle y número"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección (línea 2)</label>
              <form.Field
                name="linea2"
                children={(field) => (
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="apto, dpto, piso, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                <form.Field
                  name="ciudad"
                  validators={{
                    onChange: ({ value }) =>
                      !value?.trim() ? { message: "La ciudad es obligatoria" } : undefined,
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                <form.Field
                  name="provincia"
                  validators={{
                    onChange: ({ value }) =>
                      !value?.trim() ? { message: "La provincia es obligatoria" } : undefined,
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
              <form.Field
                name="codigo_postal"
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? { message: "El código postal es obligatorio" } : undefined,
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                <form.Field
                  name="latitud"
                  children={(field) => (
                    <input
                      type="number"
                      step="any"
                      value={field.state.value ?? ""}
                      onChange={(e) =>
                        field.handleChange(e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                <form.Field
                  name="longitud"
                  children={(field) => (
                    <input
                      type="number"
                      step="any"
                      value={field.state.value ?? ""}
                      onChange={(e) =>
                        field.handleChange(e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <form.Field
                name="es_principal"
                children={(field) => (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Marcar como dirección principal</span>
                  </label>
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
                  {isSubmitting ? "Guardando..." : esModoEditar ? "Guardar cambios" : "Crear dirección"}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default DireccionModal;
