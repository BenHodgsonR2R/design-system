import { cva } from "class-variance-authority";
import type { ComponentChildren } from "preact";
import { cn } from "./cn.ts";

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
      },
    },
  },
);

type Tone = "info" | "success" | "warning" | "notice" | "error";

export function Message({
  tone,
  class: extra,
  children,
}: {
  /** `notice` is the same as `warning`. */
  tone: Tone;
  class?: string;
  children: ComponentChildren;
}) {
  return (
    <div
      class={cn(message({ tone }), extra)}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
