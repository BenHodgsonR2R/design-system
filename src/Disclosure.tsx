import type { ComponentChildren, JSX } from "preact";
import { cn } from "./cn.ts";

/**
 * The props for {@link Disclosure}: every `<details>` attribute, plus these.
 * @group Layout
 */
export type DisclosureProps = Omit<
  JSX.HTMLAttributes<HTMLDetailsElement>,
  "title"
> & {
  title: ComponentChildren;
  /** A line under the title. */
  description?: ComponentChildren;
  /** A small icon, shown in a tile that fills with the accent colour when open. */
  icon?: ComponentChildren;
  /** Disclosures with the same `name` form an accordion: opening one closes the others. */
  name?: string;
  open?: boolean;
  class?: string;
  children: ComponentChildren;
};

/**
 * A card that opens to show more: a native `<details>`, so it works without JavaScript. Open, it takes the accent edge
 * that page headers have, and it grows open smoothly where browsers can animate to `auto`.
 * @group Layout
 */
export function Disclosure({
  title,
  description,
  icon,
  class: extra,
  children,
  ...props
}: DisclosureProps) {
  return (
    <details
      // The accent bar is an inset shadow rather than a wider border, so opening it doesn't shift what's inside.
      class={cn(
        "group overflow-hidden rounded-xl border border-line bg-surface shadow-window transition-[border-color,box-shadow] duration-300 [interpolate-size:allow-keywords] open:border-l-accent open:shadow-[inset_3px_0_0_var(--accent),0_8px_0_-4px_var(--line)]",
        "[&::details-content]:h-0 [&::details-content]:overflow-hidden [&::details-content]:transition-[height,content-visibility] [&::details-content]:duration-300 [&::details-content]:[transition-behavior:allow-discrete] open:[&::details-content]:h-auto motion-reduce:[&::details-content]:transition-none",
        extra,
      )}
      {...props}
    >
      <summary class="flex cursor-pointer list-none items-center gap-4 px-5 py-4 transition-colors hover:bg-canvas/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
        {icon !== undefined && (
          <span
            aria-hidden="true"
            class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-accent-soft text-accent transition group-open:border-accent group-open:bg-accent group-open:text-on-accent [&>svg]:size-5"
          >
            {icon}
          </span>
        )}
        <span class="min-w-0">
          <span class="block type-heading">{title}</span>
          {description !== undefined && (
            <span class="block text-sm text-muted">{description}</span>
          )}
        </span>
        <span
          aria-hidden="true"
          class="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong text-muted transition duration-300 group-open:rotate-180 group-open:border-accent group-open:text-accent"
        >
          <svg
            viewBox="0 0 16 16"
            class="size-4 fill-none stroke-current"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </span>
      </summary>
      <div class="border-t border-line px-5 pt-5 pb-6">{children}</div>
    </details>
  );
}
