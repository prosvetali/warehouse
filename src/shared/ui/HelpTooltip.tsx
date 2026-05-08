"use client";

import type { ReactNode } from "react";
import IconHelp from "@/shared/icons/help.svg";
import { Tooltip } from "./Tooltip";

interface HelpTooltipProps {
  content: ReactNode;
  label?: string;
}

export function HelpTooltip({ content, label = "Підказка" }: HelpTooltipProps) {
  return (
    <Tooltip content={content}>
      <button
        type="button"
        aria-label={label}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-text)]"
      >
        <IconHelp className="h-4 w-4" aria-hidden />
      </button>
    </Tooltip>
  );
}
