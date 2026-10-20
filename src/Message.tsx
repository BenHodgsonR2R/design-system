import { cva } from "class-variance-authority";
import type { ComponentChildren } from "preact";
import { cn } from "./cn.ts";

/**
 * What kind of {@link Message} it is. `notice` is the same as `warning`.
 * @group Feedback
 */
export type MessageTone = "info" | "success" | "warning" | "notice" | "error";

const message = cva(
  "rounded-lg border-l-4 px-3 py-2 text-sm whitespace-pre-wrap text-ink",
  {
    variants: {
      tone: {
        info: "border-info bg-info-soft",
        success: "border-success bg-success-soft",
        warning: "border-warning bg-warning-soft",
        notice: "border-warning bg-warning-soft",
        error: "border-danger bg-danger-soft",
      } satisfies Record<MessageTone, string>,
    },
  },
);

/**
 * The props for {@link Message}.
 * @group Feedback
 */
export type MessageProps = {
  /** `notice` is the same as `warning`. Errors are announced straight away, the rest politely. */
  tone: MessageTone;
  class?: string;
  children: ComponentChildren;
};

/**
 * A message with a coloured edge. Errors are announced to screen readers straight away; the other tones are announced politely.
 * @group Feedback
 */
export function Message({ tone, class: extra, children }: MessageProps) {
  return (
    <div
      class={cn(message({ tone }), extra)}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
