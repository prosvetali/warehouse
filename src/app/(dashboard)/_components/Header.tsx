"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/products": "Каталог товарів",
  "/products/new": "Новий товар",
  "/suppliers": "Постачальники",
};

function resolveTitle(pathname: string): string {
  if (pathname.startsWith("/products/") && pathname !== "/products/new") {
    return "Редагування товару";
  }
  return titles[pathname] ?? "Warehouse";
}

export function Header() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);
  return (
    <header className="flex h-16 items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
