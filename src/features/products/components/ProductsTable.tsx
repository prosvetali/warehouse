"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Barcode from "react-barcode";
import { Rating } from "react-simple-star-rating";
import { useSnapshot } from "valtio";
import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { Checkbox } from "@/shared/ui/Checkbox";
import IconEdit from "@/shared/icons/edit.svg";
import IconTrash from "@/shared/icons/trash.svg";
import { useSuppliersQuery } from "@/features/suppliers/hooks/useSuppliersQuery";
import { fetchCategories } from "@/features/categories/api";
import { useQuery } from "@tanstack/react-query";
import {
  clearSelection,
  productsStore,
  setSelected,
  setSort,
  toggleSelect,
} from "../store";
import type { Product, SortField } from "../types";
import { useDeleteProduct, useToggleActive } from "../hooks/useProductMutations";
import { useProductsQuery } from "../hooks/useProductsQuery";

interface Props {
  rows: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

function useCategoriesMap() {
  return useQuery({
    queryKey: ["categories", "all"],
    queryFn: async () => {
      const result = await fetchCategories({ page: 1, limit: 100 });
      const map = new Map<number, string>();
      for (const c of result.data) map.set(c.id, c.name);
      return map;
    },
    staleTime: 5 * 60_000,
  });
}

export function ProductsTable({ rows, isLoading, isError, onRetry }: Props) {
  const snap = useSnapshot(productsStore);
  const { data: suppliers } = useSuppliersQuery();
  const { data: categoriesMap } = useCategoriesMap();
  const toggleActive = useToggleActive();
  const deleteMutation = useDeleteProduct();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const supplierMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const s of suppliers ?? []) map.set(s.id, s.name);
    return map;
  }, [suppliers]);

  const columns: DataTableColumn<Product>[] = useMemo(
    () => [
      {
        id: "image",
        header: "Зобр.",
        className: "w-20",
        cell: (row) => (
          <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100">
            {row.images?.[0] ? (
              row.images[0].startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row.images[0]}
                  alt={row.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={row.images[0]}
                  alt={row.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              )
            ) : null}
          </div>
        ),
      },
      {
        id: "name",
        header: "Назва",
        cell: (row) => (
          <Link
            href={`/products/${row.id}`}
            className="font-medium text-[var(--color-text)] hover:text-[var(--color-brand)]"
          >
            {row.name}
          </Link>
        ),
      },
      {
        id: "sku",
        header: "SKU / штрихкод",
        cell: (row) => (
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs">{row.sku}</span>
            <span className="overflow-hidden">
              <Barcode
                value={row.barcode || row.sku}
                width={1}
                height={28}
                fontSize={10}
                margin={0}
                displayValue={false}
              />
            </span>
          </div>
        ),
      },
      {
        id: "category",
        header: "Категорія",
        cell: (row) => (
          <span>{categoriesMap?.get(row.categoryId) ?? `#${row.categoryId}`}</span>
        ),
      },
      {
        id: "supplier",
        header: "Постачальник",
        cell: (row) => <span>{supplierMap.get(row.supplierId) ?? `#${row.supplierId}`}</span>,
      },
      {
        id: "price",
        header: "Ціна",
        sortKey: "price",
        cell: (row) => (
          <span className="tabular-nums">${row.price.toFixed(2)}</span>
        ),
      },
      {
        id: "rating",
        header: "Рейтинг",
        cell: (row) => (
          <Rating
            initialValue={row.rating}
            readonly
            size={16}
            allowFraction={false}
            SVGstyle={{ display: "inline-block" }}
          />
        ),
      },
      {
        id: "receivedAt",
        header: "Надходження",
        sortKey: "receivedAt",
        cell: (row) => (
          <span className="tabular-nums text-[var(--color-muted)]">{row.receivedAt}</span>
        ),
      },
      {
        id: "active",
        header: "Активний",
        cell: (row) => (
          <Checkbox
            checked={row.active}
            onChange={(e) => toggleActive.mutate({ id: row.id, active: e.target.checked })}
            aria-label={row.active ? "Деактивувати" : "Активувати"}
          />
        ),
      },
      {
        id: "actions",
        header: "Дії",
        className: "w-24",
        cell: (row) => (
          <div className="flex items-center gap-1">
            <Link
              href={`/products/${row.id}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-muted)] hover:bg-gray-100 hover:text-[var(--color-text)]"
              aria-label={`Редагувати ${row.name}`}
            >
              <IconEdit className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-muted)] hover:bg-red-50 hover:text-[var(--color-danger)]"
              aria-label={`Видалити ${row.name}`}
              onClick={() => setConfirmId(row.id)}
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [categoriesMap, supplierMap, toggleActive],
  );

  const allOnPage = (rows ?? []).map((r) => r.id);

  return (
    <>
      <DataTable<Product>
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        rowKey={(row) => row.id}
        selectable
        selectedIds={[...snap.selectedIds]}
        sort={{ field: snap.sort, order: snap.order }}
        onSortChange={({ field, order }) => setSort(field as SortField | null, order)}
        onSelectRow={(id, checked) => toggleSelect(Number(id), checked)}
        onSelectAll={(checked) => {
          if (checked) {
            setSelected(Array.from(new Set([...snap.selectedIds, ...allOnPage])));
          } else {
            setSelected(snap.selectedIds.filter((id) => !allOnPage.includes(id)));
          }
        }}
        emptyTitle="Товарів не знайдено"
        emptyDescription="Спробуйте змінити фільтри або скинути їх."
      />
      <ConfirmDialog
        open={confirmId !== null}
        title="Видалити товар?"
        description="Цю дію не можна скасувати."
        destructive
        confirmLabel="Видалити"
        loading={deleteMutation.isPending}
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId == null) {
            return;
          }
          deleteMutation.mutate(confirmId, {
            onSuccess: () => {
              setConfirmId(null);
              if (snap.selectedIds.includes(confirmId)) {
                clearSelection();
              }
            },
            onError: () => setConfirmId(null),
          });
        }}
      />
    </>
  );
}

export function ProductsTableContainer() {
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
  const query = useProductsQuery(filters);
  return (
    <ProductsTable
      rows={query.data?.data}
      isLoading={query.isLoading}
      isError={query.isError}
      onRetry={() => query.refetch()}
    />
  );
}
