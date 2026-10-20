import type { ComponentChildren } from "preact";

export type PanelProps = {
  /** The title's id, so the panel can be linked to. */
  id: string;
  title: string;
  /** Buttons or links on the right of the title bar. */
  actions?: ComponentChildren;
  children: ComponentChildren;
};

/** A window: a title bar over the content. */
export function Panel({ id, title, actions, children }: PanelProps) {
  return (
    <section
      class="overflow-hidden rounded-xl border border-line-strong bg-surface shadow-window"
      aria-labelledby={id}
    >
      <header class="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-canvas/60 px-4 py-2.5">
        <h2 id={id} class="font-mono text-sm font-bold">
          {title}
        </h2>
        {actions !== undefined && (
          <div class="flex flex-wrap gap-2">{actions}</div>
        )}
      </header>
      <div class="p-4">{children}</div>
    </section>
  );
}
