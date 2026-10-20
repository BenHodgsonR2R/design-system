/**
 * A theme the reader can pick: `system` follows their device's setting.
 * @group Theme
 */
export type ThemeChoice = "system" | "light" | "dark";

const storageKey = "bhodgson-theme";
export const changeEvent = "bhodgson-themechange";
export const order: readonly ThemeChoice[] = ["system", "light", "dark"];

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return order.some((choice) => choice === value);
}

// Self-contained, because themeScript is its source: it can't use anything outside itself.
// Sets data-theme to the light or dark in use, and data-theme-choice to what the reader picked.
function initTheme(): void {
  const root = document.documentElement;
  const media = matchMedia("(prefers-color-scheme: dark)");
  const apply = (event?: Event) => {
    let choice: unknown = event instanceof CustomEvent ? event.detail : null;
    if (choice !== "system" && choice !== "light" && choice !== "dark") {
      try {
        choice = localStorage.getItem("bhodgson-theme");
      } catch {
        choice = null;
      }
    }
    if (choice !== "light" && choice !== "dark") {
      choice = "system";
    }
    let theme = choice;
    if (theme === "system") {
      theme = media.matches ? "dark" : "light";
    }
    root.dataset.themeChoice = String(choice);
    root.dataset.theme = String(theme);
  };
  apply();
  if (!("bhodgsonTheme" in window)) {
    Object.defineProperty(window, "bhodgsonTheme", { value: true });
    media.addEventListener("change", () => apply());
    addEventListener("bhodgson-themechange", apply);
  }
}

/**
 * An inline script that applies the saved theme as the page loads, and keeps it in step with the system setting. Put it in `<head>` on server-rendered pages, so the page draws in the right theme. `ThemeToggle` renders it too.
 * @group Theme
 */
export const themeScript = `(${initTheme.toString()})()`;

/**
 * The saved {@link ThemeChoice}, or `system` when there's none or storage is unavailable.
 * @group Theme
 */
export function storedTheme(): ThemeChoice {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

/**
 * Applies and saves a {@link ThemeChoice}, and keeps every {@link ThemeToggle} on the page in step.
 * @group Theme
 */
export function setTheme(choice: ThemeChoice): void {
  if (typeof document === "undefined") {
    return;
  }
  try {
    if (choice === "system") {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, choice);
    }
  } catch {
    // Storage can be blocked; the event still carries the choice until the page reloads.
  }
  initTheme();
  window.dispatchEvent(new CustomEvent(changeEvent, { detail: choice }));
}

/**
 * Applies the saved {@link ThemeChoice}, and follows system changes. Call it before the first render of a browser-only app, so it applies without a flash.
 * @group Theme
 */
export function applyStoredTheme(): void {
  if (typeof document !== "undefined") {
    initTheme();
  }
}
