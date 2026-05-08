"use client";

import { cn } from "@/shared/lib/cn";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (next: number) => void;
}

function pageNumbers(current: number, totalPages: number): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items = new Set<number>([1, totalPages, current, current - 1, current + 1]);
  const sorted = Array.from(items)
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  const result: Array<number | "..."> = [];
  for (let i = 0; i < sorted.length; i += 1) {
    result.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      result.push("...");
    }
  }
  return result;
}

export function Pagination({ page, total, limit, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) {
    return null;
  }

  const items = pageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Пагінація"
      className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
    >
      <p className="text-[var(--color-muted)]">
        Сторінка <strong>{page}</strong> з <strong>{totalPages}</strong> · {total} записів
      </p>
      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            className="h-8 rounded-md border border-[var(--color-border)] bg-white px-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ‹
          </button>
        </li>
        {items.map((it, idx) =>
          it === "..." ? (
            <li key={`gap-${idx}`} className="px-2 text-[var(--color-muted)]">
              …
            </li>
          ) : (
            <li key={it}>
              <button
                type="button"
                onClick={() => onChange(it)}
                aria-current={it === page ? "page" : undefined}
                className={cn(
                  "h-8 min-w-8 rounded-md border px-2",
                  it === page
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                    : "border-[var(--color-border)] bg-white hover:bg-gray-50",
                )}
              >
                {it}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
            className="h-8 rounded-md border border-[var(--color-border)] bg-white px-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}
