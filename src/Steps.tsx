import type { ComponentChildren } from "preact";
import { cn } from "./cn.ts";

/**
 * One of a {@link Steps} list's steps.
 * @group Text
 */
export type Step = {
  /** Bold, at the start of the step, such as "Open the link". */
  title: ComponentChildren;
  /** The rest of the step, following on from the title. */
  body?: ComponentChildren;
};

/**
 * The props for {@link Steps}.
 * @group Text
 */
export type StepsProps = {
  items: Step[];
  class?: string;
};

/**
 * A numbered list of instructions, each number in a ring.
 * @group Text
 */
export function Steps({ items, class: extra }: StepsProps) {
  return (
    <ol class={cn("flex flex-col gap-4 text-sm leading-relaxed", extra)}>
      {items.map(({ title, body }, index) => (
        <li key={index} class="flex gap-3">
          <span
            aria-hidden="true"
            class="flex size-6 shrink-0 items-center justify-center rounded-full border border-accent font-mono text-xs font-bold text-accent"
          >
            {index + 1}
          </span>
          <span>
            <strong class="font-semibold text-ink">{title}</strong>
            {body !== undefined && <> {body}</>}
          </span>
        </li>
      ))}
    </ol>
  );
}
