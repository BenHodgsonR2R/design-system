import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, test } from "vitest";
import { type Api, type ApiEntry, loadApi } from "../src/api.ts";

const fixture = (file: string) =>
  fileURLToPath(new URL(`fixture/${file}`, import.meta.url));

let api: Api;
const entry = (name: string): ApiEntry => {
  const found = api.entries.find((e) => e.name === name);
  if (found === undefined) {
    throw new Error(`No entry for ${name}`);
  }
  return found;
};

beforeAll(async () => {
  api = await loadApi({
    entryPoints: [fixture("index.ts")],
    tsconfig: fixture("tsconfig.json"),
    base: "/docs/api/",
    groups: ["Widgets"],
  });
}, 60_000);

describe("loadApi", () => {
  test("orders groups as asked, then the rest", () => {
    expect(api.groups).toEqual(["Widgets", "Machines"]);
  });

  test("shows a component's props type as its props, not its own page", () => {
    expect(entry("Widget").kind).toBe("component");
    expect(entry("Widget").props?.map((p) => p.name)).toEqual([
      "volume",
      "label",
    ]);
    expect(api.entries.some((e) => e.name === "WidgetProps")).toBe(false);
  });

  test("lists a union's values and what uses it", () => {
    expect(entry("Volume").values?.map((v) => v[0]?.text)).toEqual([
      '"quiet"',
      '"loud"',
    ]);
    expect(entry("Volume").usedBy.map((u) => u.name)).toContain("Widget");
  });

  test("documents a class's constructor, properties and methods", () => {
    const machine = entry("Machine");

    expect(machine.kind).toBe("class");
    expect(machine.construct?.signature).toBe(
      "new Machine(options: MachineOptions)",
    );
    expect(machine.fields?.map((f) => f.name)).toEqual(["volume"]);
    expect(machine.methods?.map((m) => m.signature)).toEqual([
      "run(options: { times: number }): Promise<number>",
    ]);
  });

  test("leaves out members inherited from outside the package", () => {
    const error = entry("MachineError");

    expect(error.signature).toBe("class MachineError extends Error");
    expect(error.fields?.map((f) => f.name)).toEqual(["reason"]);
    expect(error.methods).toEqual([]);
  });

  test("lists an interface's methods", () => {
    expect(entry("Runner").methods?.map((m) => m.name)).toEqual(["run"]);
  });
});
