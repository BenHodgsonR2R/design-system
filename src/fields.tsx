import type { ComponentChildren, JSX } from "preact";
import { cn } from "./cn.ts";

const field =
  "min-w-0 rounded-md border border-line-strong bg-surface px-2.5 text-sm text-ink transition placeholder:text-muted/70 focus-visible:border-link focus-visible:outline-2 focus-visible:outline-link/30";

type InputProps = JSX.InputHTMLAttributes & { class?: string };

export function Input({ class: extra, ...props }: InputProps) {
  return <input class={cn(field, "h-control", extra)} {...props} />;
}

type SelectProps = JSX.SelectHTMLAttributes & { class?: string };

export function Select({ class: extra, ...props }: SelectProps) {
  return <select class={cn(field, "h-control", extra)} {...props} />;
}

type TextAreaProps = JSX.TextareaHTMLAttributes & { class?: string };

export function TextArea({ class: extra, ...props }: TextAreaProps) {
  return <textarea class={cn(field, "py-1.5", extra)} {...props} />;
}

export function Field({
  label,
  class: extra,
  children,
}: {
  label: ComponentChildren;
  class?: string;
  children: ComponentChildren;
}) {
  return (
    <label
      class={cn(
        "flex flex-col gap-1 font-mono text-xs font-semibold text-muted",
        extra,
      )}
    >
      {label}
      {children}
    </label>
  );
}
