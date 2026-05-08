import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProduct, listProducts, type ListProductsParams } from "../api";
import type { Paginated } from "@/shared/types";
import type { Product } from "../types";

export const PRODUCTS_QUERY_KEY = "products";

export function buildProductsKey(filters: ListProductsParams) {
  return [PRODUCTS_QUERY_KEY, filters] as const;
}

export function buildProductKey(id: number) {
  return ["product", id] as const;
}

export function useProductsQuery(filters: ListProductsParams) {
  return useQuery<Paginated<Product>>({
    queryKey: buildProductsKey(filters),
    queryFn: () => listProducts(filters),
    placeholderData: keepPreviousData,
  });
}

export function useProductQuery(id: number | null | undefined) {
  return useQuery<Product>({
    queryKey: id != null ? buildProductKey(id) : ["product", "missing"],
    queryFn: () => {
      if (id == null) {
        throw new Error("Product id is required");
      }
      return getProduct(id);
    },
    enabled: id != null,
  });
}
