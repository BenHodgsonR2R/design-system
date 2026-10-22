import { cva } from "class-variance-authority";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "./cn.ts";

const card = cva(
  "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 font-semibold text-ink no-underline shadow-window transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0",
  {
    variants: {
      tone: {
        neutral: "border-line bg-surface hover:border-line-strong",
        accent: "border-accent bg-accent-soft",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

/**
 * The props for {@link LinkCard}: every `<a>` attribute, plus these.
 * @group Navigation
 */
export type LinkCardProps = JSX.AnchorHTMLAttributes & {
  /** `accent` for the one to pick first. Defaults to `neutral`. */
  tone?: "neutral" | "accent";
  /** Shown at the end in the accent colour. Defaults to →. */
  arrow?: ComponentChildren;
  class?: string;
  children: ComponentChildren;
};

/**
 * A link as a card that lifts on hover, with an arrow, for a short list of next steps such as "Email me" or "Download
 * my CV".
 * @group Navigation
 */
export function LinkCard({
  tone,
  arrow = "→",
  class: extra,
  children,
  ...props
}: LinkCardProps) {
  return (
    <a class={cn(card({ tone }), extra)} {...props}>
      <span>{children}</span>
      <span aria-hidden="true" class="text-accent">
        {arrow}
      </span>
    </a>
  );
}
