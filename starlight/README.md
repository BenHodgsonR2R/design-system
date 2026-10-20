# @bhodgson/starlight

[Starlight](https://starlight.astro.build) in [`@bhodgson/design-system`](../README.md), with an API reference generated from a package's source.

```bash
pnpm add @bhodgson/starlight @bhodgson/design-system @astrojs/starlight @astrojs/preact astro preact
```

```js
// astro.config.mjs
import starlight from "@astrojs/starlight";
import { designSystem } from "@bhodgson/starlight";

export default defineConfig({
  integrations: [starlight({ title: "my-project", plugins: [designSystem()] })],
});
```

For the API reference, see how [the design system's docs](../docs/src/api.ts) use `loadApi`, `apiSidebar` and `apiPaths`, and [the conventions it relies on](../docs/src/content/docs/contributing/api-reference.md): a `@group` on every export, and props types named after their component, such as `ButtonProps`.
