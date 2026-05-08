import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  patchProduct,
  updateProduct,
  type ProductPayload,
} from "../api";
import type { Paginated } from "@/shared/types";
import type { Product } from "../types";
import { pushToast } from "@/shared/lib/toastsStore";
import { buildProductKey, PRODUCTS_QUERY_KEY } from "./useProductsQuery";

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation<Product, Error, ProductPayload>({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      pushToast({ kind: "success", title: "Товар створено" });
    },
    onError: (err) => {
      pushToast({ kind: "error", title: "Не вдалося створити товар", description: err.message });
    },
  });
}

export function useUpdateProduct(id: number) {
  const qc = useQueryClient();
  return useMutation<Product, Error, ProductPayload>({
    mutationFn: (payload) => updateProduct(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      qc.invalidateQueries({ queryKey: buildProductKey(id) });
      pushToast({ kind: "success", title: "Зміни збережено" });
    },
    onError: (err) => {
      pushToast({ kind: "error", title: "Не вдалося зберегти", description: err.message });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      pushToast({ kind: "success", title: "Товар видалено" });
    },
    onError: (err) => {
      pushToast({ kind: "error", title: "Не вдалося видалити", description: err.message });
    },
  });
}

interface ToggleActiveVars {
  id: number;
  active: boolean;
}

interface ToggleActiveContext {
  prevSnapshots: Array<[unknown, Paginated<Product> | undefined]>;
}

export function useToggleActive() {
  const qc = useQueryClient();
  return useMutation<Product, Error, ToggleActiveVars, ToggleActiveContext>({
    mutationFn: ({ id, active }) => patchProduct(id, { active }),
    onMutate: async ({ id, active }) => {
      await qc.cancelQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      const queries = qc.getQueriesData<Paginated<Product>>({ queryKey: [PRODUCTS_QUERY_KEY] });
      const prevSnapshots = queries.map(([key, data]) => [key, data] as [unknown, Paginated<Product> | undefined]);

      for (const [key, data] of queries) {
        if (!data) {
          continue;
        }
        qc.setQueryData<Paginated<Product>>(key as readonly unknown[], {
          ...data,
          data: data.data.map((p) => (p.id === id ? { ...p, active } : p)),
        });
      }

      const singleKey = buildProductKey(id);
      const prevSingle = qc.getQueryData<Product>(singleKey);
      if (prevSingle) {
        qc.setQueryData<Product>(singleKey, { ...prevSingle, active });
      }

      return { prevSnapshots };
    },
    onError: (err, _vars, ctx) => {
      if (ctx) {
        for (const [key, data] of ctx.prevSnapshots) {
          qc.setQueryData(key as readonly unknown[], data);
        }
      }
      pushToast({ kind: "error", title: "Помилка зміни статусу", description: err.message });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}

export function useBulkDeleteProducts() {
  const qc = useQueryClient();
  return useMutation<void, Error, number[]>({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => deleteProduct(id)));
    },
    onSuccess: (_data, ids) => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      pushToast({
        kind: "success",
        title: `Видалено ${ids.length} ${ids.length === 1 ? "товар" : "товарів"}`,
      });
    },
    onError: (err) => {
      pushToast({ kind: "error", title: "Помилка видалення", description: err.message });
    },
  });
}

export function useBulkSetActive() {
  const qc = useQueryClient();
  return useMutation<void, Error, { ids: number[]; active: boolean }>({
    mutationFn: async ({ ids, active }) => {
      await Promise.all(ids.map((id) => patchProduct(id, { active })));
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      pushToast({
        kind: "success",
        title: `Оновлено ${vars.ids.length} ${vars.ids.length === 1 ? "товар" : "товарів"}`,
      });
    },
    onError: (err) => {
      pushToast({ kind: "error", title: "Помилка оновлення", description: err.message });
    },
  });
}
