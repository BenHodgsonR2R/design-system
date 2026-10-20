import { cva } from "class-variance-authority";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "./cn.ts";

/**
 * A {@link Highlight}'s marker colour.
 * @group Text
 */
export type HighlightTone = "blue" | "red";

const highlight = cva("rounded-sm px-1 box-decoration-clone text-inherit", {
  variants: {
    tone: {
      blue: "bg-highlight-blue",
      red: "bg-highlight-red",
    } satisfies Record<HighlightTone, string>,
  },
  defaultVariants: { tone: "blue" },
});

/**
 * The props for {@link Highlight}.
 * @group Text
 */
export type HighlightProps = {
  /** Defaults to `blue`. */
  tone?: HighlightTone;
  children: ComponentChildren;
};

/**
 * Marker-pen emphasis for a few words.
 * @group Text
 */
export function Highlight({ tone, children }: HighlightProps) {
  return <mark class={highlight({ tone })}>{children}</mark>;
}

/**
 * The props for {@link Link}: every `<a>` attribute, plus these.
 * @group Text
 */
export type LinkProps = JSX.AnchorHTMLAttributes & { class?: string };

/**
 * A link with a bold underline.
 * @group Text
 */
export function Link({ class: extra, ...props }: LinkProps) {
  return (
    <a
      class={cn(
        "font-medium text-link underline decoration-2 underline-offset-2 hover:decoration-ink",
        extra,
      )}
      {...props}
    />
  );
}
