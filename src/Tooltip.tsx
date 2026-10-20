import { cva } from "class-variance-authority";
import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { cn } from "./cn.ts";

/**
 * Which edge of its trigger a {@link Tooltip} lines up with.
 * @group Feedback
 */
export type TooltipAlign = "start" | "center" | "end";

// The padding, not a margin, spaces it from the trigger, so the pointer can cross onto it.
const popover = cva(
  "absolute top-full z-30 w-max max-w-60 pt-2 transition-opacity duration-150 motion-reduce:transition-none",
  {
    variants: {
      align: {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0",
      } satisfies Record<TooltipAlign, string>,
      open: {
        true: "opacity-100",
        false: "pointer-events-none opacity-0",
      },
    },
    defaultVariants: { align: "center" },
  },
);

/**
 * The props for {@link Tooltip}.
 * @group Feedback
 */
export type TooltipProps = {
  content: ComponentChildren;
  /** Which edge of the trigger the tooltip lines up with. Defaults to `center`. */
  align?: TooltipAlign;
  class?: string;
  /** The trigger. */
  children: ComponentChildren;
};

/**
 * Shows `content` while the trigger is hovered or focused from the keyboard; Escape hides it.
 * Screen readers don't hear it, so give the trigger a label that says the same.
 * @group Feedback
 */
export function Tooltip({
  content,
  align,
  class: extra,
  children,
}: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const open = (hovered || focused) && !dismissed;

  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (open && event.key === "Escape") {
        setDismissed(true);
      }
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  return (
    <span
      class={cn("relative inline-flex", extra)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setDismissed(false);
      }}
      onFocusIn={(event) => {
        if (
          event.target instanceof Element &&
          event.target.matches(":focus-visible")
        ) {
          setFocused(true);
        }
      }}
      onFocusOut={() => {
        setFocused(false);
        setDismissed(false);
      }}
    >
      {children}
      <span aria-hidden="true" class={popover({ align, open })}>
        <span class="block rounded-md border border-line-strong bg-surface px-2.5 py-1.5 font-sans text-xs leading-snug text-ink shadow-window">
          {content}
        </span>
      </span>
    </span>
  );
}
