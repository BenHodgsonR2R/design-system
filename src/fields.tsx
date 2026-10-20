import type { ComponentChildren, JSX } from "preact";
import { cn } from "./cn.ts";

const field =
  "min-w-0 rounded-md border border-line-strong bg-surface px-2.5 text-sm text-ink transition placeholder:text-muted/70 focus-visible:border-focus focus-visible:outline-2 focus-visible:outline-focus/40";

/** Every `<input>` attribute, plus: */
export type InputProps = JSX.InputHTMLAttributes & { class?: string };

export function Input({ class: extra, ...props }: InputProps) {
  return <input class={cn(field, "h-control", extra)} {...props} />;
}

/** Every `<select>` attribute, plus: */
export type SelectProps = JSX.SelectHTMLAttributes & { class?: string };

export function Select({ class: extra, ...props }: SelectProps) {
  return <select class={cn(field, "h-control", extra)} {...props} />;
}

/** Every `<textarea>` attribute, plus: */
export type TextAreaProps = JSX.TextareaHTMLAttributes & { class?: string };

export function TextArea({ class: extra, ...props }: TextAreaProps) {
  return <textarea class={cn(field, "py-1.5", extra)} {...props} />;
}

export type FieldProps = {
  label: ComponentChildren;
  class?: string;
  /** The control the label is for. */
  children: ComponentChildren;
};

/** Labels a control. */
export function Field({ label, class: extra, children }: FieldProps) {
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
