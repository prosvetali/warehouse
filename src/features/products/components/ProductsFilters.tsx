"use client";

import { useEffect, useId, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useSnapshot } from "valtio";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Label } from "@/shared/ui/Label";
import { DateRangePicker } from "@/shared/ui/DateRangePicker";
import { CategoryAsyncSelect } from "@/features/categories/components/CategoryAsyncSelect";
import IconSearch from "@/shared/icons/search.svg";
import {
  productsStore,
  resetFilters,
  setCategoryId,
  setDateRange,
  setSearch,
} from "../store";

export function ProductsFilters() {
  const snap = useSnapshot(productsStore);
  const searchId = useId();
  const categoryId = useId();
  const dateId = useId();
  const [searchInput, setSearchInput] = useState(snap.search);

  // Sync local input з store на маунті/ззовні (наприклад reset)
  useEffect(() => {
    setSearchInput(snap.search);
  }, [snap.search]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 400);

  return (
    <div className="grid gap-3 rounded-md border border-[var(--color-border)] bg-white p-4 md:grid-cols-[2fr_1.5fr_1.5fr_auto]">
      <div className="flex flex-col gap-1">
        <Label htmlFor={searchId}>Пошук</Label>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <Input
            id={searchId}
            value={searchInput}
            placeholder="Назва товару"
            onChange={(e) => {
              const val = e.target.value;
              setSearchInput(val);
              debouncedSearch(val);
            }}
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={categoryId}>Категорія</Label>
        <CategoryAsyncSelect
          inputId={categoryId}
          value={snap.categoryId}
          onChange={(id) => setCategoryId(id)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={dateId}>Дата надходження</Label>
        <DateRangePicker
          inputId={dateId}
          from={snap.dateFrom}
          to={snap.dateTo}
          onChange={(from, to) => setDateRange(from, to)}
        />
      </div>
      <div className="flex items-end">
        <Button
          variant="secondary"
          onClick={() => {
            setSearchInput("");
            resetFilters();
          }}
        >
          Скинути
        </Button>
      </div>
    </div>
  );
}
