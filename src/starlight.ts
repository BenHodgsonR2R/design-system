import preact from "@astrojs/preact";
import type { StarlightPlugin } from "@astrojs/starlight/types";
import tailwindcss from "@tailwindcss/vite";

/** Styles a Starlight site with the design system, and makes ThemeToggle its theme picker. */
export function designSystem(): StarlightPlugin {
  return {
    name: "@bhodgson/design-system",
    hooks: {
      "config:setup"({ config, updateConfig, addIntegration }) {
        addIntegration(preact());
        addIntegration({
          name: "@bhodgson/design-system/tailwind",
          hooks: {
            "astro:config:setup"({ updateConfig: updateAstroConfig }) {
              updateAstroConfig({ vite: { plugins: [tailwindcss()] } });
            },
          },
        });
        updateConfig({
          customCss: [
            "@bhodgson/design-system/starlight/styles.css",
            ...(config.customCss ?? []),
          ],
          components: {
            ThemeProvider:
              "@bhodgson/design-system/starlight/ThemeProvider.astro",
            ThemeSelect: "@bhodgson/design-system/starlight/ThemeSelect.astro",
            ...config.components,
          },
        });
      },
    },
  };
}
