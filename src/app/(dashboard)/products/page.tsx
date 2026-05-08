import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/shared/ui/Button";
import IconPlus from "@/shared/icons/plus.svg";
import { ProductsFilters } from "@/features/products/components/ProductsFilters";
import { ProductsTableContainer } from "@/features/products/components/ProductsTable";
import { ProductsPagination } from "@/features/products/components/ProductsPagination";
import { BulkActionsBar } from "@/features/products/components/BulkActionsBar";
import { ExportCsvButton } from "@/features/products/components/ExportCsvButton";
import { UrlBootstrap } from "@/features/products/components/UrlBootstrap";

export const metadata = { title: "Товари · Warehouse" };

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={null}>
        <UrlBootstrap />
      </Suspense>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Товари</h2>
        <div className="flex flex-wrap gap-2">
          <ExportCsvButton />
          <Link href="/products/new">
            <Button>
              <IconPlus className="h-4 w-4" />
              Новий товар
            </Button>
          </Link>
        </div>
      </div>
      <ProductsFilters />
      <BulkActionsBar />
      <ProductsTableContainer />
      <ProductsPagination />
    </div>
  );
}
