import { cva } from "class-variance-authority";
import type { JSX } from "preact";
import { cn } from "./cn.ts";

// The thick bottom edge gives a pressable look; pressing moves the button down onto it.
const bevel =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-b-3 active:translate-y-0.5 active:border-b";

export type ButtonVariant = "primary" | "secondary" | "link" | "icon";
export type ButtonSize = "md" | "sm";

const button = cva(
  "font-mono text-xs font-bold tracking-wide uppercase transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: `${bevel} border-accent-edge bg-accent text-on-accent hover:brightness-105`,
        secondary: `${bevel} border-line-strong bg-surface text-ink hover:border-ink/60`,
        link: "self-start tracking-normal normal-case text-link underline decoration-2 underline-offset-2 hover:decoration-ink",
        icon: "inline-grid shrink-0 place-items-center rounded-md border border-line-strong font-sans text-muted hover:border-ink/60 hover:text-ink",
      } satisfies Record<ButtonVariant, string>,
      size: { md: "", sm: "" } satisfies Record<ButtonSize, string>,
    },
    compoundVariants: [
      {
        variant: ["primary", "secondary"],
        size: "md",
        class: "h-control px-3.5",
      },
      {
        variant: ["primary", "secondary"],
        size: "sm",
        class: "h-control-sm px-2.5",
      },
      { variant: "icon", size: "md", class: "size-control text-lg" },
      { variant: "icon", size: "sm", class: "size-control-sm text-sm" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

/** Every `<button>` attribute, plus: */
export type ButtonProps = JSX.ButtonHTMLAttributes & {
  /** Defaults to `primary`. Icon buttons need an `aria-label`. */
  variant?: ButtonVariant;
  /** Defaults to `md`. Matches the height of fields of the same size. */
  size?: ButtonSize;
  class?: string;
};

/** Defaults to `type="button"`, so it never submits a form by accident. */
export function Button({
  variant,
  size,
  class: extra,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      class={cn(button({ variant, size }), extra)}
      {...props}
    />
  );
}
