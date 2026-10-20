import { useEffect, useState } from "preact/hooks";
import { Button } from "./Button.tsx";
import { Tooltip, type TooltipAlign } from "./Tooltip.tsx";

export type ThemeChoice = "system" | "light" | "dark";

const storageKey = "bhodgson-theme";
const changeEvent = "bhodgson-themechange";
const order: readonly ThemeChoice[] = ["system", "light", "dark"];

/** The saved choice, or `system` when there's none or storage is unavailable. */
export function storedTheme(): ThemeChoice {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

/** Applies and saves a choice. `system` follows the operating system's setting. */
export function setTheme(choice: ThemeChoice): void {
  applyToDocument(choice);
  try {
    if (choice === "system") {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, choice);
    }
  } catch {
    // Storage can be blocked; the choice still applies until the page reloads.
  }
  window.dispatchEvent(new CustomEvent(changeEvent, { detail: choice }));
}

/** Call before the first render, so a saved choice applies without a flash. */
export function applyStoredTheme(): void {
  applyToDocument(storedTheme());
}

function applyToDocument(choice: ThemeChoice): void {
  if (choice === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = choice;
  }
}

function isThemeChoice(value: unknown): value is ThemeChoice {
  return order.some((choice) => choice === value);
}

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

export type ThemeToggleProps = {
  /** Where its tooltip lines up. Defaults to `end`, for a toggle at the right of a header. */
  align?: TooltipAlign;
  class?: string;
};

/** Cycles system, light and dark. Every toggle on the page stays in step. */
export function ThemeToggle({ align = "end", class: extra }: ThemeToggleProps) {
  const [choice, setChoice] = useState(storedTheme);

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
        <ThemeIcon choice={choice} />
      </Button>
    </Tooltip>
  );
}

function ThemeIcon({ choice }: { choice: ThemeChoice }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      class="size-4 fill-none stroke-current"
      stroke-width="1.5"
      stroke-linecap="round"
    >
      {choice === "light" && (
        <>
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
        </>
      )}
      {choice === "dark" && (
        <path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5Z" />
      )}
      {choice === "system" && (
        <>
          <rect x="2" y="3" width="12" height="8" rx="1" />
          <path d="M6 14h4M8 11v3" />
        </>
      )}
    </svg>
  );
}
