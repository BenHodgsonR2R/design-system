import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { Link } from "./text.tsx";

export type Author = {
  name: string;
  url: string;
  /** The home directory the prompt starts from, such as `~/ben`. */
  home: string;
  /** A square photo, shown small and round. */
  photo?: string;
};

export const defaultAuthor: Author = {
  name: "Ben Hodgson",
  url: "https://github.com/BenHodgsonR2R",
  home: "~/ben",
  photo: "https://avatars.githubusercontent.com/u/116538172?s=96&v=4",
};

type PageProps = {
  /** Can include a `Highlight` for a few words. */
  title: ComponentChildren;
  /** A short label above the title, such as the project name. */
  eyebrow?: string;
  /** Shown as the prompt's working directory, such as `image-tagger`. */
  project?: string;
  description?: ComponentChildren;
  /** Buttons or links under the description. */
  actions?: ComponentChildren;
  /** Extra footer content, such as credits. */
  footer?: ComponentChildren;
  author?: Author;
  children: ComponentChildren;
};

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
  const [topMarker, scrolled] = useScrolledPast();

  return (
    <div class="relative flex min-h-screen flex-col bg-canvas bg-grid font-sans text-ink antialiased">
      <div
        ref={topMarker}
        aria-hidden="true"
        class="pointer-events-none absolute top-0 h-12 w-px"
      />
      <div
        class={`sticky top-0 z-10 transition-[padding] duration-200 ${scrolled ? "px-0 pt-0" : "px-3 pt-3"}`}
      >
        <nav
          class={`mx-auto flex items-center justify-between gap-3 border-line bg-surface/85 font-mono shadow-window backdrop-blur transition-all duration-200 ${scrolled ? "max-w-none border-b px-4 py-1 text-xs" : "max-w-6xl rounded-lg border px-3 py-2 text-sm"}`}
        >
          <a href={author.url} class="group flex items-center gap-2 font-bold">
            {author.photo !== undefined && (
              <img
                src={author.photo}
                alt=""
                class={`rounded-full border border-line-strong object-cover transition-all duration-200 ${scrolled ? "size-6" : "size-8"}`}
              />
            )}
            <span class="sr-only">{author.name}</span>
            <span aria-hidden="true">
              <span class="text-muted">
                {author.home}
                {project !== undefined && "/"}
              </span>
              {project !== undefined && (
                <span class="text-accent">{project}</span>
              )}
              <span class="text-muted"> $</span>
              <span class="ml-1 inline-block h-[1em] w-0.5 animate-caret bg-muted align-middle opacity-0 motion-reduce:hidden" />
            </span>
          </a>
          <a
            href={author.url}
            aria-label={`${author.name} on GitHub`}
            class={`flex items-center gap-1.5 rounded-md border border-b-2 border-line-strong bg-surface font-bold transition hover:border-ink/60 active:translate-y-px active:border-b ${scrolled ? "px-1.5 py-0.5" : "px-2.5 py-1 text-xs"}`}
          >
            <GitHubMark />
            {!scrolled && "GitHub"}
          </a>
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
          <p class="flex flex-wrap items-center gap-x-2">
            Made by <Link href={author.url}>{author.name}</Link>
            <span aria-hidden="true">·</span>
            <a
              class="inline-flex items-center gap-1.5 font-medium hover:text-ink"
              href={author.url}
            >
              <GitHubMark />
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
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
function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 fill-current">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}
