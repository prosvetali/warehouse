import { api } from "@/shared/lib/api";
import type { Paginated } from "@/shared/types";
import type { Product, ProductFilters } from "./types";

export interface ListProductsParams extends Partial<ProductFilters> {
  page?: number;
  limit?: number;
  ids?: number[];
}

export async function listProducts(filters: ListProductsParams): Promise<Paginated<Product>> {
  const params: Record<string, string | number> = {};
  // Пошук за назвою (json-server: name_like — partial regex match)
  if (filters.search) {
    params.name_like = filters.search;
  }
  if (filters.categoryId != null) {
    params.categoryId = filters.categoryId;
  }
  if (filters.dateFrom) {
    params.receivedAt_gte = filters.dateFrom;
  }
  if (filters.dateTo) {
    params.receivedAt_lte = filters.dateTo;
  }
  if (filters.sort) {
    params._sort = filters.sort;
    params._order = filters.order ?? "asc";
  }
  if (filters.page) {
    params._page = filters.page;
  }
  if (filters.limit) {
    params._limit = filters.limit;
  }

  const url = filters.ids && filters.ids.length > 0
    ? `/products?${filters.ids.map((id) => `id=${id}`).join("&")}`
    : "/products";

  const response = await api.get<Product[]>(url, {
    params: filters.ids && filters.ids.length > 0 ? undefined : params,
  });
  const total = Number(response.headers["x-total-count"] ?? response.data.length);
  return { data: response.data, total };
}

export async function getProduct(id: number): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export type ProductPayload = Omit<Product, "id" | "barcode"> & { barcode?: string };

function generateBarcode(): string {
  const stamp = Date.now().toString().slice(-12);
  return stamp.padStart(12, "0");
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const body = { ...payload, barcode: payload.barcode || generateBarcode() };
  const response = await api.post<Product>("/products", body);
  return response.data;
}

export async function updateProduct(id: number, payload: ProductPayload): Promise<Product> {
  const body = { ...payload, barcode: payload.barcode || generateBarcode() };
  const response = await api.put<Product>(`/products/${id}`, { id, ...body });
  return response.data;
}

export async function patchProduct(
  id: number,
  partial: Partial<Product>,
): Promise<Product> {
  const response = await api.patch<Product>(`/products/${id}`, partial);
  return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
