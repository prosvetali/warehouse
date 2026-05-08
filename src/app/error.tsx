"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("App error boundary:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-semibold">Щось зламалося</h2>
      <p className="max-w-md text-sm text-[var(--color-muted)]">
        Сталася непередбачена помилка. Спробуйте перезавантажити сторінку або повернутися пізніше.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-[var(--color-muted)]">digest: {error.digest}</p>
      ) : null}
      <Button onClick={reset}>Спробувати ще раз</Button>
    </div>
  );
}
