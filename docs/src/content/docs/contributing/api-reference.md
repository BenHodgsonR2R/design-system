---
title: API reference
description: How the API reference is generated from the source, and the conventions it relies on.
---

The API reference is generated from `src/` on every build, so it documents what the code exports and says. `loadApi` from `@bhodgson/docs/api` runs TypeDoc, and each export gets a page.

## Conventions

- **Every export has a doc comment.** Say what it is for and, for types, which components use it. Link to other exports with `{@link Name}`.
- **Every export has a `@group`**, such as `@group Controls`. Groups are the sidebar's sections; `docs/src/api.ts` sets their order.
- **A component's props type is named after it**, such as `ButtonProps` for `Button`. It's shown on the component's page as its props, not on a page of its own. Comment each prop.
- **Variants are named unions**, such as `ButtonVariant`, so the reference can list their values.
- **Add `@example`** with a fenced code block when usage isn't obvious from the props.

Run `pnpm --filter design-system-docs dev` to see the result. The API reference loads once when the server starts, so restart it to see changes to `src/`.
