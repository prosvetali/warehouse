"use client";

import { useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import type { GroupBase } from "react-select";
import { fetchCategories, fetchCategoryById } from "../api";
import type { CategoryOption } from "../types";

interface AdditionalState {
  page: number;
}

interface Props {
  value: number | null;
  onChange: (id: number | null) => void;
  inputId?: string;
  isClearable?: boolean;
  placeholder?: string;
  isInvalid?: boolean;
}

const PAGE_SIZE = 20;

export function CategoryAsyncSelect({
  value,
  onChange,
  inputId,
  isClearable = true,
  placeholder = "Оберіть категорію",
  isInvalid,
}: Props) {
  const [selected, setSelected] = useState<CategoryOption | null>(null);

  // Підвантажити вибрану категорію за id (синхронізація форми/URL → label)
  useEffect(() => {
    let active = true;
    if (value == null) {
      setSelected(null);
      return;
    }
    if (selected?.value === value) {
      return;
    }
    fetchCategoryById(value)
      .then((cat) => {
        if (active) {
          setSelected({ value: cat.id, label: cat.name });
        }
      })
      .catch(() => {
        if (active) {
          setSelected(null);
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <AsyncPaginate<CategoryOption, GroupBase<CategoryOption>, AdditionalState>
      inputId={inputId}
      instanceId={inputId ?? "category-select"}
      value={selected}
      isClearable={isClearable}
      placeholder={placeholder}
      additional={{ page: 1 }}
      debounceTimeout={300}
      loadOptions={async (search, _loaded, additional) => {
        const page = additional?.page ?? 1;
        const result = await fetchCategories({ page, limit: PAGE_SIZE, search });
        const options: CategoryOption[] = result.data.map((c) => ({
          value: c.id,
          label: c.name,
        }));
        return {
          options,
          hasMore: page * PAGE_SIZE < result.total,
          additional: { page: page + 1 },
        };
      }}
      onChange={(option) => {
        const next = option as CategoryOption | null;
        setSelected(next);
        onChange(next?.value ?? null);
      }}
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
