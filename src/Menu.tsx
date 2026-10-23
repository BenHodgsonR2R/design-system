import type { ComponentChildren } from "preact";
import { useEffect, useId, useRef, useState } from "preact/hooks";
import { cn } from "./cn.ts";

/**
 * A link in a {@link Menu}.
 * @group Navigation
 */
export type MenuItem = {
  label: ComponentChildren;
  href: string;
  /** A short line under the label. */
  description?: ComponentChildren;
  /** The page being read: marked, and announced as the current page. */
  current?: boolean;
  /** Downloads the link instead of opening it, saved under this name if it's a string. */
  download?: boolean | string;
};

/**
 * The props for {@link Menu}.
 * @group Navigation
 */
export type MenuProps = {
  items: MenuItem[];
  /** What the button is called for screen readers. Defaults to "Menu". */
  label?: string;
  /** Which edge of the button the menu lines up with. Defaults to `end`, for a menu at the right of a header. */
  align?: "start" | "end";
  class?: string;
};

/**
 * A hamburger menu of links, for when a header runs out of room. Its three lines fold into a cross as it opens, and its
 * links drop in one after another. It closes on Escape, a click anywhere else, tabbing out, or choosing a link; the
 * arrow keys, Home and End move through the links, and opening it from the keyboard moves straight to the first one.
 * @group Navigation
 */
export function Menu({
  items,
  label = "Menu",
  align = "end",
  class: extra,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const links = () => [
    ...(root.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []),
  ];

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

  function close() {
    setOpen(false);
    button.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!open) {
      if (event.key === "ArrowDown" && event.target === button.current) {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => links()[0]?.focus());
      }
      return;
    }
    const all = links();
    const at = all.indexOf(document.activeElement as HTMLAnchorElement);
    const go = (index: number) => {
      event.preventDefault();
      all.at(index % all.length)?.focus();
    };
    if (event.key === "Escape") {
      event.preventDefault();
      close();
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
          // A click from the keyboard has no pointer behind it: take the reader straight to the links.
          if (!open && event.detail === 0) {
            requestAnimationFrame(() => links()[0]?.focus());
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
      <nav
        id={id}
        aria-label={label}
        inert={!open}
        class={cn(
          "absolute top-full z-40 mt-2 min-w-48 origin-top rounded-lg border border-line bg-surface p-1 font-mono text-sm shadow-window transition duration-200 motion-reduce:transition-none",
          align === "end" ? "right-0" : "left-0",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-95 opacity-0",
        )}
      >
        <ul class="flex flex-col">
          {items.map((item, index) => (
            <li
              key={item.href}
              class={cn(
                "transition duration-200 motion-reduce:transition-none",
                open ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
              )}
              // Only while open, so the closed menu the server renders hydrates as it is.
              style={
                open ? { transitionDelay: `${40 + index * 35}ms` } : undefined
              }
            >
              <a
                href={item.href}
                download={item.download}
                aria-current={item.current ? "page" : undefined}
                onClick={() => setOpen(false)}
                class="group/item flex items-baseline gap-2 rounded-md px-3 py-2 text-ink transition-colors hover:bg-surface-sunken focus-visible:bg-surface-sunken focus-visible:outline-none aria-[current=page]:text-accent"
              >
                {/* A prompt marks the link under the pointer or the keyboard, and the current page. */}
                <span
                  aria-hidden="true"
                  class="w-2 text-accent opacity-0 transition-opacity group-hover/item:opacity-100 group-focus-visible/item:opacity-100 group-aria-[current=page]/item:opacity-100"
                >
                  &gt;
                </span>
                <span class="flex flex-col">
                  <span class="font-semibold">{item.label}</span>
                  {item.description !== undefined && (
                    <span class="font-sans text-xs text-muted">
                      {item.description}
                    </span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
