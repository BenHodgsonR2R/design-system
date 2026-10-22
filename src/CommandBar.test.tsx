import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { render } from "preact";
import { act } from "preact/test-utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { type Command, CommandBar, type CommandResult } from "./CommandBar.tsx";

const projects: CommandResult[] = [
  { url: "/place-images/", title: "Place images", label: "./place-images" },
  { url: "/places/", title: "Places", label: "./places" },
];

const commands: Command[] = [
  {
    name: "ls",
    description: "list the projects",
    run: () => ({ results: projects }),
  },
  {
    name: "cd",
    usage: "cd <project>",
    description: "open a project",
    run: (args) => {
      const matches = projects.filter((p) =>
        p.label?.slice(2).startsWith(args),
      );
      return args === ".."
        ? { message: "press Enter to go back", go: "/" }
        : matches.length === 0
          ? { message: `cd: no such project: ${args}`, tone: "error" }
          : {
              results: matches,
              complete:
                matches.length === 1
                  ? `cd ${matches[0]?.label?.slice(2)}`
                  : undefined,
            };
    },
  },
];

let root: HTMLDivElement;

beforeEach(() => {
  GlobalRegistrator.register({ url: "https://example.com/" });
  root = document.createElement("div");
  document.body.append(root);
});

afterEach(async () => {
  await GlobalRegistrator.unregister();
});

const input = () => root.querySelector("input")!;
const options = () => [...root.querySelectorAll('[role="option"]')];
const output = () =>
  root.querySelector("[data-output]")?.textContent?.replace(/\s+/g, " ").trim();

async function type(value: string) {
  await act(() => {
    input().value = value;
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
}

async function press(key: string) {
  await act(() => {
    input().dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  });
}

describe("CommandBar", () => {
  test("shows the prompt in the author's home and the working directory", async () => {
    await act(() => render(<CommandBar cwd="places" />, root));
    expect(root.querySelector("label")?.textContent).toContain(
      "~/ben/places $",
    );
  });

  test("lists the commands, help and search under help", async () => {
    await act(() =>
      render(<CommandBar commands={commands} search={async () => []} />, root),
    );
    await type("help");
    const text = output();
    expect(text).toContain("ls");
    expect(text).toContain("cd <project>");
    expect(text).toContain("open a project");
    expect(text).toContain("anything else");
  });

  test("runs a command's results, with the arrow keys choosing one", async () => {
    await act(() => render(<CommandBar commands={commands} />, root));
    await type("ls");
    expect(options()).toHaveLength(2);
    expect(options()[0]?.getAttribute("aria-selected")).toBe("true");
    await press("ArrowDown");
    expect(options()[1]?.getAttribute("aria-selected")).toBe("true");
    await press("ArrowDown");
    expect(options()[0]?.getAttribute("aria-selected")).toBe("true");
  });

  test("completes with Tab and shows a command's messages", async () => {
    await act(() => render(<CommandBar commands={commands} />, root));
    await type("cd place-");
    await press("Tab");
    expect(input().value).toBe("cd place-images");
    await type("cd nope");
    expect(output()).toContain("cd: no such project: nope");
    expect(root.querySelector(".text-danger")).not.toBeNull();
  });

  test("goes where Enter points", async () => {
    const assign = vi.fn<(url: string) => void>();
    Object.defineProperty(window, "location", {
      value: { assign },
      configurable: true,
    });
    await act(() => render(<CommandBar commands={commands} />, root));
    await type("cd ..");
    await press("Enter");
    expect(assign).toHaveBeenCalledWith("/");
    await type("ls");
    await press("ArrowDown");
    await press("Enter");
    expect(assign).toHaveBeenLastCalledWith("/places/");
  });

  test("searches for anything else, and says when nothing matches", async () => {
    const search = vi.fn<(query: string) => Promise<CommandResult[]>>(
      async (query) =>
        query === "ICU" ? [{ url: "/translation/", title: "Translation" }] : [],
    );
    await act(() => render(<CommandBar search={search} />, root));
    await type("ICU");
    await act(async () => {});
    expect(output()).toContain('search "ICU"');
    expect(output()).toContain("Translation");
    await type("zebra");
    await act(async () => {});
    expect(output()).toContain("no matches");
  });

  test("says why a search failed", async () => {
    await act(() =>
      render(
        <CommandBar
          search={() => Promise.reject(new Error("denied"))}
          unavailable={(error) =>
            error instanceof Error && error.message === "denied"
              ? "permission denied"
              : "no index"
          }
        />,
        root,
      ),
    );
    await type("anything");
    await act(async () => {});
    expect(output()).toContain("permission denied");
  });

  test("doesn't know other commands without a search", async () => {
    await act(() => render(<CommandBar commands={commands} />, root));
    await type("rm -rf");
    expect(output()).toContain("command not found: rm");
  });

  test("clears on Escape", async () => {
    await act(() => render(<CommandBar commands={commands} />, root));
    await type("ls");
    await press("Escape");
    expect(input().value).toBe("");
    expect(output()).toBeUndefined();
  });
});
