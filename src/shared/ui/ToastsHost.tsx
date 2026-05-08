"use client";

import { useSnapshot } from "valtio";
import { dismissToast, toastsStore, type ToastKind } from "@/shared/lib/toastsStore";
import { cn } from "@/shared/lib/cn";
import IconX from "@/shared/icons/x.svg";

const styleByKind: Record<ToastKind, string> = {
  info: "bg-white border-[var(--color-border)]",
  success: "bg-green-50 border-green-200 text-green-900",
  error: "bg-red-50 border-red-200 text-red-900",
};

export function ToastsHost() {
  const snap = useSnapshot(toastsStore);
  if (snap.items.length === 0) {
    return null;
  }

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Сповіщення"
      className="pointer-events-none fixed top-4 right-4 z-50 flex w-80 flex-col gap-2"
    >
      {snap.items.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-start justify-between gap-3 rounded-md border px-4 py-3 shadow-md",
            styleByKind[toast.kind],
          )}
        >
          <div className="flex min-w-0 flex-col">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.description ? (
              <p className="text-xs opacity-80">{toast.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Закрити сповіщення"
            onClick={() => dismissToast(toast.id)}
            className="text-current/70 hover:text-current"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
