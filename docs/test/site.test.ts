import { readdirSync, readFileSync } from "node:fs";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

// Checks the built site for the Starlight structure our overrides and styles rely on, so a Starlight
// upgrade that changes it fails here rather than quietly breaking the site. Run after `pnpm build`.

const dist = new URL("../dist/", import.meta.url);
const page = (path: string) =>
  new DOMParser().parseFromString(
    readFileSync(new URL(`${path}index.html`, dist), "utf8"),
    "text/html",
  );

beforeAll(() => GlobalRegistrator.register());
afterAll(() => GlobalRegistrator.unregister());

describe("every page", () => {
  test("applies the theme in <head> and uses the design system's header", () => {
    const doc = page("guides/getting-started/");

    expect(doc.head.innerHTML).toContain("bhodgson-theme");
    expect(doc.querySelector("header")?.textContent).toContain("~/ben/");
    expect(
      [...doc.querySelectorAll("header button")].some((button) =>
        button.textContent?.includes("Search"),
      ),
    ).toBe(true);
  });

  test("credits the project and links to the previous and next pages", () => {
    const doc = page("guides/getting-started/");

    expect(doc.body.textContent).toContain(
      "design-system is a Ben Hodgson project",
    );
    expect(doc.querySelector('nav[aria-label="Pages"] a[rel="next"]')).not.toBe(
      null,
    );
  });
});

describe("guides", () => {
  test("render content in prose, with Starlight's heading anchors", () => {
    const doc = page("guides/getting-started/");
    const wrapper = doc.querySelector(".prose > .sl-heading-wrapper");

    expect(doc.querySelector("h1#_top.type-title")).not.toBe(null);
    expect(wrapper?.querySelector("h2")).not.toBe(null);
    expect(wrapper?.querySelector("a.sl-anchor-link")).not.toBe(null);
  });
});

describe("API pages", () => {
  test("show a component's props", () => {
    const doc = page("api/layout/page/");

    expect(doc.querySelector("#props")?.textContent).toBe("Props");
    expect(doc.querySelectorAll("dl dt").length).toBeGreaterThan(5);
  });
});

describe("styles", () => {
  test("order Starlight's layers so its reset comes before its components", () => {
    const sheets = [...page("guides/getting-started/").querySelectorAll("link")]
      .filter((link) => link.rel === "stylesheet" && link.media !== "print")
      .map((link) => link.getAttribute("href")?.replace("/design-system/", ""))
      .map((href) => readFileSync(new URL(href ?? "", dist), "utf8"));
    const order: string[] = [];
    for (const css of sheets) {
      for (const [, names] of css.matchAll(/@layer ([\w.,]+)/g)) {
        for (const name of names?.split(",") ?? []) {
          if (name.startsWith("starlight.") && !order.includes(name)) {
            order.push(name);
          }
        }
      }
    }

    const reset = order.indexOf("starlight.reset");
    expect(reset).toBeGreaterThanOrEqual(0);
    for (const later of [
      "starlight.core",
      "starlight.content",
      "starlight.components",
    ]) {
      expect(order.indexOf(later)).toBeGreaterThan(reset);
    }
  });
});

test("builds a search index", () => {
  expect(readdirSync(new URL("pagefind/", dist))).toContain("pagefind.js");
});
