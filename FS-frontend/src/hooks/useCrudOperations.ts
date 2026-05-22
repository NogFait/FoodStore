import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CrudParams = {
  skip: number;
  limit: number;
  [key: string]: string | number | boolean | undefined;
};

export function useCrudOperations<T>(
  queryKey: string[],
  fetchFn: (params: CrudParams) => Promise<T[]>,
  createFn: (data: Record<string, unknown>) => Promise<T>,
  updateFn: (id: number, data: Record<string, unknown>) => Promise<T>,
  deleteFn: (id: number) => Promise<void>,
  extraInvalidations?: string[][],
) {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<CrudParams>({
    skip: 0,
    limit: 20,
  });

  const query = useQuery({
    queryKey: [...queryKey, pagination],
    queryFn: () => fetchFn(pagination),
    staleTime: 10000 * 60,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey });
    extraInvalidations?.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  };

  const createMutation = useMutation({
    mutationFn: createFn,
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      updateFn(id, data),
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    pagination,
    setPagination,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
