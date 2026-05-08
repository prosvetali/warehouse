"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import type { Instance } from "flatpickr/dist/types/instance";
import { cn } from "@/shared/lib/cn";

interface DatePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  inputId?: string;
  invalid?: boolean;
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Оберіть дату",
  inputId,
  invalid,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<Instance | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    const fp = flatpickr(inputRef.current, {
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        if (selectedDates.length === 1) {
          onChangeRef.current(toIso(selectedDates[0]));
        } else {
          onChangeRef.current(null);
        }
      },
    }) as Instance;
    fpRef.current = fp;
    return () => {
      fp.destroy();
      fpRef.current = null;
    };
  }, []);

  useEffect(() => {
    const fp = fpRef.current;
    if (!fp) {
      return;
    }
    if (value) {
      fp.setDate(value, false);
    } else {
      fp.clear(false);
    }
  }, [value]);

  return (
    <input
      id={inputId}
      ref={inputRef}
      type="text"
      readOnly
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full cursor-pointer rounded-md border bg-white px-3 text-sm placeholder:text-[var(--color-muted)]",
        invalid
          ? "border-[var(--color-danger)] focus:border-[var(--color-danger)]"
          : "border-[var(--color-border)] focus:border-[var(--color-brand)]",
      )}
    />
  );
}
