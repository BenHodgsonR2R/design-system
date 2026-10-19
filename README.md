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

Call `applyStoredTheme()` before the first render so a theme picked with `ThemeToggle` applies without a flash. Every component is on the [showcase](https://benhodgsonr2r.github.io/design-system/).

## Develop

```bash
pnpm install
pnpm --filter design-system-example dev   # The showcase, at http://localhost:5173
pnpm test:run
```

Before opening a pull request: `pnpm format && pnpm lint && pnpm typecheck && pnpm knip`, and `pnpm changeset` if the published package changed. Releasing: [docs/releasing.md](docs/releasing.md).
