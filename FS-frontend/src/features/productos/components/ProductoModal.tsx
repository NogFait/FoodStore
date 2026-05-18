import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import type { Producto } from "../types";
import type { Categoria } from "../../categorias/types";
import type { Ingrediente } from "../../ingredientes/types";

type ProductoModalProps = {
  isOpen: boolean;
  producto: Producto | null;
  onClose: () => void;
  onSubmit: (data: Omit<Producto, "id">) => void;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
};

const ProductoModal = ({ isOpen, producto, onClose, onSubmit, categorias, ingredientes }: ProductoModalProps) => {
  const form = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio_base: 0,
      stock_cantidad: 0,
      imagenes_url: "",
      categorias_ids: [] as number[],
      ingredientes_ids: [] as number[],
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre,
        descripcion: value.descripcion,
        precio_base: value.precio_base,
        stock_cantidad: value.stock_cantidad,
        disponible: true,
        imagenes_url: value.imagenes_url || undefined,
        categorias_ids: value.categorias_ids,
        ingredientes_ids: value.ingredientes_ids,
      });
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (producto) {
        form.setFieldValue("nombre", producto.nombre);
        form.setFieldValue("descripcion", producto.descripcion);
        form.setFieldValue("precio_base", producto.precio_base);
        form.setFieldValue("stock_cantidad", producto.stock_cantidad);
        form.setFieldValue("imagenes_url", producto.imagenes_url || "");
        form.setFieldValue("categorias_ids", producto.categorias_ids);
        form.setFieldValue("ingredientes_ids", producto.ingredientes_ids || []);
      } else {
        form.setFieldValue("nombre", "");
        form.setFieldValue("descripcion", "");
        form.setFieldValue("precio_base", 0);
        form.setFieldValue("stock_cantidad", 0);
        form.setFieldValue("imagenes_url", "");
        form.setFieldValue("categorias_ids", []);
        form.setFieldValue("ingredientes_ids", []);
      }
    }
  }, [producto, isOpen]);

  if (!isOpen) return null;

  const esModoEditar = !!producto;
  const titulo = esModoEditar ? "Editar Producto" : "Nuevo Producto";

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
              <form.Field
                name="imagenes_url"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredientes</label>
              <form.Field
                name="ingredientes_ids"
                children={(field) => (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {ingredientes.map((ing) => {
                        const isSelected = field.state.value.includes(ing.id);
                        return (
                          <button
                            key={ing.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                field.handleChange(field.state.value.filter((id) => id !== ing.id));
                              } else {
                                field.handleChange([...field.state.value, ing.id]);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                              isSelected
                                ? ing.es_alergeno
                                  ? "bg-amber-500 text-white border-amber-500 shadow-md"
                                  : "bg-green-600 text-white border-green-600 shadow-md"
                                : ing.es_alergeno
                                ? "bg-amber-100 text-amber-700 border-amber-300 hover:border-amber-500 hover:bg-amber-50"
                                : "bg-green-50 text-green-700 border-green-300 hover:border-green-500 hover:bg-green-50"
                            }`}
                          >
                            {ing.nombre}
                            {ing.es_alergeno && " ⚠️"}
                          </button>
                        );
                      })}
                    </div>
                    {field.state.value.length === 0 && (
                      <p className="text-xs text-gray-400 mt-2">Seleccioná uno o más ingredientes</p>
                    )}
                  </>
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
