import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  hint?: ReactNode;
}

export function Label({ className, required, hint, children, ...rest }: LabelProps) {
  return (
    <label
      className={cn("flex items-center gap-1 text-sm font-medium text-[var(--color-text)]", className)}
      {...rest}
    >
      {children}
      {required ? (
        <span aria-hidden className="text-[var(--color-danger)]">
          *
        </span>
      ) : null}
      {hint}
    </label>
  );
}
