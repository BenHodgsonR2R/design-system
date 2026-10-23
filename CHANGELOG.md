# @bhodgson/design-system

## 0.6.0

### Minor Changes

- 67350ed: - `prose` colours code highlighted by Shiki for the page's theme, when Shiki is given a light and a dark theme and `defaultColor: false`. Code blocks keep the sunken surface rather than the Shiki theme's background.
  - An open `Disclosure` marks its edge with an inset bar rather than a wider border, so what's inside no longer shifts when it opens.
  - New `PageHeader`: the eyebrow, title, description and actions that head a `Page`, with its accent bar, for pages laid out some other way. `Page` uses it.
  - Titles, headings and `prose` headings balance their lines, and `prose` paragraphs and page descriptions avoid a last line of one word.
  - New `cardClass`: the surface, border and shadow `LinkCard` is built on, for cards of your own. `interactive: true` makes it lift on hover and show the focus ring, for a card that's a link.
  - Every focusable element gets the `focus` ring by default, rather than the browser's own; components that style their own focus keep it.
  - New `edge` colour, between `line` and `line-strong`, for the outline of cards and windows so they hold their own against the grid. `cardClass`, `LinkCard`, `Disclosure`, `Panel` and `Terminal` use it.
  - The command bar's prompt and form fields show their placeholder in `muted`, which meets contrast, rather than a faded copy of it.

## 0.5.0

### Minor Changes

- dd0757a: The command bar hints like a shell. The prompt colours what's typed, with the command in the accent colour and an unknown one in red, and shows what Tab would complete to faded after it, as in fish; Tab or → at the end takes it. With no completion from the command, a prefix of exactly one command's name completes to it. The output no longer repeats the command, and starts under the prompt, as a terminal's does. In `help`, a usage's `<placeholders>` and `|` choices are muted. In a string `message`, and in a command's `description`, text in backticks is shown as a command, or as a key when it names one, such as `Enter`.

### Patch Changes

- a686e39: The command bar clears its prompt once Enter runs a command, as a terminal does, so a command that stays on the page, such as one that goes to a `#hash`, leaves the prompt ready for the next.
- 8959215: `Menu` opens under its button inside a flex parent that stretches its items, rather than at the bottom of the parent.

## 0.4.0

### Minor Changes

- bf4fce8: Adds `Menu`, a hamburger menu for headers that run out of room. It holds whatever it's given, styling links and marking the one with `aria-current="page"`. Its lines fold into a cross as it opens and what it holds drops in one after another; it closes on Escape, an outside click, tabbing out or choosing a link, and the arrow keys, Home and End move between what's inside.

## 0.3.2

### Patch Changes

- 470a3ee: On phones, the command bar's prompt shows only the last folder of its working directory, trimmed with an ellipsis when it's long, so a long path no longer runs under the bar's links.

## 0.3.1

### Patch Changes

- cbf77bf: The GitHub account is now `bhodgs`: `defaultAuthor` links to https://github.com/bhodgs, and the package links point at the renamed repository and docs site.

## 0.3.0

### Minor Changes

- 853859a: New components:

  - `CommandBar`: a sticky site bar whose prompt runs your commands and searches for anything else.
  - `ZoomDialog`: a full-screen view that zooms and pans, for detailed drawings and images.
  - `Disclosure`: a card that opens to show more, and forms an accordion with others of the same `name`.
  - `Steps`, `Annotation`, `Stats` and `Facts`, for writing about a project.
  - `Breadcrumbs` and `LinkCard`, for getting around.
  - `Footer`, `Copyright` and `Terminal`, for laying out pages yourself.

  Also new: `GitHubMark`, an `accent` tone for `Highlight`, and a `text-halo` utility. `cn()` now keeps a background colour alongside `bg-grid`. `Page`'s footer is now a `Footer`, and looks the same.

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
