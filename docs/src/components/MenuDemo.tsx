import { Menu } from "@bhodgson/design-system";

export function MenuDemo() {
  return (
    <div class="flex h-64 w-full justify-end rounded-lg border border-line bg-canvas p-3">
      <Menu>
        <a href="#">projects</a>
        <a href="#" aria-current="page">
          memos
        </a>
        <a href="#">contact</a>
        <a href="#" download="cv.pdf">
          cv
        </a>
      </Menu>
    </div>
  );
}
