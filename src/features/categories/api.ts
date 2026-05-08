import { api } from "@/shared/lib/api";
import type { Paginated } from "@/shared/types";
import type { Category } from "./types";

interface FetchCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchCategories({
  page = 1,
  limit = 20,
  search,
}: FetchCategoriesParams = {}): Promise<Paginated<Category>> {
  const params: Record<string, string | number> = {
    _page: page,
    _limit: limit,
  };
  // json-server: name_like = regex match (часткове співпадіння)
  if (search) {
    params.name_like = search;
  }
  const response = await api.get<Category[]>("/categories", { params });
  const total = Number(response.headers["x-total-count"] ?? response.data.length);
  return { data: response.data, total };
}

export async function fetchCategoryById(id: number): Promise<Category> {
  const response = await api.get<Category>(`/categories/${id}`);
  return response.data;
}
