import { type Command, CommandBar } from "@bhodgson/design-system";

const pages = [
  { url: "#buttons", title: "Buttons", label: "./buttons" },
  { url: "#fields", title: "Fields", label: "./fields" },
  { url: "#messages", title: "Messages", label: "./messages" },
];

const commands: Command[] = [
  {
    name: "ls",
    description: "list the pages",
    run: () => ({ results: pages }),
  },
  {
    name: "cd",
    usage: "cd <page>",
    description: "open a page",
    run: (args) => {
      const matches = pages.filter(({ label }) =>
        label.slice(2).startsWith(args),
      );
      if (matches.length === 0) {
        return { message: `cd: no such page: ${args}`, tone: "error" };
      }
      return {
        results: matches,
        complete:
          matches.length === 1 ? `cd ${matches[0].label.slice(2)}` : undefined,
      };
    },
  },
];

const search = async (query: string) =>
  pages.filter(({ title }) =>
    title.toLowerCase().includes(query.toLowerCase()),
  );

export function CommandBarDemo() {
  return (
    <div class="relative h-72 w-full overflow-hidden rounded-lg border border-line bg-canvas">
      <CommandBar
        commands={commands}
        search={search}
        cwd="docs"
        home="#"
        class="static"
      />
    </div>
  );
}
