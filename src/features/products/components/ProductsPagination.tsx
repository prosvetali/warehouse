"use client";

import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { Pagination } from "@/shared/ui/Pagination";
import { useProductsQuery } from "../hooks/useProductsQuery";
import { productsStore, setPage } from "../store";

export function ProductsPagination() {
  const snap = useSnapshot(productsStore);
  const filters = useMemo(
    () => ({
      search: snap.search,
      categoryId: snap.categoryId,
      dateFrom: snap.dateFrom,
      dateTo: snap.dateTo,
      sort: snap.sort,
      order: snap.order,
      page: snap.page,
      limit: snap.limit,
    }),
    [
      snap.search,
      snap.categoryId,
      snap.dateFrom,
      snap.dateTo,
      snap.sort,
      snap.order,
      snap.page,
      snap.limit,
    ],
  );
  const { data } = useProductsQuery(filters);
  const total = data?.total ?? 0;

  return (
    <Pagination
      page={snap.page}
      total={total}
      limit={snap.limit}
      onChange={(p) => setPage(p)}
    />
  );
}
