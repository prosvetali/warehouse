"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/shared/ui/Skeleton";
import { ErrorState } from "@/shared/ui/ErrorState";
import { ProductForm } from "@/features/products/components/ProductForm";
import { useProductQuery } from "@/features/products/hooks/useProductsQuery";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? Number(params.id) : null;
  const { data, isLoading, isError, refetch } = useProductQuery(id);

  return (
    <div className="flex flex-col gap-4">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/products" className="hover:underline">
          Товари
        </Link>
        <span className="mx-1">/</span>
        {data ? data.name : "…"}
      </nav>
      <h2 className="text-xl font-semibold">Редагування товару</h2>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      ) : isError || !data ? (
        <ErrorState
          title="Не вдалося завантажити товар"
          description="Можливо, його було видалено або сталася помилка мережі."
          onRetry={() => refetch()}
        />
      ) : (
        <ProductForm mode="edit" initial={data} />
      )}
    </div>
  );
}
