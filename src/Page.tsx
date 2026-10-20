import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import {
  type Author,
  Credit,
  defaultAuthor,
  GitHubMark,
  Identity,
} from "./author.tsx";
import { cn } from "./cn.ts";
import { ThemeToggle } from "./ThemeToggle.tsx";

/**
 * The props for {@link Page}.
 * @inline
 * @group Layout
 */
export type PageProps = {
  /** The page heading. Can include a {@link Highlight} for a few words. */
  title: ComponentChildren;
  /** A short label above the title, such as the project name. */
  eyebrow?: string;
  /** Shown as the prompt's working directory, such as `image-tagger`, and named in the footer credit. */
  project?: string;
  /** A sentence or two under the title. */
  description?: ComponentChildren;
  /** Buttons or links under the description. */
  actions?: ComponentChildren;
  /** Extra footer content, such as image credits. */
  footer?: ComponentChildren;
  /** Whose site this is. Defaults to {@link defaultAuthor}. */
  author?: Author;
  /** The content, such as {@link Panel}s. */
  children: ComponentChildren;
};

/**
 * The frame for a single-page app: a site bar with the author's {@link Identity} and a {@link ThemeToggle}, a header, your content, and a footer with a {@link Credit}. A compact bar slides in once the site bar scrolls away.
 * @group Layout
 */
export function Page({
  title,
  eyebrow,
  project,
  description,
  actions,
  footer,
  author = defaultAuthor,
  children,
}: PageProps) {
  const [fullBar, scrolled] = useScrolledPast();

  return (
    <div class="flex min-h-screen flex-col bg-canvas bg-grid font-sans text-ink antialiased">
      <div ref={fullBar} class="px-3 pt-3">
        <nav
          aria-label="Site"
          class="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-lg border border-line bg-surface/85 px-3 py-2 font-mono text-sm shadow-window backdrop-blur"
        >
          <Identity author={author} project={project} caret />
          <div class="flex items-center gap-2">
            <ThemeToggle />
            <GitHubLink author={author} labelled />
          </div>
        </nav>
      </div>

      {/* Slides down once the full bar has scrolled away, and back up when it returns.
          It starts 12px above the screen, so the spring's overshoot shows more bar, not a gap. */}
      <div
        inert={!scrolled}
        aria-hidden={!scrolled}
        class={cn(
          "fixed inset-x-0 -top-3 z-20 transition-[translate,opacity] duration-500 ease-spring motion-reduce:transition-none",
          scrolled ? "translate-y-0" : "-translate-y-full opacity-0",
        )}
      >
        <nav
          aria-label="Site, compact"
          class="relative flex items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 pt-4 pb-1 font-mono text-xs shadow-window backdrop-blur"
        >
          <Identity author={author} project={project} compact />
          <div class="flex items-center gap-2">
            <ThemeToggle />
            <GitHubLink author={author} />
          </div>
          <span
            aria-hidden="true"
            class="absolute inset-x-0 bottom-0 h-0.5 scroll-progress bg-accent"
          />
        </nav>
      </div>

      {/* Page-level, so it sits on the canvas rather than in a window like the panels. */}
      <header class="px-3 pt-8 pb-2">
        <div class="mx-auto max-w-6xl border-l-4 border-accent pl-4 sm:pl-5">
          {eyebrow !== undefined && (
            <p class="font-mono text-xs font-semibold tracking-wide text-accent uppercase">
              {eyebrow}
            </p>
          )}
          <h1 class="mt-1 font-mono text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description !== undefined && (
            <div class="mt-2 max-w-2xl leading-relaxed text-muted">
              {description}
            </div>
          )}
          {actions !== undefined && (
            <div class="mt-4 flex flex-wrap gap-3">{actions}</div>
          )}
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl flex-1 px-3 py-6">{children}</main>

      <footer class="px-3 pb-6">
        <div class="mx-auto flex max-w-6xl flex-col gap-3 rounded-xl border border-line bg-surface/70 px-5 py-4 text-sm text-muted">
          {footer}
          <Credit author={author} project={project} />
        </div>
      </footer>
    </div>
  );
}

function GitHubLink({
  author,
  labelled = false,
}: {
  author: Author;
  labelled?: boolean;
}) {
  return (
    <a
      href={author.url}
      aria-label={`${author.name} on GitHub`}
      class={cn(
        "flex items-center gap-1.5 rounded-md border border-b-2 border-line-strong bg-surface font-bold transition hover:border-ink/60 active:translate-y-px active:border-b",
        labelled ? "px-2.5 py-1 text-xs" : "px-1.5 py-0.5",
      )}
    >
      <GitHubMark />
      {labelled && "GitHub"}
    </a>
  );
}

/** Whether the page has scrolled past an element at its top. */
function useScrolledPast() {
  const marker = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(entry !== undefined && !entry.isIntersecting),
    );
    if (marker.current !== null) {
      observer.observe(marker.current);
    }
    return () => observer.disconnect();
  }, []);

  return [marker, scrolled] as const;
}

// GitHub's mark, from Octicons (MIT).
