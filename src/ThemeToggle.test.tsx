import { render } from "preact-render-to-string";
import { describe, expect, test } from "vitest";
import { ThemeToggle } from "./ThemeToggle.tsx";

describe("ThemeToggle", () => {
  test("renders the system theme on the server, whatever is saved", () => {
    const html = render(<ThemeToggle />);

    expect(html).toContain("System theme");
    expect(html).toContain("<rect");
  });
});
