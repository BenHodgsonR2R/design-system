# @bhodgson/design-system

[![npm](https://img.shields.io/npm/v/@bhodgson/design-system)](https://www.npmjs.com/package/@bhodgson/design-system)
[![CI](https://github.com/BenHodgsonR2R/design-system/actions/workflows/continuous-integration.yml/badge.svg?branch=main&event=push)](https://github.com/BenHodgsonR2R/design-system/actions/workflows/continuous-integration.yml?query=branch%3Amain)
[![License: MIT](https://img.shields.io/npm/l/@bhodgson/design-system)](LICENSE)

My design system: Tailwind CSS theme tokens, Preact components and a page layout.

## Use it

```bash
pnpm add @bhodgson/design-system preact
```

Import the theme after Tailwind in your stylesheet:

```css
@import "tailwindcss";
@import "@bhodgson/design-system/theme.css";
```

Then use the components:

```tsx
import { Button, Highlight, Page, Panel } from "@bhodgson/design-system";

<Page
  eyebrow="playground"
  project="my-project"
  title={
    <>
      A <Highlight>new</Highlight> project
    </>
  }
>
  <Panel id="hello" title="Hello">
    <Button>Get started</Button>
  </Panel>
</Page>;
```

`cn()` joins classes the way the components do, so yours replace theirs cleanly.

Guides, live examples and the API reference are on the [docs site](https://benhodgsonr2r.github.io/design-system/). Its source is in [docs/](docs/), and [`@bhodgson/starlight`](starlight/) styles any Starlight site the same way.

Call `applyStoredTheme()` before the first render, or put `themeScript` in `<head>` on server-rendered pages, so a theme picked with `ThemeToggle` applies without a flash.

## Develop

```bash
pnpm install
pnpm build && pnpm --filter @bhodgson/starlight build
pnpm --filter design-system-docs dev   # The docs site, at http://localhost:4321/design-system/
pnpm test:run
```

Before opening a pull request: `pnpm format && pnpm lint && pnpm typecheck && pnpm knip`, and `pnpm changeset` if the published package changed. Releasing: [docs/src/content/docs/contributing/releasing.md](docs/src/content/docs/contributing/releasing.md).
