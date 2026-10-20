---
"@bhodgson/design-system": minor
---

Every component renders on a server and hydrates without a mismatch, with a test for each. `ThemeToggle` shows the saved theme's icon before any JavaScript loads, and `setTheme` and `applyStoredTheme` do nothing on a server.
