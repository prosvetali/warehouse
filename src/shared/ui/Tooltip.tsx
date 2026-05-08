"use client";

import { createPopper, type Instance, type Placement } from "@popperjs/core";
import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/cn";

interface TooltipProps {
  content: ReactNode;
  placement?: Placement;
  children: ReactElement<{
    ref?: Ref<HTMLElement>;
    "aria-describedby"?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  }>;
}

export function Tooltip({ content, placement = "top", children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const referenceRef = useRef<HTMLElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<Instance | null>(null);
  const id = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !referenceRef.current || !popperRef.current) {
      return;
    }
    instanceRef.current = createPopper(referenceRef.current, popperRef.current, {
      placement,
      modifiers: [
        { name: "offset", options: { offset: [0, 8] } },
        { name: "preventOverflow", options: { padding: 8 } },
      ],
    });
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [open, placement]);

  const child = children;

  const triggerProps = {
    ref: (node: HTMLElement | null) => {
      referenceRef.current = node;
      const originalRef = (child as unknown as { ref?: Ref<HTMLElement> }).ref;
      if (typeof originalRef === "function") {
        originalRef(node);
      } else if (originalRef && "current" in originalRef) {
        (originalRef as { current: HTMLElement | null }).current = node;
      }
    },
    "aria-describedby": open ? id : undefined,
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  };

  return (
    <>
      {cloneElement(child, triggerProps)}
      {mounted && open
        ? createPortal(
            <div
              ref={popperRef}
              role="tooltip"
              id={id}
              className={cn(
                "z-50 max-w-xs rounded-md bg-gray-900 px-3 py-2 text-xs leading-snug text-white shadow-lg",
              )}
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
