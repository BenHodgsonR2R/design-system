---
title: Server rendering
description: How components stay safe to render on a server and hydrate in the browser.
---

Every component renders on a server, as the pages of this site do, and hydrates in the browser without a mismatch. Preact doesn't warn about mismatches: when it hydrates, it keeps the server's attributes, so a component that renders differently in the browser shows a mix of both.

## Rules

- **The first render is the same on the server and in the browser.** Don't read `localStorage`, `window`, `matchMedia`, the date or random numbers while rendering or in a `useState` default. Read them after mounting: in `useLayoutEffect` when they change what's drawn, otherwise in `useEffect`.
- **Browser APIs belong in effects and event handlers.** Exported functions that touch the page, such as `setTheme`, do nothing on a server.
- **IDs come from `useId`**, which matches on the server and in the browser.
- **When saved state changes the first paint, use a small inline script.** `themeScript` is the one for the theme: it sets `data-theme` and `data-theme-choice` on the page as it loads, so CSS draws the right theme and toggle icon before any JavaScript runs. `ThemeToggle` renders it too, and `applyStoredTheme()` runs the same code.

## Tests

`src/hydration.test.tsx` checks every component. It renders each one on the server, with no browser APIs available, then hydrates that HTML in a browser whose saved state differs, and expects the same HTML as rendering in the browser alone. Add new components to its list.
