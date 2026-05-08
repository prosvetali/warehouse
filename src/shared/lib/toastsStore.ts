import { proxy } from "valtio";

export type ToastKind = "info" | "success" | "error";

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface ToastsState {
  items: Toast[];
}

export const toastsStore = proxy<ToastsState>({ items: [] });

const DEFAULT_TIMEOUT = 4000;

export function pushToast(toast: Omit<Toast, "id"> & { id?: string; timeout?: number }): string {
  const id = toast.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const item: Toast = {
    id,
    kind: toast.kind,
    title: toast.title,
    description: toast.description,
  };
  toastsStore.items.push(item);
  const timeout = toast.timeout ?? DEFAULT_TIMEOUT;
  if (timeout > 0 && typeof window !== "undefined") {
    window.setTimeout(() => dismissToast(id), timeout);
  }
  return id;
}

export function dismissToast(id: string): void {
  const idx = toastsStore.items.findIndex((t) => t.id === id);
  if (idx !== -1) {
    toastsStore.items.splice(idx, 1);
  }
}

export function clearToasts(): void {
  toastsStore.items.splice(0, toastsStore.items.length);
}
