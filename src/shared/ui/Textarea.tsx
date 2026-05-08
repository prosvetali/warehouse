"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full resize-y rounded-md border bg-white px-3 py-2 text-sm transition-colors placeholder:text-[var(--color-muted)] disabled:cursor-not-allowed disabled:bg-gray-50",
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
