"use client";

import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { useSuppliersQuery } from "../hooks/useSuppliersQuery";
import type { Supplier } from "../types";

const columns: DataTableColumn<Supplier>[] = [
  {
    id: "id",
    header: "ID",
    cell: (row) => <span className="text-[var(--color-muted)]">#{row.id}</span>,
    className: "w-16",
  },
  {
    id: "name",
    header: "Назва",
    cell: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "email",
    header: "Email",
    cell: (row) => (
      <a className="text-[var(--color-brand)] hover:underline" href={`mailto:${row.email}`}>
        {row.email}
      </a>
    ),
  },
  {
    id: "phone",
    header: "Телефон",
    cell: (row) => <span className="tabular-nums">{row.phone}</span>,
  },
];

export function SuppliersTable() {
  const { data, isLoading, isError, refetch } = useSuppliersQuery();

  return (
    <DataTable<Supplier>
      columns={columns}
      rows={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      rowKey={(row) => row.id}
      emptyTitle="Постачальників не знайдено"
    />
  );
}
