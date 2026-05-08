"use client";

import Barcode from "react-barcode";

interface BarcodePreviewProps {
  value: string;
}

export function BarcodePreview({ value }: BarcodePreviewProps) {
  if (!value) {
    return (
      <div className="flex h-[60px] items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-gray-50 px-3 text-xs text-[var(--color-muted)]">
        Введіть SKU для попереднього перегляду
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center rounded-md border border-[var(--color-border)] bg-white px-3 py-2">
      <Barcode value={value} height={50} width={1.5} fontSize={12} margin={0} />
    </div>
  );
}
