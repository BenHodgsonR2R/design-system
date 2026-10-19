import { describe, expect, test } from "vitest";

import { cn } from "./cn.ts";

describe("cn()", () => {
  test.each([
    ["size-control", "size-control-sm", "size-control-sm"],
    ["h-control px-3.5", "h-control-sm px-2.5", "h-control-sm px-2.5"],
    ["shadow-window", "shadow-none", "shadow-none"],
    ["bg-accent text-on-accent", "bg-surface", "text-on-accent bg-surface"],
    ["text-xs", "text-ink", "text-xs text-ink"],
  ])("merges %s with %s", (base, extra, expected) => {
    expect(cn(base, extra)).toBe(expected);
  });

  test("drops false and undefined values", () => {
    expect(cn("rounded-md", false, undefined, "border")).toBe(
      "rounded-md border",
    );
  });
});
