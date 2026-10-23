import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { render } from "preact";
import { act } from "preact/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Menu } from "./Menu.tsx";

let root: HTMLDivElement;

beforeEach(async () => {
  GlobalRegistrator.register({ url: "https://example.com/" });
  root = document.createElement("div");
  document.body.append(root);
  await act(() =>
    render(
      <Menu>
        <a href="/">projects</a>
        <a href="/memos/" aria-current="page">
          memos
        </a>
        <a href="/contact/">contact</a>
      </Menu>,
      root,
    ),
  );
});

afterEach(async () => {
  await GlobalRegistrator.unregister();
});

const button = () => root.querySelector("button")!;
const panel = () =>
  document.getElementById(button().getAttribute("aria-controls")!)!;
const links = () => [...root.querySelectorAll("a")];
const isOpen = () => button().getAttribute("aria-expanded") === "true";

async function key(target: Element, name: string) {
  await act(() => {
    target.dispatchEvent(
      new KeyboardEvent("keydown", { key: name, bubbles: true }),
    );
  });
}

async function click(detail = 1) {
  await act(() => {
    button().dispatchEvent(new MouseEvent("click", { bubbles: true, detail }));
  });
}

describe("Menu", () => {
  test("starts closed, with its links out of reach", () => {
    expect(isOpen()).toBe(false);
    expect(panel().inert).toBe(true);
    expect(button().getAttribute("aria-controls")).toBe(panel().id);
  });

  test("opens and closes from its button", async () => {
    await click();
    expect(isOpen()).toBe(true);
    expect(panel().inert).toBe(false);
    await click();
    expect(isOpen()).toBe(false);
  });

  test("holds whatever it's given", () => {
    expect(links().map((link) => link.textContent)).toEqual([
      "projects",
      "memos",
      "contact",
    ]);
  });

  test("moves through the links with the arrow keys, Home and End, wrapping round", async () => {
    await click();
    await key(button(), "ArrowDown");
    expect(document.activeElement).toBe(links()[0]);
    await key(links()[0]!, "ArrowDown");
    expect(document.activeElement).toBe(links()[1]);
    await key(links()[1]!, "End");
    expect(document.activeElement).toBe(links()[2]);
    await key(links()[2]!, "ArrowDown");
    expect(document.activeElement).toBe(links()[0]);
    await key(links()[0]!, "ArrowUp");
    expect(document.activeElement).toBe(links()[2]);
    await key(links()[2]!, "Home");
    expect(document.activeElement).toBe(links()[0]);
  });

  test("closes on Escape and hands focus back to its button", async () => {
    await click();
    links()[1]!.focus();
    await key(links()[1]!, "Escape");
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(button());
  });

  test("closes on a click anywhere else", async () => {
    await click();
    await act(() => {
      document.body.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true }),
      );
    });
    expect(isOpen()).toBe(false);
  });

  test("closes when a link is chosen", async () => {
    await click();
    await act(() => {
      links()[2]!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(isOpen()).toBe(false);
  });

  test("opens from ArrowDown on its button", async () => {
    await key(button(), "ArrowDown");
    expect(isOpen()).toBe(true);
  });
});
