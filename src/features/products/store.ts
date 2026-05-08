import { proxy } from "valtio";
import type { ProductFilters, SortField, SortOrder } from "./types";

interface ProductsState extends ProductFilters {
  selectedIds: number[];
}

export const initialProductsState: ProductsState = {
  search: "",
  categoryId: null,
  dateFrom: null,
  dateTo: null,
  sort: null,
  order: "asc",
  page: 1,
  limit: 10,
  selectedIds: [],
};

export const productsStore = proxy<ProductsState>({ ...initialProductsState });

export function setSearch(value: string): void {
  productsStore.search = value;
  productsStore.page = 1;
}

export function setCategoryId(value: number | null): void {
  productsStore.categoryId = value;
  productsStore.page = 1;
}

export function setDateRange(from: string | null, to: string | null): void {
  productsStore.dateFrom = from;
  productsStore.dateTo = to;
  productsStore.page = 1;
}

export function setSort(field: SortField | null, order: SortOrder = "asc"): void {
  productsStore.sort = field;
  productsStore.order = order;
  productsStore.page = 1;
}

export function setPage(page: number): void {
  productsStore.page = Math.max(1, page);
}

export function setLimit(limit: number): void {
  productsStore.limit = limit;
  productsStore.page = 1;
}

export function toggleSelect(id: number, checked: boolean): void {
  if (checked) {
    if (!productsStore.selectedIds.includes(id)) {
      productsStore.selectedIds.push(id);
    }
  } else {
    const idx = productsStore.selectedIds.indexOf(id);
    if (idx !== -1) {
      productsStore.selectedIds.splice(idx, 1);
    }
  }
}

export function setSelected(ids: number[]): void {
  productsStore.selectedIds.splice(0, productsStore.selectedIds.length, ...ids);
}

export function clearSelection(): void {
  productsStore.selectedIds.splice(0, productsStore.selectedIds.length);
}

export function resetFilters(): void {
  Object.assign(productsStore, { ...initialProductsState });
}

export function applyStateFromParams(params: URLSearchParams): void {
  const search = params.get("search") ?? "";
  const categoryId = params.get("categoryId");
  const dateFrom = params.get("from");
  const dateTo = params.get("to");
  const sort = params.get("sort");
  const order = params.get("order");
  const page = params.get("page");
  const limit = params.get("limit");

  productsStore.search = search;
  productsStore.categoryId = categoryId ? Number(categoryId) : null;
  productsStore.dateFrom = dateFrom;
  productsStore.dateTo = dateTo;
  productsStore.sort =
    sort === "price" || sort === "receivedAt" ? (sort as SortField) : null;
  productsStore.order = order === "desc" ? "desc" : "asc";
  productsStore.page = page ? Math.max(1, Number(page)) : 1;
  productsStore.limit = limit ? Math.max(1, Number(limit)) : initialProductsState.limit;
}

export function buildSearchParams(): URLSearchParams {
  const sp = new URLSearchParams();
  if (productsStore.search) {
    sp.set("search", productsStore.search);
  }
  if (productsStore.categoryId != null) {
    sp.set("categoryId", String(productsStore.categoryId));
  }
  if (productsStore.dateFrom) {
    sp.set("from", productsStore.dateFrom);
  }
  if (productsStore.dateTo) {
    sp.set("to", productsStore.dateTo);
  }
  if (productsStore.sort) {
    sp.set("sort", productsStore.sort);
    sp.set("order", productsStore.order);
  }
  if (productsStore.page > 1) {
    sp.set("page", String(productsStore.page));
  }
  if (productsStore.limit !== initialProductsState.limit) {
    sp.set("limit", String(productsStore.limit));
  }
  return sp;
}
