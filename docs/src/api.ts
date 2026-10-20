import { loadApi } from "@bhodgson/design-system/starlight/api";
import { Application } from "typedoc";

export const api = await loadApi({
  Application,
  root: process.cwd(),
  entryPoints: ["../src/index.ts"],
  tsconfig: "../tsconfig.json",
  base: "/design-system/api/",
  groups: ["Layout", "Controls", "Feedback", "Text", "Theme", "Utilities"],
});
