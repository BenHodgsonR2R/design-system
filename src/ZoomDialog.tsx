import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";

/**
 * The props for {@link ZoomDialog}.
 * @group Feedback
 */
export type ZoomDialogProps = {
  open: boolean;
  /** Shown in the title bar, and read out as the dialog's name. */
  title: string;
  /** Called when the reader closes it: Close, Escape, or a click outside. */
  onClose: () => void;
  /** How far it zooms in. Defaults to 5. */
  maxScale?: number;
  /** What to show, fitted to the width, such as an `<img>` or `<svg>`. */
  children: ComponentChildren;
};

type Point = { x: number; y: number };
type View = { scale: number; x: number; y: number };

const doubleTapScale = 2.5;

/**
 * A full-screen dialog that zooms and pans its content like a photo: pinch, drag, double-tap, or the mouse wheel. For
 * drawings and images too detailed to read at the page's width.
 * @group Feedback
 */
export function ZoomDialog({
  open,
  title,
  onClose,
  maxScale = 5,
  children,
}: ZoomDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const view = useRef<View>({ scale: 1, x: 0, y: 0 });

  // Keeps the content covering the viewport where it can, and centred where it's smaller.
  const apply = (next: View) => {
    const port = viewport.current;
    const inner = content.current;
    if (!port || !inner) {
      return;
    }
    const scale = Math.min(maxScale, Math.max(1, next.scale));
    const width = inner.offsetWidth * scale;
    const height = inner.offsetHeight * scale;
    const top = inner.offsetTop;
    const x =
      width <= port.clientWidth
        ? (inner.offsetWidth - width) / 2
        : Math.min(0, Math.max(port.clientWidth - width, next.x));
    const y =
      height <= port.clientHeight
        ? (inner.offsetHeight - height) / 2
        : Math.min(-top, Math.max(port.clientHeight - top - height, next.y));
    view.current = { scale, x, y };
    inner.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };

  // A screen point in the content's own, unscaled coordinates.
  const local = (clientX: number, clientY: number): Point => {
    const rect = viewport.current!.getBoundingClientRect();
    const inner = content.current!;
    return {
      x: clientX - rect.left - inner.offsetLeft,
      y: clientY - rect.top - inner.offsetTop,
    };
  };

  // Keeps the point under the finger or cursor where it is.
  const zoomAt = (point: Point, scale: number) => {
    const { scale: from, x, y } = view.current;
    const to = Math.min(maxScale, Math.max(1, scale));
    apply({
      scale: to,
      x: point.x - ((point.x - x) * to) / from,
      y: point.y - ((point.y - y) * to) / from,
    });
  };

  useEffect(() => {
    if (!open) {
      dialog.current?.close();
      return;
    }
    dialog.current?.showModal();
    apply({ scale: 1, x: 0, y: 0 });
  }, [open]);

  useEffect(() => {
    // Always rendered, so set by the time effects run.
    const port = viewport.current!;
    const pointers = new Map<number, Point>();
    let lastTap = 0;

    const down = (event: PointerEvent) => {
      port.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, local(event.clientX, event.clientY));
      if (pointers.size === 1) {
        const now = Date.now();
        if (now - lastTap < 300) {
          const point = local(event.clientX, event.clientY);
          zoomAt(point, view.current.scale > 1 ? 1 : doubleTapScale);
          lastTap = 0;
        } else {
          lastTap = now;
        }
      }
    };
    const move = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) {
        return;
      }
      const point = local(event.clientX, event.clientY);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const other = a === previous ? b : a;
        const before = Math.hypot(previous.x - other.x, previous.y - other.y);
        const after = Math.hypot(point.x - other.x, point.y - other.y);
        const middle = {
          x: (point.x + other.x) / 2,
          y: (point.y + other.y) / 2,
        };
        if (before > 0) {
          zoomAt(middle, (view.current.scale * after) / before);
        }
      } else {
        const { scale, x, y } = view.current;
        apply({
          scale,
          x: x + point.x - previous.x,
          y: y + point.y - previous.y,
        });
      }
      pointers.set(event.pointerId, point);
    };
    const up = (event: PointerEvent) => pointers.delete(event.pointerId);
    // Trackpad pinches arrive as wheel events with ctrlKey.
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.002));
      zoomAt(local(event.clientX, event.clientY), view.current.scale * factor);
    };

    port.addEventListener("pointerdown", down);
    port.addEventListener("pointermove", move);
    port.addEventListener("pointerup", up);
    port.addEventListener("pointercancel", up);
    port.addEventListener("wheel", wheel, { passive: false });
    return () => {
      port.removeEventListener("pointerdown", down);
      port.removeEventListener("pointermove", move);
      port.removeEventListener("pointerup", up);
      port.removeEventListener("pointercancel", up);
      port.removeEventListener("wheel", wheel);
    };
  }, [maxScale]);

  return (
    <dialog
      ref={dialog}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) {
          dialog.current?.close();
        }
      }}
      class="m-auto h-[calc(100svh-2rem)] max-h-none w-[calc(100vw-2rem)] max-w-6xl overflow-hidden rounded-xl border border-line-strong bg-canvas bg-grid p-0 text-ink shadow-window backdrop:bg-canvas/80 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      <div class="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2 font-mono text-xs text-muted">
        <span>{title}</span>
        <span class="ml-auto">
          <span class="sm:hidden">pinch to zoom</span>
          <span class="hidden sm:inline">scroll or pinch to zoom</span>
        </span>
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          class="rounded-md px-2 py-1 text-muted hover:text-ink"
        >
          Close
        </button>
      </div>
      <div
        ref={viewport}
        class="relative flex flex-1 touch-none items-center overflow-hidden select-none"
      >
        <div
          ref={content}
          class="w-full origin-top-left p-4 [&>img]:block [&>img]:h-auto [&>img]:w-full [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
        >
          {children}
        </div>
      </div>
    </dialog>
  );
}
