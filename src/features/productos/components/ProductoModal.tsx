import { useState } from "react";
import { useProductoForm } from "../hooks/useProductoForm";
import api from "../../../api/api";
import type { Producto } from "../types";
import type { Categoria } from "../../categorias/types";
import type { Ingrediente } from "../../ingredientes/types";
import type { UnidadMedida } from "../../unidades-medida/types";
import { SharedImageUploader } from "../../../components/ui/SharedImageUploader";

type ProductoModalProps = {
  isOpen: boolean;
  producto: Producto | null;
  onClose: () => void;
  onSubmit: (data: Omit<Producto, "id">) => void;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  unidadesMedida: UnidadMedida[];
};

const ProductoModal = ({ isOpen, producto, onClose, onSubmit, categorias, ingredientes, unidadesMedida }: ProductoModalProps) => {
  const { form, titulo, toggleIngrediente, updateIngField } = useProductoForm(producto, isOpen, onSubmit);

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": null },
      });
      setUrl(data.url);
    } catch (err) {
      console.error("Error al subir la imagen", err);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">{titulo}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex-1 overflow-hidden"
        >
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[70vh]">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base *</label>
                <form.Field
                  name="precio_base"
                  validators={{
                    onChange: ({ value }) =>
                      isNaN(value) || value < 0 ? { message: "El precio debe ser >= 0" } : undefined,
                  }}
                  children={(field) => (
                    <>
                      <input
                        type="number"
                        step="0.01"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <form.Field
                  name="stock_cantidad"
                  children={(field) => (
                    <input
                      type="number"
                      min="0"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  )}
                />
              </div>
            </div>

            <form.Field
              name="disponible"
              children={(field) => (
                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    field.state.value
                      ? "border-green-300 bg-green-50/50 hover:border-green-400"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <span className="block text-sm font-medium text-gray-900">
                      Disponible para la venta
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      {field.state.value
                        ? "El producto aparece en el menú público"
                        : "El producto está oculto del menú público"}
                    </span>
                  </div>
                </label>
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Venta</label>
              <form.Field
                name="unidad_venta_id"
                children={(field) => (
                  <select
                    value={field.state.value ?? ""}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Sin unidad</option>
                    {unidadesMedida.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.simbolo})
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes</label>
              <form.Field
                name="imagenes_url"
                children={(field) => (
                  <SharedImageUploader
                    mode="multiple"
                    urls={field.state.value ?? []}
                    onChange={(urls) => field.handleChange(urls)}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorías</label>
              <form.Field
                name="categorias_ids"
                children={(field) => (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {categorias.map((cat) => {
                        const isSelected = field.state.value.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                field.handleChange(field.state.value.filter((id) => id !== cat.id));
                              } else {
                                field.handleChange([...field.state.value, cat.id]);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                            }`}
                          >
                            {cat.nombre}
                          </button>
                        );
                      })}
                    </div>
                    {field.state.value.length === 0 && (
                      <p className="text-xs text-gray-400 mt-2">Seleccioná una o más categorías</p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Ingredientes</label>
                <form.Subscribe
                  selector={(state) => state.values.ingredientes}
                  children={(seleccionados) => (
                    <span className="text-xs text-gray-400">
                      {seleccionados.length} seleccionados
                    </span>
                  )}
                />
              </div>
              <form.Field
                name="ingredientes"
                children={(field) => (
                  <div className="space-y-2">
                    {ingredientes.map((ing) => {
                      const pi = field.state.value.find(
                        (i) => i.ingrediente_id === ing.id
                      );
                      const isSelected = !!pi;
                      return (
                        <div
                          key={ing.id}
                          className={`border rounded-lg p-3 transition-all ${
                            isSelected
                              ? ing.es_alergeno
                                ? "border-amber-300 bg-amber-50/50"
                                : "border-green-300 bg-green-50/50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleIngrediente(ing.id)}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm font-medium text-gray-900">{ing.nombre}</span>
                              {ing.es_alergeno && (
                                <span className="text-[10px] uppercase tracking-wider text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-semibold">
                                  Alérgeno
                                </span>
                              )}
                            </label>
                          </div>

                          {isSelected && (
                            <div className="mt-3 ml-6 grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-0.5">Cantidad</label>
                                <input
                                  type="number"
                                  step="any"
                                  min="0"
                                  value={pi.cantidad ?? ""}
                                  onChange={(e) =>
                                    updateIngField(ing.id, "cantidad", e.target.value ? parseFloat(e.target.value) : null)
                                  }
                                  placeholder="—"
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-0.5">Unidad</label>
                                <select
                                  value={pi.unidad_medida_id ?? ""}
                                  onChange={(e) =>
                                    updateIngField(ing.id, "unidad_medida_id", e.target.value ? parseInt(e.target.value) : null)
                                  }
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                                >
                                  <option value="">—</option>
                                  {unidadesMedida.map((u) => (
                                    <option key={u.id} value={u.id}>
                                      {u.simbolo}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-end pb-1.5">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={pi.es_removible}
                                    onChange={(e) => updateIngField(ing.id, "es_removible", e.target.checked)}
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="text-xs text-gray-500">Removible</span>
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {ingredientes.length === 0 && (
                      <p className="text-xs text-gray-400">No hay ingredientes disponibles</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
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

export default ProductoModal;
