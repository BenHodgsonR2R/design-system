import { loadApi } from "@bhodgson/starlight/api";

export const api = await loadApi({
  entryPoints: ["../src/index.ts"],
  tsconfig: "../tsconfig.json",
  base: "/design-system/api/",
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
