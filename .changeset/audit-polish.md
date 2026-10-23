---
"@bhodgson/design-system": minor
---

- `prose` colours code highlighted by Shiki for the page's theme, when Shiki is given a light and a dark theme and `defaultColor: false`. Code blocks keep the sunken surface rather than the Shiki theme's background.
- An open `Disclosure` marks its edge with an inset bar rather than a wider border, so what's inside no longer shifts when it opens.
- New `PageHeader`: the eyebrow, title, description and actions that head a `Page`, with its accent bar, for pages laid out some other way. `Page` uses it.
- Titles, headings and `prose` headings balance their lines, and `prose` paragraphs and page descriptions avoid a last line of one word.
- New `cardClass`: the surface, border and shadow `LinkCard` is built on, for cards of your own. `interactive: true` makes it lift on hover and show the focus ring, for a card that's a link.
