import { Menu } from "@bhodgson/design-system";

export function MenuDemo() {
  return (
    <div class="flex h-64 w-full justify-end rounded-lg border border-line bg-canvas p-3">
      <Menu
        items={[
          { label: "projects", href: "#" },
          { label: "memos", href: "#", current: true },
          { label: "contact", href: "#", description: "Email or call" },
          { label: "cv", href: "#", download: "cv.pdf" },
        ]}
      />
    </div>
  );
}
