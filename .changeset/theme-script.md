---
"@bhodgson/design-system": minor
---

Add `themeScript`, an inline script that applies the saved theme as a server-rendered page loads. `data-theme` is now always the light or dark in use, and `data-theme-choice` what the reader picked; `applyStoredTheme()`, `setTheme()` and `ThemeToggle` all run the same code.
