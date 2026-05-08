"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 cursor-pointer rounded border-[var(--color-border)] text-[var(--color-brand)] accent-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]",
        className,
      )}
      {...rest}
    />
  );
});
