export function resolveNombres<T extends { id: number; nombre: string }>(
    ids: number[] | undefined,
    catalogo: Map<number, T>,
    condicion?: (item: T) => boolean
):string[]{
    if (!ids) return [];
    return ids.flatMap((id) => {
        const item = catalogo.get(id);
        if (!item) return [];
        if (condicion && !condicion(item)) return [];
        return item.nombre;
    })
}

export function indexarPorId<T extends { id: number }>(items: T[]): Map<number, T> {
    return new Map(items.map((item) => [item.id, item]));
}