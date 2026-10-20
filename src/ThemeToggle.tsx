import { useEffect, useLayoutEffect, useState } from "preact/hooks";
import { Button } from "./Button.tsx";
import {
  changeEvent,
  isThemeChoice,
  order,
  setTheme,
  storedTheme,
  type ThemeChoice,
  themeScript,
} from "./theme.ts";
import { Tooltip, type TooltipAlign } from "./Tooltip.tsx";

const names: Record<ThemeChoice, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

const hints: Record<ThemeChoice, string> = {
  system: "Matches your device. Click for light.",
  light: "Click for dark.",
  dark: "Click to match your device.",
};

/**
 * The props for {@link ThemeToggle}.
 * @group Theme
 */
export type ThemeToggleProps = {
  /** Where its tooltip lines up. Defaults to `end`, for a toggle at the right of a header. */
  align?: TooltipAlign;
  class?: string;
};

/**
 * Cycles the system, light and dark themes. Its tooltip says which is on and what a click does. Every toggle on the page stays in step.
 * @group Theme
 */
export function ThemeToggle({ align = "end", class: extra }: ThemeToggleProps) {
  // Starts as the server renders it, so hydrating doesn't mix two icons; the saved choice applies before paint.
  const [choice, setChoice] = useState<ThemeChoice>("system");
  useLayoutEffect(() => setChoice(storedTheme()), []);

  useEffect(() => {
    const update = (event: Event) => {
      if (event instanceof CustomEvent && isThemeChoice(event.detail)) {
        setChoice(event.detail);
      }
    };
    window.addEventListener(changeEvent, update);
    return () => window.removeEventListener(changeEvent, update);
  }, []);

  const next = order[(order.indexOf(choice) + 1) % order.length] ?? "system";

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <Tooltip
        align={align}
        class={extra}
        content={
          <>
            <span class="block font-semibold">{names[choice]}</span>
            <span class="text-muted">{hints[choice]}</span>
          </>
        }
      >
        <Button
          variant="icon"
          size="sm"
          aria-label={`${names[choice]}. ${hints[choice]}`}
          onClick={() => setTheme(next)}
        >
          <ThemeIcon />
        </Button>
      </Tooltip>
    </>
  );
}

// All three icons render; the page's data-theme-choice picks one, so it's right before hydration.
function ThemeIcon() {
  const svg = "size-4 fill-none stroke-current";
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        class={`${svg} theme-choice-light:hidden theme-choice-dark:hidden`}
        stroke-width="1.5"
        stroke-linecap="round"
      >
        <rect x="2" y="3" width="12" height="8" rx="1" />
        <path d="M6 14h4M8 11v3" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        class={`${svg} hidden theme-choice-light:block`}
        stroke-width="1.5"
        stroke-linecap="round"
      >
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        class={`${svg} hidden theme-choice-dark:block`}
        stroke-width="1.5"
        stroke-linecap="round"
      >
        <path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5Z" />
      </svg>
    </>
  );
}
