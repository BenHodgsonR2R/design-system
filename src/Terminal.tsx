import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";
import { type Author, defaultAuthor } from "./author.tsx";

/**
 * The props for {@link Terminal}.
 * @group Layout
 */
export type TerminalProps = {
  /** The command in the title bar, such as `cat contact`. */
  command: string;
  /** Defaults to {@link defaultAuthor}, whose home directory the prompt starts from. */
  author?: Author;
  /** A directory under the author's home, such as `work`. */
  cwd?: string;
  children: ComponentChildren;
};

/**
 * A window whose title bar is a shell prompt, such as `~/ben $ cat contact`, with the command's output inside. Set in
 * the mono font, for short facts like contact details.
 * @group Layout
 */
export function Terminal({
  command,
  author = defaultAuthor,
  cwd,
  children,
}: TerminalProps) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      class="overflow-hidden rounded-xl border border-line-strong bg-surface shadow-window"
    >
      <h2
        id={id}
        class="border-b border-line bg-canvas/60 px-4 py-2.5 font-mono text-xs text-muted"
      >
        {author.home}
        {cwd !== undefined && `/${cwd}`} ${" "}
        <span class="text-ink">{command}</span>
      </h2>
      <div class="p-4 font-mono text-sm">{children}</div>
    </section>
  );
}
