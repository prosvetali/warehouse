import { api } from "@/shared/lib/api";
import type { Supplier } from "./types";

export async function fetchSuppliers(): Promise<Supplier[]> {
  const response = await api.get<Supplier[]>("/suppliers");
  return response.data;
}

export async function fetchSupplierById(id: number): Promise<Supplier> {
  const response = await api.get<Supplier>(`/suppliers/${id}`);
  return response.data;
}
