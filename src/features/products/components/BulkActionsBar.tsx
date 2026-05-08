"use client";

import { useState } from "react";
import { useSnapshot } from "valtio";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { clearSelection, productsStore } from "../store";
import { useBulkDeleteProducts, useBulkSetActive } from "../hooks/useProductMutations";

type Action = "delete" | "deactivate" | "activate";

export function BulkActionsBar() {
  const snap = useSnapshot(productsStore);
  const [action, setAction] = useState<Action | null>(null);
  const bulkDelete = useBulkDeleteProducts();
  const bulkActive = useBulkSetActive();

  const count = snap.selectedIds.length;
  if (count === 0) {
    return null;
  }

  const ids = [...snap.selectedIds];

  const labels: Record<Action, { title: string; confirmLabel: string; destructive?: boolean }> = {
    delete: { title: `Видалити ${count} товарів?`, confirmLabel: "Видалити", destructive: true },
    deactivate: { title: `Деактивувати ${count} товарів?`, confirmLabel: "Деактивувати" },
    activate: { title: `Активувати ${count} товарів?`, confirmLabel: "Активувати" },
  };

  const onConfirm = () => {
    if (!action) {
      return;
    }
    if (action === "delete") {
      bulkDelete.mutate(ids, {
        onSuccess: () => {
          clearSelection();
          setAction(null);
        },
        onError: () => setAction(null),
      });
    } else {
      bulkActive.mutate(
        { ids, active: action === "activate" },
        {
          onSuccess: () => {
            clearSelection();
            setAction(null);
          },
          onError: () => setAction(null),
        },
      );
    }
  };

  const meta = action ? labels[action] : null;
  const loading = bulkDelete.isPending || bulkActive.isPending;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-brand)]/30 bg-blue-50 px-4 py-3 text-sm">
      <span className="font-medium">Виділено: {count}</span>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setAction("activate")}>
          Активувати
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setAction("deactivate")}>
          Деактивувати
        </Button>
        <Button size="sm" variant="danger" onClick={() => setAction("delete")}>
          Видалити
        </Button>
        <Button size="sm" variant="ghost" onClick={() => clearSelection()}>
          Скасувати виділення
        </Button>
      </div>
      <ConfirmDialog
        open={action !== null}
        title={meta?.title ?? ""}
        description="Дія буде застосована до всіх вибраних товарів."
        confirmLabel={meta?.confirmLabel}
        destructive={meta?.destructive}
        loading={loading}
        onCancel={() => setAction(null)}
        onConfirm={onConfirm}
      />
    </div>
  );
}
