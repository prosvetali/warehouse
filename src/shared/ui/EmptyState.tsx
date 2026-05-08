import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[var(--color-border)] bg-white px-6 py-12 text-center">
      <p className="text-base font-medium">{title}</p>
      {description ? (
        <p className="max-w-md text-sm text-[var(--color-muted)]">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
