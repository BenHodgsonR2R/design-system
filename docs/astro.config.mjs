import starlight from "@astrojs/starlight";
import { designSystem } from "@bhodgson/design-system/starlight";
import { defineConfig } from "astro/config";
import starlightTypeDoc from "starlight-typedoc";

const apiGroups = [
  "Layout",
  "Controls",
  "Feedback",
  "Text",
  "Theme",
  "Utilities",
];

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
          typeDoc: {
            plugin: ["./typedoc-props.mjs"],
            parametersFormat: "list",
            router: "group",
            sort: ["source-order"],
            groupOrder: [
              "Layout",
              "Controls",
              "Feedback",
              "Text",
              "Theme",
              "*",
            ],
            disableSources: true,
          },
        }),
      ],
      sidebar: [
        { label: "Guides", items: [{ autogenerate: { directory: "guides" } }] },
        {
          label: "API reference",
          collapsed: true,
          items: apiGroups.map((group) => ({
            label: group,
            items: [{ autogenerate: { directory: `api/${group}` } }],
          })),
        },
        {
          label: "Contributing",
          items: [{ autogenerate: { directory: "contributing" } }],
        },
      ],
    }),
  ],
});
