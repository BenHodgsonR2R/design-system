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
            "@bhodgson/starlight/styles.css",
            ...(config.customCss ?? []),
          ],
          components: {
            ThemeProvider: "@bhodgson/starlight/components/ThemeProvider.astro",
            ThemeSelect: "@bhodgson/starlight/components/ThemeSelect.astro",
            SiteTitle: "@bhodgson/starlight/components/SiteTitle.astro",
            Footer: "@bhodgson/starlight/components/Footer.astro",
            Hero: "@bhodgson/starlight/components/Hero.astro",
            Pagination: "@bhodgson/starlight/components/Pagination.astro",
            MarkdownContent:
              "@bhodgson/starlight/components/MarkdownContent.astro",
            PageTitle: "@bhodgson/starlight/components/PageTitle.astro",
            Search: "@bhodgson/starlight/components/Search.astro",
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
