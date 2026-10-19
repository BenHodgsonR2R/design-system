import { fileURLToPath } from "node:url";
import preactPreset from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [preactPreset(), tailwindcss()],
  resolve: {
    alias: {
      // Exactly "@bhodgson/design-system", so "/theme.css" still resolves through the package.
      "@bhodgson/design-system$": fileURLToPath(
        new URL("../src/index.ts", import.meta.url),
      ),
    },
  },
});
