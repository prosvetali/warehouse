"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import IconBox from "@/shared/icons/box.svg";
import IconTruck from "@/shared/icons/truck.svg";
import IconLogo from "@/shared/icons/logo.svg";

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const items: NavItem[] = [
  { href: "/products", label: "Products", Icon: IconBox },
  { href: "/suppliers", label: "Suppliers", Icon: IconTruck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] md:flex md:flex-col"
      aria-label="Головна навігація"
    >
      <div className="flex h-16 items-center gap-2 border-b border-[var(--color-border)] px-5 text-lg font-semibold">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-brand)] text-white">
          <IconLogo className="h-5 w-5" />
        </span>
        Warehouse
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-[var(--color-text)] hover:bg-gray-100",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
