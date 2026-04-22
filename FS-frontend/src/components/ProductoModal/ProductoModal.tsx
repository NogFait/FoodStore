import { useState, useEffect } from "react";
import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";
import FormAlert from "../FormAlert/FormAlert";

type ProductoModalProps = {
  isOpen: boolean;
  producto: Producto | null;
  onClose: () => void;
  onSubmit: (data: Omit<Producto, "id">) => void;
  categorias: Categoria[];
   
};

const ProductoModal = ({ isOpen, producto, onClose, onSubmit, categorias }: ProductoModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioBase, setPrecioBase] = useState("");
  const [stockCantidad, setStockCantidad] = useState("");
  
  const [imagenUrl, setImagenUrl] = useState("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setPrecioBase(producto.precio_base.toString());
      setStockCantidad(producto.stock_cantidad.toString());
      setImagenUrl(producto.imagenes_url || "");
      setCategoriasSeleccionadas(producto.categorias_ids);
    } else {
      setNombre("");
      setDescripcion("");
      setPrecioBase("");
      setStockCantidad("0");
      setImagenUrl("");
      setCategoriasSeleccionadas([]);
    }
    setError("");
  }, [producto, isOpen]);

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
    if (!precioBase.trim() || isNaN(parseFloat(precioBase)) || parseFloat(precioBase) < 0) {
      setError("El precio base debe ser un número válido mayor o igual a 0");
      return;
    }

    onSubmit({
      nombre,
      descripcion,
      precio_base: parseFloat(precioBase),
      stock_cantidad: parseInt(stockCantidad) || 0,
      imagenes_url: imagenUrl || undefined,
      categorias_ids: categoriasSeleccionadas,
    });
  };

  const esModoEditar = !!producto;
  const titulo = esModoEditar ? "Editar Producto" : "Nuevo Producto";

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Base *
              </label>
              <input
                type="number"
                step="0.01"
                value={precioBase}
                onChange={(e) => setPrecioBase(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={stockCantidad}
                onChange={(e) => setStockCantidad(e.target.value)}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorías</label>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => {
                  const isSelected = categoriasSeleccionadas.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setCategoriasSeleccionadas(
                            categoriasSeleccionadas.filter((id) => id !== cat.id)
                          );
                        } else {
                          setCategoriasSeleccionadas([
                            ...categoriasSeleccionadas,
                            cat.id,
                          ]);
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
              {categoriasSeleccionadas.length === 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  Seleccioná una o más categorías
                </p>
              )}
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

export default ProductoModal;
