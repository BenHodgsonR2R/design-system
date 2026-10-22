import { cn } from "./cn.ts";
import { Link } from "./text.tsx";

/**
 * Who a site belongs to. {@link Page}, {@link Identity} and {@link Credit} show it in the site bar and footer; they use {@link defaultAuthor} unless given another.
 * @example
 * ```tsx
 * <Page author={{ name: "Ada", url: "https://github.com/ada", home: "~/ada" }} title="Docs">
 *   …
 * </Page>
 * ```
 * @group Layout
 */
export type Author = {
  /** Shown in the footer credit, and read out in place of the photo and prompt. */
  name: string;
  /** Where the identity and credit link to, such as a GitHub profile. */
  url: string;
  /** The home directory the prompt starts from, such as `~/ben`. */
  home: string;
  /** A square photo, shown small and round. */
  photo?: string;
};

/**
 * Ben Hodgson, the author every component credits unless given another {@link Author}.
 * @group Layout
 */
export const defaultAuthor: Author = {
  name: "Ben Hodgson",
  url: "https://github.com/bhodgs",
  home: "~/ben",
  photo: "https://avatars.githubusercontent.com/u/116538172?s=96&v=4",
};

/**
 * The props for {@link Identity}.
 * @group Layout
 */
export type IdentityProps = {
  /** Defaults to {@link defaultAuthor}. */
  author?: Author;
  /** Shown as the prompt's working directory, such as `image-tagger`. */
  project?: string;
  /** Where it links to. Defaults to the author's page. */
  href?: string;
  /** A smaller photo, for a compact bar. */
  compact?: boolean;
  /** A blinking caret after the prompt. */
  caret?: boolean;
};

/**
 * The author's photo and a shell prompt in their home directory, such as `~/ben/image-tagger $`. {@link Page} shows it in its site bar.
 * @group Layout
 */
export function Identity({
  author = defaultAuthor,
  project,
  compact = false,
  caret = false,
  href = author.url,
}: IdentityProps) {
  return (
    <a
      href={href}
      class="flex items-center gap-2 font-bold text-ink no-underline"
    >
      {author.photo !== undefined && (
        <img
          src={author.photo}
          alt=""
          class={cn(
            "rounded-full border border-line-strong object-cover",
            compact ? "size-6" : "size-8",
          )}
        />
      )}
      <span class="sr-only">{author.name}</span>
      <span aria-hidden="true">
        <span class="text-muted">
          {author.home}
          {project !== undefined && "/"}
        </span>
        {project !== undefined && <span class="text-accent">{project}</span>}
        <span class="text-muted"> $</span>
        {caret && (
          <span class="ml-1 inline-block h-[1em] w-0.5 animate-caret bg-muted align-[-0.12em] opacity-0 motion-reduce:hidden" />
        )}
      </span>
    </a>
  );
}

/**
 * The props for {@link Credit}.
 * @group Layout
 */
export type CreditProps = {
  /** Defaults to {@link defaultAuthor}. */
  author?: Author;
  /** Without one, it reads "A Ben Hodgson project". */
  project?: string;
};

/**
 * Credits the author, such as "image-tagger is a Ben Hodgson project", with a link to their GitHub. {@link Page} shows it in its footer.
 * @group Layout
 */
export function Credit({ author = defaultAuthor, project }: CreditProps) {
  return (
    <p class="flex flex-wrap items-center gap-x-2">
      <span>
        {project === undefined ? "A" : `${project} is a`}{" "}
        <Link href={author.url}>{author.name}</Link> project
      </span>
      <span aria-hidden="true">·</span>
      <GitHubText author={author} />
    </p>
  );
}

export function GitHubText({ author }: { author: Author }) {
  return (
    <a
      class="inline-flex items-center gap-1.5 font-medium text-inherit no-underline hover:text-ink"
      href={author.url}
    >
      <GitHubMark />
      GitHub
    </a>
  );
}

/**
 * GitHub's mark, from Octicons (MIT), sized to the text and in its colour.
 * @group Utilities
 */
export function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 fill-current">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}
