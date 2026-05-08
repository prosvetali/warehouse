export interface Paginated<T> {
  data: T[];
  total: number;
}

export interface PageParams {
  page: number;
  limit: number;
}
