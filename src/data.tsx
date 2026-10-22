import type { ComponentChildren } from "preact";
import { cn } from "./cn.ts";

/**
 * One of a {@link Stats} row's figures.
 * @group Text
 */
export type Stat = {
  /** Short, such as `4×` or `12,000`. */
  value: ComponentChildren;
  label: ComponentChildren;
};

/**
 * The props for {@link Stats}.
 * @group Text
 */
export type StatsProps = {
  items: Stat[];
  class?: string;
};

/**
 * A row of headline figures in equal columns, stacked on narrow screens.
 * @group Text
 */
export function Stats({ items, class: extra }: StatsProps) {
  return (
    <ul
      class={cn(
        "grid divide-line max-sm:divide-y sm:auto-cols-fr sm:grid-flow-col sm:divide-x",
        extra,
      )}
    >
      {items.map(({ value, label }, index) => (
        <li key={index} class="px-6 py-5 sm:px-8">
          <p class="font-mono text-4xl font-bold tracking-tight text-accent">
            {value}
          </p>
          <p class="mt-1 text-sm text-muted">{label}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * One of a {@link Facts} list's entries.
 * @group Text
 */
export type Fact = {
  term: string;
  detail: ComponentChildren;
  /** Takes the full width on narrow screens, for a long detail. */
  wide?: boolean;
};

/**
 * The props for {@link Facts}.
 * @group Text
 */
export type FactsProps = {
  items: Fact[];
  class?: string;
};

/**
 * Short facts with labels, such as a project's role, year and team: two columns on narrow screens, one row on wide ones.
 * @group Text
 */
export function Facts({ items, class: extra }: FactsProps) {
  return (
    <dl
      class={cn("grid grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:flex-wrap", extra)}
    >
      {items.map(({ term, detail, wide = false }) => (
        <div key={term} class={cn(wide && "col-span-2")}>
          <dt class="type-eyebrow text-muted">{term}</dt>
          <dd class="mt-1 font-mono text-sm">{detail}</dd>
        </div>
      ))}
    </dl>
  );
}
