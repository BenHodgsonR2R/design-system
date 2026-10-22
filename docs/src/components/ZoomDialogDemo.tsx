import { Button, ZoomDialog } from "@bhodgson/design-system";
import { useState } from "preact/hooks";

export function ZoomDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open the drawing
      </Button>
      <ZoomDialog
        open={open}
        title="A small system"
        onClose={() => setOpen(false)}
      >
        <svg
          viewBox="0 0 400 160"
          role="img"
          aria-label="Three boxes joined by arrows"
        >
          <g fill="none" stroke="currentColor" stroke-width="2">
            <rect x="10" y="50" width="100" height="60" rx="8" />
            <rect x="150" y="50" width="100" height="60" rx="8" />
            <rect x="290" y="50" width="100" height="60" rx="8" />
            <path d="M110 80h40M250 80h40" />
          </g>
          <g
            font-family="monospace"
            font-size="12"
            text-anchor="middle"
            fill="currentColor"
          >
            <text x="60" y="84">
              request
            </text>
            <text x="200" y="84">
              worker
            </text>
            <text x="340" y="84">
              store
            </text>
          </g>
        </svg>
      </ZoomDialog>
    </>
  );
}
