import type { ComponentChildren } from "preact";
import { cn } from "./cn.ts";

/**
 * The props for {@link Annotation}.
 * @group Text
 */
export type AnnotationProps = {
  /** What the note points out. Mark the part it's about with an `accent` {@link Highlight}. */
  children: ComponentChildren;
  /** The note, led to by a dotted line. In Astro, a `note` slot works too. */
  note?: ComponentChildren;
  class?: string;
};

/**
 * A snippet on blueprint paper with a note under it, the way a drawing labels its parts. For pointing at part of an
 * address, a command or a line of code.
 * @example
 * ```tsx
 * <Annotation note={<><span class="text-accent">your code</span>, from the link</>}>
 *   <span class="text-muted">example.com/?invite=</span>
 *   <Highlight tone="accent">acme-7k2x</Highlight>
 * </Annotation>
 * ```
 * @group Text
 */
export function Annotation({ children, note, class: extra }: AnnotationProps) {
  return (
    <figure
      class={cn("rounded-lg border border-line bg-canvas bg-grid p-4", extra)}
    >
      <p class="flex flex-wrap items-center gap-y-1 font-mono text-sm break-all">
        {children}
      </p>
      {note !== undefined && (
        <figcaption class="mt-3 flex items-start gap-2 font-mono text-xs text-muted">
          <span
            aria-hidden="true"
            class="mt-[0.55em] h-px w-6 shrink-0 border-t border-dotted border-accent"
          />
          <span>{note}</span>
        </figcaption>
      )}
    </figure>
  );
}
