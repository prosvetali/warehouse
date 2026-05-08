"use client";

import { useMemo } from "react";
import Select from "react-select";
import { useSuppliersQuery } from "../hooks/useSuppliersQuery";
import type { SupplierOption } from "../types";

interface Props {
  value: number | null;
  onChange: (id: number | null) => void;
  inputId?: string;
  isClearable?: boolean;
  placeholder?: string;
  isInvalid?: boolean;
}

export function SupplierSelect({
  value,
  onChange,
  inputId,
  isClearable = true,
  placeholder = "Оберіть постачальника",
  isInvalid,
}: Props) {
  const { data, isLoading } = useSuppliersQuery();

  const options = useMemo<SupplierOption[]>(
    () => data?.map((s) => ({ value: s.id, label: s.name })) ?? [],
    [data],
  );

  const selected = useMemo<SupplierOption | null>(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  );

  return (
    <Select<SupplierOption>
      inputId={inputId}
      instanceId={inputId ?? "supplier-select"}
      isLoading={isLoading}
      options={options}
      value={selected}
      isClearable={isClearable}
      placeholder={placeholder}
      onChange={(option) => onChange(option ? option.value : null)}
      classNamePrefix="rs"
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: 40,
          borderRadius: 6,
          borderColor: isInvalid
            ? "var(--color-danger)"
            : state.isFocused
              ? "var(--color-brand)"
              : "var(--color-border)",
          boxShadow: "none",
          ":hover": { borderColor: state.isFocused ? "var(--color-brand)" : "#d1d5db" },
        }),
      }}
    />
  );
}
