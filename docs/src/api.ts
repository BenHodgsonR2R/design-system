import { loadApi } from "@bhodgson/docs/api";
import { base } from "./site.ts";

export const api = await loadApi({
  entryPoints: ["../src/index.ts"],
  tsconfig: "../tsconfig.json",
  base: `${base}/api/`,
  groups: [
    "Layout",
    "Navigation",
    "Controls",
    "Feedback",
    "Text",
    "Theme",
    "Utilities",
  ],
});
