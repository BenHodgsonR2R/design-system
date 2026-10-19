import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

type Oklch = [number, number, number];
type Rgb = [number, number, number];

const css = readFileSync(new URL("../theme.css", import.meta.url), "utf8");

// Every token is `light-dark(oklch(...), oklch(...))`.
const tokens = new Map<string, { light: Oklch; dark: Oklch }>();
for (const [, name, light, dark] of css.matchAll(
  /--([\w-]+):\s*light-dark\(\s*oklch\(([^)]+)\),\s*oklch\(([^)]+)\)\s*\)/g,
)) {
  tokens.set(name, { light: parse(light), dark: parse(dark) });
}

function parse(value: string): Oklch {
  const [l, c, h] = value.trim().split(/\s+/).map(Number);
  return [l, c, h];
}

function token(name: string, mode: "light" | "dark"): Oklch {
  const found = tokens.get(name);
  if (found === undefined) {
    throw new Error(`theme.css has no --${name}`);
  }
  return found[mode];
}

function toLinearRgb([l, c, h]: Oklch): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const lms = [
    (l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    (l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    (l - 0.0894841775 * a - 1.291485548 * b) ** 3,
  ] as const;
  return [
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2],
  ];
}

function luminance(color: Oklch): number {
  const [r, g, b] = toLinearRgb(color).map((v) => Math.min(1, Math.max(0, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: Oklch, b: Oklch): number {
  const [hi, lo] = [luminance(a), luminance(b)].toSorted((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Machado, Oliveira and Fernandes (2009), severity 1, on linear sRGB.
const deficiencies: Record<string, number[][]> = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

function toOklab([r, g, b]: Rgb): Rgb {
  const [l, m, s] = [
    0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
    0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
    0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b,
  ].map(Math.cbrt) as Rgb;
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function simulate(color: Oklch, matrix: number[][]): Rgb {
  const rgb = toLinearRgb(color);
  return toOklab(
    matrix.map((row) =>
      Math.min(
        1,
        Math.max(
          0,
          row.reduce((sum, w, i) => sum + w * rgb[i], 0),
        ),
      ),
    ) as Rgb,
  );
}

const modes = ["light", "dark"] as const;
const statuses = ["danger", "warning", "success", "info"];
const dataColours = [1, 2, 3, 4, 5, 6].map((n) => `data-${n}`);

// Foreground, background, the WCAG minimum, and what the pair is used for.
const pairs: [string, string, number, string][] = [
  ["ink", "canvas", 4.5, "body text"],
  ["ink", "surface", 4.5, "body text"],
  ["ink", "surface-sunken", 4.5, "text in wells"],
  ["muted", "surface", 4.5, "secondary text"],
  ["muted", "canvas", 4.5, "secondary text"],
  ["muted", "surface-sunken", 4.5, "secondary text"],
  ["link", "surface", 4.5, "links"],
  ["link", "canvas", 4.5, "links"],
  ["on-accent", "accent", 4.5, "primary button text"],
  ["accent", "canvas", 3, "primary button shape"],
  ["accent", "surface", 3, "primary button shape"],
  ["line-strong", "surface", 3, "control borders"],
  ["line-strong", "canvas", 3, "control borders"],
  ["focus", "surface", 3, "focus ring"],
  ["focus", "canvas", 3, "focus ring"],
  ["ink", "accent-soft", 4.5, "accent badge text"],
  ["ink", "highlight-blue", 4.5, "highlighted text"],
  ["ink", "highlight-red", 4.5, "highlighted text"],
  ["secondary", "surface", 4.5, "secondary accent text"],
  ["ink", "secondary-soft", 4.5, "text on the secondary tint"],
  ...statuses.flatMap((status): [string, string, number, string][] => [
    ["ink", `${status}-soft`, 4.5, `${status} message text`],
    [status, "surface", 4.5, `${status} text and icons`],
    [status, `${status}-soft`, 3, `${status} message edge`],
  ]),
  ...dataColours.flatMap((data): [string, string, number, string][] => [
    [data, "surface", 3, `${data} marks`],
    [data, "canvas", 3, `${data} marks`],
    ["ink", `${data}-soft`, 4.5, `${data} badge text`],
  ]),
];

describe("theme.css", () => {
  test.each(modes)("every %s colour is inside sRGB", (mode) => {
    for (const [name] of tokens) {
      const channels = toLinearRgb(token(name, mode));
      expect(
        channels.every((v) => v > -0.001 && v < 1.001),
        `--${name} in ${mode}`,
      ).toBe(true);
    }
  });

  describe.each(modes)("in %s mode", (mode) => {
    test.each(pairs)("%s on %s reaches %s:1 (%s)", (fg, bg, minimum) => {
      expect(contrast(token(fg, mode), token(bg, mode))).toBeGreaterThanOrEqual(
        minimum,
      );
    });

    test.each(Object.keys(deficiencies))(
      "categorical colours stay apart with %s",
      (deficiency) => {
        const points = dataColours.map((name) =>
          simulate(token(name, mode), deficiencies[deficiency]),
        );
        let closest = Infinity;
        for (const [i, a] of points.entries()) {
          for (const b of points.slice(i + 1)) {
            closest = Math.min(
              closest,
              Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
            );
          }
        }
        expect(closest).toBeGreaterThanOrEqual(0.06);
      },
    );
  });
});
