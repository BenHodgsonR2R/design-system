import type { ComponentChildren } from "preact";
import { type Author, defaultAuthor, GitHubText } from "./author.tsx";
import { cn } from "./cn.ts";

/**
 * The props for {@link Footer}.
 * @group Layout
 */
export type FooterProps = {
  /** Links on the right, such as the site's main pages. */
  links?: { label: string; href: string }[];
  /** Sets its width, such as `max-w-7xl`. Defaults to `max-w-6xl`, with a margin either side on narrow screens. */
  class?: string;
  /** Such as a {@link Credit} or {@link Copyright}. */
  children: ComponentChildren;
};

/**
 * A page's closing card, with your content on the left and links on the right. {@link Page} uses it.
 * @group Layout
 */
export function Footer({ links = [], class: extra, children }: FooterProps) {
  return (
    <footer
      class={cn(
        "mx-auto mb-6 flex w-[calc(100%-1.5rem)] max-w-6xl flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface/70 px-5 py-4 text-sm text-muted",
        extra,
      )}
    >
      <div class="flex flex-col gap-3">{children}</div>
      {links.length > 0 && (
        <nav aria-label="Footer" class="flex gap-4 font-mono text-xs font-bold">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              class="text-ink no-underline hover:text-link"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </footer>
  );
}

/**
 * The props for {@link Copyright}.
 * @group Layout
 */
export type CopyrightProps = {
  /** Defaults to {@link defaultAuthor}. */
  author?: Author;
  /** Defaults to this year. */
  year?: number;
};

/**
 * "© 2026 Ben Hodgson · GitHub", for a personal site's {@link Footer}, where {@link Credit}'s "a Ben Hodgson project"
 * would repeat what the site already says.
 * @group Layout
 */
export function Copyright({
  author = defaultAuthor,
  year = new Date().getFullYear(),
}: CopyrightProps) {
  return (
    <p class="flex flex-wrap items-center gap-x-2">
      <span>
        © {year} {author.name}
      </span>
      <span aria-hidden="true">·</span>
      <GitHubText author={author} />
    </p>
  );
}
