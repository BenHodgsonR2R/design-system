import { Badge } from "@bhodgson/design-system";
import { useEffect, useState } from "preact/hooks";

// Token, what it's checked against, the WCAG minimum, and what the pair is for.
const rows: [string, string, number, string][] = [
  ["ink", "surface", 4.5, "Body text"],
  ["muted", "surface", 4.5, "Secondary text"],
  ["link", "surface", 4.5, "Links"],
  ["line-strong", "surface", 3, "Control borders"],
  ["line", "surface", 1, "Decorative dividers only"],
  ["focus", "surface", 3, "Focus ring"],
  ["accent", "canvas", 3, "Primary button shape"],
  ["on-accent", "accent", 4.5, "Primary button text"],
  ["secondary", "surface", 4.5, "Secondary accent"],
  ["info", "surface", 4.5, "Info text and icons"],
  ["success", "surface", 4.5, "Success text and icons"],
  ["warning", "surface", 4.5, "Warning text and icons"],
  ["danger", "surface", 4.5, "Danger text and icons"],
  ...[1, 2, 3, 4, 5, 6].map((n): [string, string, number, string] => [
    `data-${n}`,
    "surface",
    3,
    `Categorical colour ${n}`,
  ]),
];

/** Reads a token's colour as the browser draws it, in sRGB. */
function measure(token: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = `var(--${token})`;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();

  const context = new OffscreenCanvas(1, 1).getContext("2d");
  if (context === null) {
    return [0, 0, 0];
  }
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return [r ?? 0, g ?? 0, b ?? 0];
}

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(measure(a)), luminance(measure(b))].toSorted(
    (x, y) => y - x,
  );
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

/** Re-renders when the theme changes, by toggle or by the system setting. */
function useThemeVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    const observer = new MutationObserver(bump);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const media = matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", bump);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", bump);
    };
  }, []);
  return version;
}

export function ColourTable() {
  const version = useThemeVersion();

  return (
    <div class="overflow-x-auto">
      <p class="mb-3 text-sm text-muted">
        Ratios are measured live, for the theme you're viewing.
      </p>
      <table class="w-full text-left text-sm" key={version}>
        <thead class="font-mono text-xs text-muted">
          <tr class="border-b border-line">
            <th class="py-2 pr-3 font-semibold">Token</th>
            <th class="py-2 pr-3 font-semibold">Used for</th>
            <th class="py-2 pr-3 font-semibold">Contrast</th>
            <th class="py-2 font-semibold">WCAG</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([token, against, minimum, use]) => {
            const ratio = contrast(token, against);
            return (
              <tr key={token} class="border-b border-line">
                <td class="py-2 pr-3">
                  <span class="flex items-center gap-2 font-mono text-xs">
                    <span
                      class="size-5 shrink-0 rounded border border-line"
                      style={{ background: `var(--${token})` }}
                    />
                    {token}
                  </span>
                </td>
                <td class="py-2 pr-3">
                  {use}
                  <span class="text-muted"> on {against}</span>
                </td>
                <td class="py-2 pr-3 font-mono text-xs tabular-nums">
                  {ratio.toFixed(2)}:1
                </td>
                <td class="py-2">
                  {minimum === 1 ? (
                    <Badge>exempt</Badge>
                  ) : (
                    <Badge tone={ratio >= minimum ? "success" : "danger"}>
                      {ratio >= minimum ? "pass" : "fail"} {minimum}:1
                    </Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
