"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import type { Instance } from "flatpickr/dist/types/instance";
import { cn } from "@/shared/lib/cn";

interface DateRangePickerProps {
  from: string | null;
  to: string | null;
  onChange: (from: string | null, to: string | null) => void;
  placeholder?: string;
  inputId?: string;
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DateRangePicker({
  from,
  to,
  onChange,
  placeholder = "Діапазон дат",
  inputId,
}: DateRangePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<Instance | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    const fp = flatpickr(inputRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          onChangeRef.current(toIso(selectedDates[0]), toIso(selectedDates[1]));
        } else if (selectedDates.length === 0) {
          onChangeRef.current(null, null);
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
    if (from && to) {
      fp.setDate([from, to], false);
    } else if (!from && !to) {
      fp.clear(false);
    }
  }, [from, to]);

  return (
    <div className="relative">
      <input
        id={inputId}
        ref={inputRef}
        type="text"
        readOnly
        placeholder={placeholder}
        className={cn(
          "h-10 w-full cursor-pointer rounded-md border border-[var(--color-border)] bg-white px-3 text-sm placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand)]",
        )}
      />
      {(from || to) && (
        <button
          type="button"
          aria-label="Очистити дату"
          onClick={() => {
            fpRef.current?.clear();
            onChange(null, null);
          }}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          ×
        </button>
      )}
    </div>
  );
}
