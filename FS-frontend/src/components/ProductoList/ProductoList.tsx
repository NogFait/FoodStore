import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";
import type { Ingrediente } from "../../types/ingrediente";
import ProductoCard from "../ProductoCard/ProductoCard";

type ProductoListProps = {
  productos: Producto[];
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onView: (producto: Producto) => void;
};

const ProductoList = ({ productos, categorias, ingredientes, onEdit, onDelete, onView}: ProductoListProps) => {
  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Productos</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Categorías</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Ingredientes</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productos.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                categorias={categorias}
                ingredientes={ingredientes}
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

export default ProductoList;
