import { cva } from "class-variance-authority";
import type { ComponentChildren } from "preact";
import { cn } from "./cn.ts";

/**
 * A {@link Badge}'s colour: a status, or one of six categorical colours (`data-1` to `data-6`) that {@link dataTone} picks from.
 * @group Feedback
 */
export type BadgeTone =
  | "neutral"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | (typeof dataTones)[number];

const badge = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-xs font-semibold text-ink",
  {
    variants: {
      tone: {
        neutral: "border-line-strong bg-surface-sunken",
        accent: "border-accent bg-accent-soft",
        info: "border-info bg-info-soft",
        success: "border-success bg-success-soft",
        warning: "border-warning bg-warning-soft",
        danger: "border-danger bg-danger-soft",
        "data-1": "border-data-1 bg-data-1-soft",
        "data-2": "border-data-2 bg-data-2-soft",
        "data-3": "border-data-3 bg-data-3-soft",
        "data-4": "border-data-4 bg-data-4-soft",
        "data-5": "border-data-5 bg-data-5-soft",
        "data-6": "border-data-6 bg-data-6-soft",
      } satisfies Record<BadgeTone, string>,
    },
    defaultVariants: { tone: "neutral" },
  },
);

/**
 * The props for {@link Badge}.
 * @group Feedback
 */
export type BadgeProps = {
  /** Defaults to `neutral`. Use `dataTone(index)` for categories. */
  tone?: BadgeTone;
  class?: string;
  children: ComponentChildren;
};

/**
 * A small label. The categorical tones tell groups apart; pair them with text, never colour alone.
 * @group Feedback
 */
export function Badge({ tone, class: extra, children }: BadgeProps) {
  return <span class={cn(badge({ tone }), extra)}>{children}</span>;
}

const dataTones = [
  "data-1",
  "data-2",
  "data-3",
  "data-4",
  "data-5",
  "data-6",
] as const;

/**
 * The categorical {@link BadgeTone} for the nth item, cycling through the six colours.
 * @group Feedback
 */
export function dataTone(index: number): (typeof dataTones)[number] {
  return dataTones[index % dataTones.length] ?? "data-1";
}
