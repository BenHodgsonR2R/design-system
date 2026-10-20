import starlight from "@astrojs/starlight";
import { docsTheme } from "@bhodgson/docs";
import { apiSidebar } from "@bhodgson/docs/api";
import { defineConfig } from "astro/config";
import { api } from "./src/api.ts";
import { base } from "./src/site.ts";

export default defineConfig({
  site: "https://benhodgsonr2r.github.io",
  base,
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
      plugins: [docsTheme()],
      sidebar: [
        { label: "Guides", items: [{ autogenerate: { directory: "guides" } }] },
        apiSidebar(api),
        {
          label: "Contributing",
          items: [{ autogenerate: { directory: "contributing" } }],
        },
      ],
    }),
  ],
});
