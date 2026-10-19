import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "./cn.ts";

const highlight = cva("rounded-sm px-1 box-decoration-clone text-inherit", {
  variants: {
    tone: {
      blue: "bg-highlight-blue",
      red: "bg-highlight-red",
    },
  },
  defaultVariants: { tone: "blue" },
});

/** Marker-pen emphasis for a few words. */
export function Highlight({
  tone,
  children,
}: VariantProps<typeof highlight> & { children: ComponentChildren }) {
  return <mark class={highlight({ tone })}>{children}</mark>;
}

type LinkProps = JSX.AnchorHTMLAttributes & { class?: string };

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
