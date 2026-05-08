"use client";

import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Щось пішло не так",
  description = "Спробуйте оновити сторінку або повторити запит.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-md border border-[var(--color-danger)]/30 bg-red-50 px-6 py-12 text-center"
    >
      <p className="text-base font-medium text-[var(--color-danger)]">{title}</p>
      <p className="max-w-md text-sm text-red-700">{description}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Спробувати ще раз
        </Button>
      ) : null}
    </div>
  );
}
