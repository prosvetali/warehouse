"use client";

import { useState } from "react";
import { useSnapshot } from "valtio";
import { Button } from "@/shared/ui/Button";
import { downloadCsv, toCsv } from "@/shared/lib/csv";
import { pushToast } from "@/shared/lib/toastsStore";
import IconDownload from "@/shared/icons/download.svg";
import { listProducts } from "../api";
import { productsStore } from "../store";

export function ExportCsvButton() {
  const snap = useSnapshot(productsStore);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const result = await listProducts({
        search: snap.search,
        categoryId: snap.categoryId,
        dateFrom: snap.dateFrom,
        dateTo: snap.dateTo,
        sort: snap.sort,
        order: snap.order,
        page: 1,
        limit: 1000,
      });
      const csv = toCsv(result.data, [
        { header: "id", accessor: (r) => r.id },
        { header: "name", accessor: (r) => r.name },
        { header: "sku", accessor: (r) => r.sku },
        { header: "barcode", accessor: (r) => r.barcode },
        { header: "categoryId", accessor: (r) => r.categoryId },
        { header: "supplierId", accessor: (r) => r.supplierId },
        { header: "price", accessor: (r) => r.price },
        { header: "rating", accessor: (r) => r.rating },
        { header: "receivedAt", accessor: (r) => r.receivedAt },
        { header: "active", accessor: (r) => (r.active ? "yes" : "no") },
      ]);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadCsv(`products-${stamp}.csv`, csv);
      pushToast({ kind: "success", title: `Експортовано ${result.data.length} товарів` });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Невідома помилка";
      pushToast({ kind: "error", title: "Експорт не вдався", description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="secondary" loading={loading} onClick={handleExport}>
      <IconDownload className="h-4 w-4" />
      Експорт CSV
    </Button>
  );
}
