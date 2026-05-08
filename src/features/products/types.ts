export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  barcode: string;
  categoryId: number;
  supplierId: number;
  receivedAt: string;
  rating: number;
  active: boolean;
  images: string[];
}

export type SortField = "price" | "receivedAt";
export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  search: string;
  categoryId: number | null;
  dateFrom: string | null;
  dateTo: string | null;
  sort: SortField | null;
  order: SortOrder;
  page: number;
  limit: number;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  sku: string;
  categoryId: number | null;
  supplierId: number | null;
  receivedAt: string;
  rating: number;
  active: boolean;
  images: string[];
}
