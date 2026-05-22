import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import type { Producto, ProductoIngrediente } from "../types";

const defaultIng = (ingId: number): ProductoIngrediente => ({
  ingrediente_id: ingId,
  cantidad: null,
  unidad_medida_id: null,
  es_removible: false,
});

export function useProductoForm(
  producto: Producto | null,
  isOpen: boolean,
  onSubmit: (data: Omit<Producto, "id">) => void,
) {
  const form = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio_base: 0,
      stock_cantidad: 0,
      imagenes_url: "",
      unidad_venta_id: undefined as number | undefined,
      categorias_ids: [] as number[],
      ingredientes: [] as ProductoIngrediente[],
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre,
        descripcion: value.descripcion,
        precio_base: value.precio_base,
        stock_cantidad: value.stock_cantidad,
        disponible: true,
        imagenes_url: value.imagenes_url || undefined,
        unidad_venta_id: value.unidad_venta_id || undefined,
        categorias_ids: value.categorias_ids,
        ingredientes_ids: value.ingredientes.map((i) => i.ingrediente_id),
        ingredientes: value.ingredientes,
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
        form.setFieldValue("unidad_venta_id", producto.unidad_venta_id);
        form.setFieldValue("categorias_ids", producto.categorias_ids);
        form.setFieldValue("ingredientes", producto.ingredientes || []);
      } else {
        form.setFieldValue("nombre", "");
        form.setFieldValue("descripcion", "");
        form.setFieldValue("precio_base", 0);
        form.setFieldValue("stock_cantidad", 0);
        form.setFieldValue("imagenes_url", "");
        form.setFieldValue("unidad_venta_id", undefined);
        form.setFieldValue("categorias_ids", []);
        form.setFieldValue("ingredientes", []);
      }
    }
  }, [producto, isOpen]);

  const toggleIngrediente = (ingId: number) => {
    const current = form.getFieldValue("ingredientes");
    const exists = current.find((i) => i.ingrediente_id === ingId);
    if (exists) {
      form.setFieldValue("ingredientes", current.filter((i) => i.ingrediente_id !== ingId));
    } else {
      form.setFieldValue("ingredientes", [...current, defaultIng(ingId)]);
    }
  };

  const updateIngField = (ingId: number, field: string, value: unknown) => {
    const current = form.getFieldValue("ingredientes");
    form.setFieldValue(
      "ingredientes",
      current.map((i) => (i.ingrediente_id === ingId ? { ...i, [field]: value } : i)),
    );
  };

  return {
    form,
    esModoEditar: !!producto,
    titulo: producto ? "Editar Producto" : "Nuevo Producto",
    toggleIngrediente,
    updateIngField,
  };
}
