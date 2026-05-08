"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/Button";

export default function ProductsErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Products page error:", error);
    }
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-md border border-red-200 bg-red-50 px-6 py-12 text-center"
    >
      <p className="text-base font-medium text-[var(--color-danger)]">
        Помилка при завантаженні товарів
      </p>
      <p className="max-w-md text-sm text-red-700">
        {error.message || "Сталася непередбачена помилка."}
      </p>
      <Button variant="secondary" onClick={reset}>
        Спробувати знову
      </Button>
    </div>
  );
}
