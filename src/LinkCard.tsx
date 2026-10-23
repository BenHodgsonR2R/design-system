import { cva } from "class-variance-authority";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "./cn.ts";

/**
 * The classes for a card: a rounded surface with a hairline border and a ledge of shadow. `interactive` is for a card
 * that's a link: it lifts on hover and shows the focus ring. `accent` marks the one to pick first.
 * @group Layout
 */
export const cardClass = cva("rounded-xl border shadow-window", {
  variants: {
    tone: {
      neutral: "border-line bg-surface",
      accent: "border-accent bg-accent-soft",
    },
    interactive: {
      true: "no-underline transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0",
      false: "",
    },
  },
  compoundVariants: [
    { tone: "neutral", interactive: true, class: "hover:border-line-strong" },
  ],
  defaultVariants: { tone: "neutral", interactive: false },
});

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
    <a
      class={cn(
        cardClass({ tone, interactive: true }),
        "flex items-center justify-between gap-3 px-4 py-3 font-semibold text-ink",
        extra,
      )}
      {...props}
    >
      <span>{children}</span>
      <span aria-hidden="true" class="text-accent">
        {arrow}
      </span>
    </a>
  );
}
