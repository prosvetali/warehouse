import { useQuery } from "@tanstack/react-query";
import { fetchSuppliers } from "../api";
import type { Supplier } from "../types";

export const SUPPLIERS_QUERY_KEY = ["suppliers"] as const;

export function useSuppliersQuery() {
  return useQuery<Supplier[]>({
    queryKey: SUPPLIERS_QUERY_KEY,
    queryFn: fetchSuppliers,
    staleTime: 5 * 60_000,
  });
}
