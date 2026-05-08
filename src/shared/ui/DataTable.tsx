"use client";

import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortKey?: string;
}

export interface SortState {
  field: string | null;
  order: "asc" | "desc";
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  rowKey: (row: T) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
  sort?: SortState;
  onSortChange?: (next: SortState) => void;
  selectable?: boolean;
  selectedIds?: Array<string | number>;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  loadingRowsCount?: number;
}

export function DataTable<T>({
  columns,
  rows,
  isLoading,
  isError,
  onRetry,
  rowKey,
  emptyTitle = "Нічого не знайдено",
  emptyDescription,
  sort,
  onSortChange,
  selectable,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  loadingRowsCount = 8,
}: DataTableProps<T>) {
  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  const allSelected =
    selectable && rows && rows.length > 0
      ? rows.every((r) => selectedIds.includes(rowKey(r)))
      : false;

  return (
    <div className="overflow-x-auto rounded-md border border-[var(--color-border)] bg-white">
      <table className="w-full text-sm" role="table">
        <thead className="border-b border-[var(--color-border)] bg-gray-50 text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
          <tr>
            {selectable ? (
              <th scope="col" className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  aria-label="Виділити всі"
                  className="h-4 w-4 cursor-pointer accent-[var(--color-brand)]"
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                />
              </th>
            ) : null}
            {columns.map((col) => {
              const sortable = !!col.sortKey && !!onSortChange;
              const active = sortable && sort?.field === col.sortKey;
              return (
                <th
                  key={col.id}
                  scope="col"
                  className={cn("px-3 py-3 font-semibold", col.headerClassName)}
                  aria-sort={
                    active
                      ? sort?.order === "asc"
                        ? "ascending"
                        : "descending"
                      : sortable
                        ? "none"
                        : undefined
                  }
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!col.sortKey || !onSortChange) {
                          return;
                        }
                        if (sort?.field === col.sortKey) {
                          onSortChange({
                            field: col.sortKey,
                            order: sort.order === "asc" ? "desc" : "asc",
                          });
                        } else {
                          onSortChange({ field: col.sortKey, order: "asc" });
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    >
                      {col.header}
                      <span aria-hidden className="text-[var(--color-muted)]">
                        {active ? (sort?.order === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {isLoading
            ? Array.from({ length: loadingRowsCount }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  {selectable ? (
                    <td className="px-3 py-3">
                      <Skeleton className="h-4 w-4" />
                    </td>
                  ) : null}
                  {columns.map((col) => (
                    <td key={col.id} className={cn("px-3 py-3", col.className)}>
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            : rows && rows.length > 0
              ? rows.map((row) => {
                  const key = rowKey(row);
                  const selected = selectedIds.includes(key);
                  return (
                    <tr
                      key={key}
                      className={cn(
                        "transition-colors hover:bg-gray-50",
                        selected ? "bg-blue-50/50" : undefined,
                      )}
                    >
                      {selectable ? (
                        <td className="px-3 py-3 align-middle">
                          <input
                            type="checkbox"
                            aria-label="Виділити рядок"
                            className="h-4 w-4 cursor-pointer accent-[var(--color-brand)]"
                            checked={selected}
                            onChange={(e) => onSelectRow?.(key, e.target.checked)}
                          />
                        </td>
                      ) : null}
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          className={cn("px-3 py-3 align-middle", col.className)}
                        >
                          {col.cell(row)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              : null}
        </tbody>
      </table>
      {!isLoading && rows && rows.length === 0 ? (
        <div className="p-6">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : null}
    </div>
  );
}
