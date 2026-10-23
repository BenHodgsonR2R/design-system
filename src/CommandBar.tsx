import type { ComponentChildren } from "preact";
import { useEffect, useId, useRef, useState } from "preact/hooks";
import { type Author, defaultAuthor } from "./author.tsx";
import { cn } from "./cn.ts";
import { ThemeToggle } from "./ThemeToggle.tsx";

/**
 * A page that a {@link Command} or a {@link CommandBar} search lists.
 * @group Navigation
 */
export type CommandResult = {
  url: string;
  title: string;
  /** Shown before the title in the accent colour, such as `./place-images`. */
  label?: string;
  /** HTML, with the matching words in `<mark>`. Escape anything else. */
  excerpt?: string;
};

/**
 * What a {@link Command} prints below the bar.
 * @group Navigation
 */
export type CommandOutput = {
  /** Pages to choose from. The arrow keys move through them and Enter opens one. */
  results?: CommandResult[];
  /** A line of output, shown when there are no results. In a string, text in backticks is shown as a command, or as a key when it names one, such as `Enter`. */
  message?: ComponentChildren;
  /** Defaults to `muted`. */
  tone?: "muted" | "error";
  /** Where Enter goes, instead of the chosen result. */
  go?: string;
  /** What Tab completes the input to. Shown after what's typed, faded, while it still starts with it. */
  complete?: string;
};

/**
 * A command the {@link CommandBar} runs when the input starts with its name.
 * @example
 * ```tsx
 * const cd: Command = {
 *   name: "cd",
 *   usage: "cd <project>",
 *   description: "open a project",
 *   run: (args) => ({ results: projects.filter((p) => p.slug.startsWith(args)) }),
 * };
 * ```
 * @group Navigation
 */
export type Command = {
  name: string;
  /** How `help` shows it, such as `cd <project>`. Defaults to the name. */
  usage?: string;
  /** What `help` says it does. Backticks work as in {@link CommandOutput.message}. */
  description: string;
  /** Called as the reader types, with everything after the name. */
  run: (args: string) => CommandOutput;
};

/**
 * The props for {@link CommandBar}.
 * @group Navigation
 */
export type CommandBarProps = {
  commands?: Command[];
  /** Searches for anything that isn't a command. Called as the reader types; earlier calls are ignored once a later one starts. */
  search?: (query: string) => Promise<CommandResult[]>;
  /** Shown when the search fails. A function gets the error, so different failures can say different things. */
  unavailable?: ComponentChildren | ((error: unknown) => ComponentChildren);
  /** Defaults to {@link defaultAuthor}. */
  author?: Author;
  /** Shown as the prompt's working directory, such as the section being read. */
  cwd?: string;
  /** Where the author's photo links to. Defaults to `/`. */
  home?: string;
  /** Defaults to "search, or type help", or "type help" without a search. */
  placeholder?: string;
  /** Links or buttons beside the {@link ThemeToggle}. */
  actions?: ComponentChildren;
  class?: string;
};

type Parsed =
  | { kind: "help" }
  | { kind: "command"; command: Command; args: string }
  | { kind: "search"; term: string }
  | { kind: "unknown"; name: string };

type SearchState =
  | { status: "idle" | "searching" }
  | { status: "done"; results: CommandResult[] }
  | { status: "failed"; error: unknown };

const markClass =
  "[&_mark]:rounded-sm [&_mark]:bg-highlight-blue [&_mark]:px-0.5 [&_mark]:text-ink";

/**
 * A sticky site bar whose prompt is a real input: it runs your {@link Command}s and searches for anything else,
 * printing the output below the bar like a terminal. `help` lists the commands. `/` or ⌘K (Ctrl K) focuses it from
 * anywhere on the page, the arrow keys move through results, Enter opens one and Escape clears. As in fish, what Tab
 * would complete to shows faded after what's typed, and Tab or → at the end takes it.
 * @group Navigation
 */
export function CommandBar({
  commands = [],
  search,
  unavailable = "search isn't available right now",
  author = defaultAuthor,
  cwd,
  home = "/",
  placeholder = search === undefined ? "type help" : "search, or type help",
  actions,
  class: extra,
}: CommandBarProps) {
  const folders = cwd?.split("/") ?? [];
  const folder = folders.pop();
  const parents = folders.join("/");
  const input = useRef<HTMLInputElement>(null);
  const prompt = useRef<HTMLLabelElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState<SearchState>({ status: "idle" });
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const parsed = parse(query, commands, search !== undefined);
  const output: CommandOutput =
    parsed?.kind === "command"
      ? parsed.command.run(parsed.args)
      : parsed?.kind === "search" && searched.status === "done"
        ? { results: searched.results }
        : {};
  const results = output.results ?? [];
  const suggestion = suggest(query, output.complete, commands);

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
        input.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", shortcut);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", shortcut);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);

  const term = parsed?.kind === "search" ? parsed.term : "";
  useEffect(() => {
    setActive(0);
    let current = true;
    if (term === "" || search === undefined) {
      setSearched({ status: "idle" });
    } else {
      setSearched({ status: "searching" });
      search(term).then(
        (found) => current && setSearched({ status: "done", results: found }),
        (error: unknown) => current && setSearched({ status: "failed", error }),
      );
    }
    return () => {
      current = false;
    };
  }, [term, search]);

  // Long input scrolls, so what's drawn under it scrolls with it.
  const followScroll = () => {
    if (typed.current !== null && input.current !== null) {
      typed.current.scrollLeft = input.current.scrollLeft;
    }
  };
  useEffect(followScroll);

  // Uncontrolled, so the server's HTML hydrates as is.
  const replaceQuery = (value: string) => {
    if (input.current !== null) {
      input.current.value = value;
    }
    setQuery(value);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      replaceQuery("");
      input.current?.blur();
    } else if (
      suggestion !== undefined &&
      (event.key === "Tab" ||
        (event.key === "ArrowRight" &&
          input.current?.selectionStart === query.length))
    ) {
      event.preventDefault();
      replaceQuery(suggestion);
    } else if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setActive((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setActive((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      const target = output.go ?? results[active]?.url;
      if (target !== undefined) {
        // Like a terminal, so a command that stays on the page, such as a #hash, leaves the prompt ready for the next.
        replaceQuery("");
        window.location.assign(target);
      }
    }
  };

  const showing = open && parsed !== undefined;
  const listId = `${id}-list`;

  return (
    <nav
      aria-label="Site"
      class={cn(
        "sticky top-0 z-30 h-11 border-b border-line bg-surface/90 backdrop-blur",
        extra,
      )}
    >
      <div
        ref={root}
        class="relative flex h-full items-center gap-2 px-3 sm:gap-3 sm:px-4"
      >
        <a href={home} class="shrink-0">
          {author.photo === undefined ? (
            <span class="font-mono text-sm font-bold">{author.name}</span>
          ) : (
            <img
              src={author.photo}
              alt={author.name}
              class="size-7 rounded-full border border-line-strong object-cover"
            />
          )}
        </a>
        <label
          ref={prompt}
          class="flex min-w-0 flex-1 items-center gap-2 font-mono text-sm font-bold"
          htmlFor={`${id}-input`}
        >
          {/* On phones, only the last folder shows, trimmed to leave the input some room. */}
          <span
            aria-hidden="true"
            class="flex min-w-0 items-center max-sm:max-w-[60%]"
          >
            {cwd === undefined ? (
              <span class="shrink-0 text-muted">{author.home}</span>
            ) : (
              <>
                <span class="hidden shrink-0 text-muted sm:inline">
                  {author.home}/
                </span>
                {parents !== "" && (
                  <span class="hidden shrink-0 text-accent sm:inline">
                    {parents}/
                  </span>
                )}
                <span class="truncate text-accent">{folder}</span>
              </>
            )}
            <span class="shrink-0 whitespace-pre text-muted"> $</span>
          </span>
          <span class="sr-only">{placeholder}</span>
          <span class="relative flex min-w-0 flex-1">
            {/* What's typed, coloured, and the suggestion after it, drawn under the input, whose own text is clear. */}
            {query !== "" && (
              <span
                ref={typed}
                aria-hidden="true"
                class="pointer-events-none absolute inset-0 overflow-hidden font-normal whitespace-pre"
              >
                {parsed?.kind === "search" ? (
                  <span class="text-ink">{query}</span>
                ) : (
                  <Typed text={query} known={parsed?.kind !== "unknown"} />
                )}
                {suggestion !== undefined && (
                  <span data-suggestion class="text-muted/60">
                    {suggestion.slice(query.length)}
                  </span>
                )}
              </span>
            )}
            <input
              ref={input}
              id={`${id}-input`}
              type="text"
              role="combobox"
              aria-expanded={showing}
              aria-controls={listId}
              aria-activedescendant={
                showing && results[active] !== undefined
                  ? `${id}-${active}`
                  : undefined
              }
              autocomplete="off"
              autocapitalize="off"
              // A string, so server rendering writes it out rather than dropping a false attribute.
              {...{ spellcheck: "false" as unknown as boolean }}
              placeholder={placeholder}
              onInput={(event) => {
                setQuery(event.currentTarget.value);
                setActive(0);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              onScroll={followScroll}
              class={cn(
                "relative min-w-0 flex-1 bg-transparent font-mono text-sm font-normal caret-accent outline-none placeholder:text-muted/60",
                query === "" ? "text-ink" : "text-transparent",
              )}
            />
          </span>
        </label>
        {actions}
        <ThemeToggle />

        {showing && (
          <div
            data-output
            // Under the prompt, as a terminal prints its output.
            style={{ paddingLeft: prompt.current?.offsetLeft }}
            class="absolute inset-x-0 top-full border-b border-line bg-surface pt-1 pr-4 pb-4 font-mono text-sm shadow-window"
          >
            <div class="max-w-3xl">
              {parsed.kind === "help" ? (
                <Help commands={commands} searches={search !== undefined} />
              ) : parsed.kind === "unknown" ? (
                <Line tone="error">
                  command not found: {parsed.name}.{" "}
                  <span class="text-muted">
                    Try <Typed text="help" />
                  </span>
                </Line>
              ) : parsed.kind === "search" && searched.status === "failed" ? (
                <Line>
                  {typeof unavailable === "function"
                    ? unavailable(searched.error)
                    : unavailable}
                </Line>
              ) : results.length > 0 ? (
                <Results
                  id={id}
                  listId={listId}
                  results={results}
                  active={active}
                  onHover={setActive}
                />
              ) : output.message !== undefined ? (
                <Line tone={output.tone}>{output.message}</Line>
              ) : parsed.kind === "search" ? (
                <Line>
                  {searched.status === "done" ? "no matches" : "searching…"}
                </Line>
              ) : null}
            </div>
          </div>
        )}
      </div>
      <span
        aria-hidden="true"
        class="absolute inset-x-0 bottom-0 h-0.5 scroll-progress bg-accent"
      />
    </nav>
  );
}

function parse(
  query: string,
  commands: Command[],
  searches: boolean,
): Parsed | undefined {
  const trimmed = query.trim();
  const [name = ""] = trimmed.split(/\s+/);
  if (name === "") {
    return undefined;
  }
  const command = commands.find((candidate) => candidate.name === name);
  if (command !== undefined) {
    return {
      kind: "command",
      command,
      args: trimmed.slice(name.length).trim(),
    };
  }
  if (name === "help") {
    return { kind: "help" };
  }
  return searches
    ? { kind: "search", term: trimmed }
    : { kind: "unknown", name };
}

/** What Tab would complete `query` to: the command's own completion, or else the one command whose name it starts. */
function suggest(
  query: string,
  complete: string | undefined,
  commands: Command[],
): string | undefined {
  if (query === "") {
    return undefined;
  }
  if (complete !== undefined) {
    return complete.startsWith(query) && complete !== query
      ? complete
      : undefined;
  }
  if (/\s/.test(query)) {
    return undefined;
  }
  const names = [
    ...commands.map(({ name, usage }) =>
      usage === undefined || usage === name ? name : `${name} `,
    ),
    "help",
  ].filter((name) => name.startsWith(query) && name.trim() !== query);
  return names.length === 1 ? names[0] : undefined;
}

const keys = new Set(["Enter", "Tab", "Escape", "Esc", "→", "↑", "↓"]);

/** A string with its backticked parts shown as commands, or as keys when they name one. */
function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split(/`([^`]+)`/).map((part, index) =>
        index % 2 === 0 ? (
          part
        ) : keys.has(part) ? (
          <kbd
            key={index}
            class="rounded border border-line-strong px-1 font-mono text-xs text-ink"
          >
            {part}
          </kbd>
        ) : (
          <Typed key={index} text={part} />
        ),
      )}
    </>
  );
}

/** A command line, coloured as a shell would: the command, its arguments, and the `<placeholders>` and `|` between choices in a usage. */
function Typed({ text, known = true }: { text: string; known?: boolean }) {
  const [name = "", ...rest] = text.split(/(\s+)/);
  return (
    <span class="font-mono">
      <span class={known ? "text-accent" : "text-danger"}>{name}</span>
      {rest
        .join("")
        .split(/(<[^>]+>|\|)/)
        .map((part, index) =>
          part.startsWith("<") ? (
            <span key={index} class="text-muted italic">
              {part}
            </span>
          ) : part === "|" ? (
            <span key={index} class="text-muted">
              |
            </span>
          ) : (
            <span key={index} class="text-ink">
              {part}
            </span>
          ),
        )}
    </span>
  );
}

function Help({
  commands,
  searches,
}: {
  commands: Command[];
  searches: boolean;
}) {
  const rows = [
    ...commands.map(({ name, usage, description }) => [
      usage ?? name,
      description,
    ]),
    ["help", "show this help"],
  ];
  return (
    <dl class="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
      {rows.map(([usage, description]) => (
        <div key={usage} class="contents">
          <dt>
            <Typed text={usage} />
          </dt>
          <dd class="font-sans text-muted">
            <Marked text={description} />
          </dd>
        </div>
      ))}
      {searches && (
        <div class="contents">
          <dt class="text-muted italic">anything else</dt>
          <dd class="font-sans text-muted">search</dd>
        </div>
      )}
    </dl>
  );
}

function Line({
  tone = "muted",
  children,
}: {
  tone?: CommandOutput["tone"];
  children: ComponentChildren;
}) {
  return (
    <p class={cn("mt-2", tone === "error" ? "text-danger" : "text-muted")}>
      {typeof children === "string" ? <Marked text={children} /> : children}
    </p>
  );
}

function Results({
  id,
  listId,
  results,
  active,
  onHover,
}: {
  id: string;
  listId: string;
  results: CommandResult[];
  active: number;
  onHover: (index: number) => void;
}) {
  return (
    <ul id={listId} role="listbox" class="mt-2 -ml-2 flex flex-col">
      {results.map((result, index) => (
        <li
          key={result.url}
          id={`${id}-${index}`}
          role="option"
          aria-selected={index === active}
        >
          <a
            href={result.url}
            onMouseEnter={() => onHover(index)}
            class={cn(
              "block rounded-md px-2 py-1.5 no-underline",
              index === active && "bg-accent-soft",
            )}
          >
            {result.label !== undefined && (
              <span class="mr-3 text-accent">{result.label}</span>
            )}
            <span class="font-sans font-semibold text-ink">{result.title}</span>
            {result.excerpt !== undefined && (
              <span
                class={cn(
                  "mt-0.5 block font-sans text-xs leading-relaxed text-muted",
                  markClass,
                )}
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
