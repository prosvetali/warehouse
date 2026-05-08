"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border bg-white px-3 text-sm transition-colors placeholder:text-[var(--color-muted)] disabled:cursor-not-allowed disabled:bg-gray-50",
        invalid
          ? "border-[var(--color-danger)] focus:border-[var(--color-danger)]"
          : "border-[var(--color-border)] focus:border-[var(--color-brand)]",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});
