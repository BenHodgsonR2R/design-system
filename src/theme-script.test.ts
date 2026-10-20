import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { setTheme, themeScript } from "./theme.ts";

beforeEach(() => {
  GlobalRegistrator.register({
    settings: { enableJavaScriptEvaluation: true },
  });
});

function runThemeScript() {
  const script = document.createElement("script");
  script.textContent = themeScript;
  document.head.append(script);
}

afterEach(async () => {
  await GlobalRegistrator.unregister();
});

const root = () => document.documentElement.dataset;

describe("themeScript", () => {
  test("follows the system when nothing is saved", () => {
    runThemeScript();

    expect(root().themeChoice).toBe("system");
    expect(root().theme).toBe("light");
  });

  test("applies a saved choice", () => {
    localStorage.setItem("bhodgson-theme", "dark");
    runThemeScript();

    expect(root().themeChoice).toBe("dark");
    expect(root().theme).toBe("dark");
  });
});

describe("setTheme", () => {
  test("applies and saves a choice, and clears it for system", () => {
    setTheme("dark");
    expect(root().theme).toBe("dark");
    expect(localStorage.getItem("bhodgson-theme")).toBe("dark");

    setTheme("system");
    expect(root().themeChoice).toBe("system");
    expect(root().theme).toBe("light");
    expect(localStorage.getItem("bhodgson-theme")).toBeNull();
  });
});
