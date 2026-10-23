import type { ComponentChildren } from "preact";
import { useEffect, useId, useRef, useState } from "preact/hooks";
import { cn } from "./cn.ts";

/**
 * The props for {@link Menu}.
 * @group Navigation
 */
export type MenuProps = {
  /** What the button is called for screen readers. Defaults to "Menu". */
  label?: string;
  /** Which edge of the button the menu lines up with. Defaults to `end`, for a menu at the right of a header. */
  align?: "start" | "end";
  class?: string;
  /** What the menu holds: usually links, styled for you, with `aria-current="page"` marking the one for the page being read. */
  children: ComponentChildren;
};

const focusable =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * A hamburger menu, for when a header runs out of room. Its three lines fold into a cross as it opens, and what it
 * holds drops in one after another. It closes on Escape, a click anywhere else, tabbing out, or choosing a link or
 * button inside it; the arrow keys, Home and End move between what's inside, and opening it from the keyboard moves
 * straight to the first. Links inside are styled for you, and whichever has `aria-current="page"` is marked.
 * @group Navigation
 */
export function Menu({
  label = "Menu",
  align = "end",
  class: extra,
  children,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const inside = () => [
    ...(panel.current?.querySelectorAll<HTMLElement>(focusable) ?? []),
  ];
  const first = () => requestAnimationFrame(() => inside()[0]?.focus());

  useEffect(() => {
    if (!open) {
      return;
    }
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function onKeyDown(event: KeyboardEvent) {
    if (!open) {
      if (event.key === "ArrowDown" && event.target === button.current) {
        event.preventDefault();
        setOpen(true);
        first();
      }
      return;
    }
    const all = inside();
    const at = all.indexOf(document.activeElement as HTMLElement);
    const go = (index: number) => {
      event.preventDefault();
      all.at(index % all.length)?.focus();
    };
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      button.current?.focus();
    } else if (event.key === "ArrowDown") {
      go(at + 1);
    } else if (event.key === "ArrowUp") {
      go(at < 0 ? -1 : at - 1);
    } else if (event.key === "Home") {
      go(0);
    } else if (event.key === "End") {
      go(-1);
    }
  }

  return (
    <div
      ref={root}
      class={cn("relative", extra)}
      onKeyDown={onKeyDown}
      onFocusOut={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={(event) => {
          setOpen(!open);
          // A click from the keyboard has no pointer behind it: take the reader straight inside.
          if (!open && event.detail === 0) {
            first();
          }
        }}
        class="group relative flex size-8 items-center justify-center rounded-md border border-line-strong bg-surface text-ink transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-expanded:border-accent aria-expanded:bg-accent-soft"
      >
        <span aria-hidden="true" class="relative block h-3 w-4">
          {/* Three lines that fold into a cross: the top and bottom meet in the middle and turn, the middle one shrinks away. */}
          <span class="absolute inset-x-0 top-0 h-0.5 rounded-full bg-current transition-transform duration-200 group-aria-expanded:translate-y-[5px] group-aria-expanded:rotate-45 motion-reduce:transition-none" />
          <span class="absolute inset-x-0 top-[5px] h-0.5 rounded-full bg-current transition duration-150 group-aria-expanded:scale-x-0 group-aria-expanded:opacity-0 motion-reduce:transition-none" />
          <span class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-current transition-transform duration-200 group-aria-expanded:-translate-y-[5px] group-aria-expanded:-rotate-45 motion-reduce:transition-none" />
        </span>
      </button>
      <div
        ref={panel}
        id={id}
        inert={!open}
        data-open={open}
        onClick={(event) => {
          if ((event.target as Element).closest("a, button")) {
            setOpen(false);
          }
        }}
        class={cn(
          "group/menu absolute top-full z-40 mt-2 flex min-w-48 origin-top flex-col rounded-lg border border-line bg-surface p-1 font-mono text-sm shadow-window transition duration-200 motion-reduce:transition-none",
          "invisible -translate-y-1 scale-95 opacity-0 data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:scale-100 data-[open=true]:opacity-100",
          // What it holds drops in one after another.
          "[&>*]:-translate-x-1 [&>*]:opacity-0 [&>*]:transition [&>*]:duration-200 motion-reduce:[&>*]:transition-none data-[open=true]:[&>*]:translate-x-0 data-[open=true]:[&>*]:opacity-100",
          "data-[open=true]:[&>*:nth-child(1)]:delay-[40ms] data-[open=true]:[&>*:nth-child(2)]:delay-[75ms] data-[open=true]:[&>*:nth-child(3)]:delay-[110ms] data-[open=true]:[&>*:nth-child(4)]:delay-[145ms] data-[open=true]:[&>*:nth-child(5)]:delay-[180ms] data-[open=true]:[&>*:nth-child(n+6)]:delay-[215ms]",
          // Links, with a prompt that marks the one under the pointer or the keyboard, and the current page.
          "[&_a]:flex [&_a]:items-baseline [&_a]:gap-2 [&_a]:rounded-md [&_a]:px-3 [&_a]:py-2 [&_a]:font-semibold [&_a]:text-ink [&_a]:no-underline [&_a]:transition-colors [&_a:focus-visible]:bg-surface-sunken [&_a:focus-visible]:outline-none [&_a:hover]:bg-surface-sunken [&_a[aria-current=page]]:text-accent",
          "[&_a]:before:w-2 [&_a]:before:text-accent [&_a]:before:opacity-0 [&_a]:before:transition-opacity [&_a]:before:content-['>'] [&_a:focus-visible]:before:opacity-100 [&_a:hover]:before:opacity-100 [&_a[aria-current=page]]:before:opacity-100",
          align === "end" ? "right-0" : "left-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}
