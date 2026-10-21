# @bhodgson/design-system

## 0.2.2

### Patch Changes

- 86aa798: `Select` draws its chevron as an icon beside the text, with room that a `class` can't take away. `class` now applies to a wrapper around the select, for layout. The `select-chevron` utility from 0.2.1 is gone.

## 0.2.1

### Patch Changes

- fa54250: Link the npm page to the docs site.
- 36d07fe: `Select` draws its own chevron in the muted colour, with room beside it, instead of the browser's arrow against the edge, and selects get a pointer cursor like buttons.

## 0.2.0

### Minor Changes

- f41ff58: Make every colour pair meet WCAG AA in light and dark mode, with a test suite that checks it. Add status colours (`danger`, `warning`, `success`, `info`), six colour-blind-safe categorical colours (`data-1` to `data-6`), a `secondary` accent, a `focus` colour and a `surface-sunken` well. Add `Badge` with `dataTone()`, and `ThemeToggle` with `applyStoredTheme()` to pick light, dark or the system theme; `Page` shows the toggle. Add `Tooltip`, which the toggle uses to say what the current theme is and what a click does. `Message` gains `success` and `warning` tones.
- f41ff58: Add text styles as Tailwind utilities: `type-title`, `type-heading`, `type-subheading`, `type-label`, `type-eyebrow` and `type-code`.
- f41ff58: Export a props type for every component, such as `ButtonProps`, and the variant unions they use, such as `ButtonVariant` and `BadgeTone`. Export `Identity`, `Credit`, and `buttonClass` for links that look like buttons. The `Page` footer now reads "<project> is a Ben Hodgson project".
- f41ff58: Add a `prose` text style for long-form content, and `Search`: a search button and results dialog, opened with `/` or ⌘K, that searches with any function you give it.
- f41ff58: Every component renders on a server and hydrates without a mismatch, with a test for each. `ThemeToggle` shows the saved theme's icon before any JavaScript loads, and `setTheme` and `applyStoredTheme` do nothing on a server.
- f41ff58: Add `themeScript`, an inline script that applies the saved theme as a server-rendered page loads. `data-theme` is now always the light or dark in use, and `data-theme-choice` what the reader picked; `applyStoredTheme()`, `setTheme()` and `ThemeToggle` all run the same code.

## 0.1.3

### Patch Changes

- 7892e73: The page menu bar no longer shrinks in place. The full bar scrolls away with the page, and a compact bar slides down from the top, with a slight spring, once the full bar is out of view. A thin line along its bottom edge fills as the page scrolls, in browsers with scroll-driven animations. The menu bar caret blinks with hard on-off steps, like a real caret, and switches off after about five seconds instead of fading.

## 0.1.2

### Patch Changes

- 8a483a7: Quieter page header. The menu bar caret is a thin, muted bar that pulses softly a few times and then fades out, instead of a solid block that blinks and freezes. People who prefer reduced motion see no caret. The title area is smaller and sits on the page background with an accent rule, instead of in a window like the panels. Buttons show the pointer cursor, except when disabled.

## 0.1.1

### Patch Changes

- 433a33a: The caret in the page menu bar blinks six times, then stays steady instead of blinking forever.
