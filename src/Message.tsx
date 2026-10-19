import { cva } from "class-variance-authority";
import type { ComponentChildren } from "preact";
import { cn } from "./cn.ts";

const message = cva("rounded-lg px-3 py-2 text-sm whitespace-pre-wrap", {
  variants: {
    tone: {
      error: "bg-danger-soft text-danger",
      notice: "bg-notice-soft",
    },
  },
});

export function Message({
  tone,
  class: extra,
  children,
}: {
  tone: "error" | "notice";
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
