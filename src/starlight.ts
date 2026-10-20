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
            SiteTitle: "@bhodgson/design-system/starlight/SiteTitle.astro",
            Footer: "@bhodgson/design-system/starlight/Footer.astro",
            ...config.components,
          },
          expressiveCode: {
            styleOverrides: {
              borderRadius: "0.5rem",
              borderColor: "var(--line)",
              codeBackground: "var(--surface-sunken)",
              codeFontFamily: "var(--font-mono)",
              uiFontFamily: "var(--font-mono)",
              frames: {
                editorTabBarBackground: "var(--surface)",
                terminalTitlebarBackground: "var(--surface)",
                frameBoxShadowCssValue: "none",
              },
            },
            ...(typeof config.expressiveCode === "object"
              ? config.expressiveCode
              : {}),
          },
        });
      },
    },
  };
}
