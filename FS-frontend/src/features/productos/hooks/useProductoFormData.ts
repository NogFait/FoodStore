import {useQuery} from "@tanstack/react-query";
import {getCategorias} from "../../categorias/services/categoriaService";
import {getIngredientes} from "../../ingredientes/services/ingredienteService";
import {getUnidadesMedida} from "../../unidades-medida/services/unidadMedidaService";

const OPCIONES_ESCALA_TIEMPO= 10 * 60 * 1000; // 10 minutos

export function useProductoFormData() {
    const categorias= useQuery({
        queryKey: ["categorias"],
        queryFn: () => getCategorias({ limit: 100 }),
        staleTime: OPCIONES_ESCALA_TIEMPO,
    });

    const ingredientes= useQuery({
        queryKey: ["ingredientes"],
        queryFn: () => getIngredientes({ limit: 100 }),
        staleTime: OPCIONES_ESCALA_TIEMPO,
    });

    const unidadesMedida= useQuery({
        queryKey: ["unidades-medida"],
        queryFn: () => getUnidadesMedida({ limit: 100 }),
        staleTime: OPCIONES_ESCALA_TIEMPO,
    });

    return { 
        categorias: categorias.data || [],
        ingredientes: ingredientes.data || [],
        unidadesMedida: unidadesMedida.data || [],
        isLoading: categorias.isLoading || ingredientes.isLoading || unidadesMedida.isLoading,
        isError: categorias.isError || ingredientes.isError || unidadesMedida.isError,
    };
}