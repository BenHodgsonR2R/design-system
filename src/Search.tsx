import { useEffect, useId, useRef, useState } from "preact/hooks";
import { cn } from "./cn.ts";
import { Input } from "./fields.tsx";

/**
 * A page that matches a query.
 * @group Navigation
 */
export type SearchResult = {
  url: string;
  title: string;
  /** HTML, with the matching words in `<mark>`. Escape anything else. */
  excerpt: string;
  /** Matching sections of the page. */
  sections?: { url: string; title: string; excerpt: string }[];
};

/**
 * The props for {@link Search}.
 * @group Navigation
 */
export type SearchProps = {
  /** Finds the results for a query. Called as the reader types; earlier calls are ignored once a later one starts. */
  search: (query: string) => Promise<SearchResult[]>;
  /** Shown when the search itself fails, such as when there's no index yet. */
  unavailable?: string;
  class?: string;
};

const markClass =
  "[&_mark]:rounded-sm [&_mark]:bg-highlight-blue [&_mark]:px-0.5 [&_mark]:text-ink";

/**
 * A search button that opens a dialog of results. `/` or ⌘K (Ctrl K) opens it from anywhere on the page, and the arrow keys move through the results.
 * @group Navigation
 */
export function Search({
  search,
  unavailable = "Search isn't available right now.",
  class: extra,
}: SearchProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const titleId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | undefined>();
  const [failed, setFailed] = useState(false);

  const open = () => {
    dialog.current?.showModal();
    dialog.current?.querySelector("input")?.select();
  };

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const typing =
        event.target instanceof HTMLElement &&
        (event.target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName));
      const slash = event.key === "/" && !typing;
      const commandK =
        event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      if (slash || commandK) {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  useEffect(() => {
    let current = true;
    if (query.trim() === "") {
      setResults(undefined);
    } else {
      search(query).then(
        (found) => {
          if (current) {
            setResults(found);
            setFailed(false);
          }
        },
        () => {
          if (current) {
            setFailed(true);
          }
        },
      );
    }
    return () => {
      current = false;
    };
  }, [query, search]);

  const moveFocus = (event: KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }
    const links = [...(list.current?.querySelectorAll("a") ?? [])];
    const index = links.findIndex((link) => link === document.activeElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = links[index + step];
    if (next !== undefined) {
      event.preventDefault();
      next.focus();
    } else if (index === 0 && step === -1) {
      event.preventDefault();
      dialog.current?.querySelector("input")?.focus();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        class={cn(
          "flex h-control w-full max-w-sm items-center gap-2 rounded-md border border-line-strong bg-surface px-2.5 text-sm text-muted transition hover:border-ink/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-focus",
          extra,
        )}
      >
        <SearchIcon />
        <span class="flex-1 text-left">Search</span>
        <kbd class="rounded border border-line bg-surface-sunken px-1.5 type-label">
          /
        </kbd>
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === dialog.current) {
            dialog.current?.close();
          }
        }}
        class="m-auto mt-16 max-h-[calc(100vh-8rem)] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-xl border border-line-strong bg-surface p-0 text-ink shadow-window backdrop:bg-canvas/70 backdrop:backdrop-blur-sm open:flex open:flex-col"
      >
        <div class="flex items-center gap-2 border-b border-line p-3">
          <h2 id={titleId} class="sr-only">
            Search
          </h2>
          <Input
            type="search"
            aria-label="Search"
            placeholder="Search the docs"
            onInput={(event) => setQuery(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                list.current?.querySelector("a")?.focus();
              }
            }}
            class="flex-1"
          />
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            class="rounded-md px-2 py-1 type-label text-muted hover:text-ink"
          >
            Close
          </button>
        </div>

        <div class="overflow-y-auto p-3" onKeyDown={moveFocus}>
          {failed && <p class="p-2 text-sm text-muted">{unavailable}</p>}
          {!failed && results?.length === 0 && (
            <p class="p-2 text-sm text-muted">
              Nothing matches “{query.trim()}”.
            </p>
          )}
          {!failed && results !== undefined && results.length > 0 && (
            <ul ref={list} class="m-0 flex list-none flex-col gap-2 p-0">
              {results.map((result) => (
                <li
                  key={result.url}
                  class="overflow-hidden rounded-lg border border-line"
                >
                  <ResultLink
                    url={result.url}
                    title={result.title}
                    excerpt={result.excerpt}
                    heading
                  />
                  {(result.sections ?? []).map((section) => (
                    <ResultLink
                      key={section.url}
                      url={section.url}
                      title={section.title}
                      excerpt={section.excerpt}
                    />
                  ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}

function ResultLink({
  url,
  title,
  excerpt,
  heading = false,
}: {
  url: string;
  title: string;
  excerpt: string;
  heading?: boolean;
}) {
  return (
    <a
      href={url}
      class={cn(
        "block px-3 py-2.5 no-underline outline-none hover:bg-accent-soft focus-visible:bg-accent-soft",
        heading ? "bg-surface-sunken" : "border-t border-line pl-6",
      )}
    >
      <span class="block type-subheading text-ink">{title}</span>
      {excerpt !== "" && (
        <span
          class={cn("mt-1 block text-sm leading-relaxed text-muted", markClass)}
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}
    </a>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      class="size-4 shrink-0 fill-none stroke-current"
      stroke-width="1.5"
      stroke-linecap="round"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3.5 3.5" />
    </svg>
  );
}
