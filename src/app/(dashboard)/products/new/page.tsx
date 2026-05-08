import Link from "next/link";
import { ProductForm } from "@/features/products/components/ProductForm";

export const metadata = { title: "Новий товар · Warehouse" };

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/products" className="hover:underline">
          Товари
        </Link>
        <span className="mx-1">/</span>
        Новий
      </nav>
      <h2 className="text-xl font-semibold">Новий товар</h2>
      <ProductForm mode="create" />
    </div>
  );
}
