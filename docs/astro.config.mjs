import starlight from "@astrojs/starlight";
import { designSystem } from "@bhodgson/design-system/starlight";
import { defineConfig } from "astro/config";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

export default defineConfig({
  site: "https://benhodgsonr2r.github.io",
  base: "/design-system",
  integrations: [
    starlight({
      title: "design-system",
      description:
        "Tailwind CSS theme tokens, Preact components and a page layout, with every colour pair meeting WCAG AA.",
      favicon: "/favicon.png",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/BenHodgsonR2R/design-system",
        },
      ],
      editLink: {
        baseUrl:
          "https://github.com/BenHodgsonR2R/design-system/edit/main/docs/",
      },
      plugins: [
        designSystem(),
        starlightTypeDoc({
          entryPoints: ["../src/index.ts"],
          tsconfig: "../tsconfig.json",
          output: "api",
          sidebar: { label: "API reference", collapsed: true },
          typeDoc: {
            plugin: ["./typedoc-props.mjs"],
            parametersFormat: "table",
            disableSources: true,
          },
        }),
      ],
      sidebar: [
        { label: "Guides", items: [{ autogenerate: { directory: "guides" } }] },
        typeDocSidebarGroup,
        {
          label: "Contributing",
          items: [{ autogenerate: { directory: "contributing" } }],
        },
      ],
    }),
  ],
});
