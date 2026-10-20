import type { ComponentChildren, JSX } from "preact";
import { cn } from "./cn.ts";

const field =
  "min-w-0 rounded-md border border-line-strong bg-surface px-2.5 text-sm text-ink transition placeholder:text-muted/70 focus-visible:border-focus focus-visible:outline-2 focus-visible:outline-focus/40";

/**
 * The props for {@link Input}: every `<input>` attribute, plus these.
 * @group Controls
 */
export type InputProps = JSX.InputHTMLAttributes & { class?: string };

/**
 * A text input, the same height as a medium {@link Button}. Wrap it in a {@link Field} to label it.
 * @group Controls
 */
export function Input({ class: extra, ...props }: InputProps) {
  return <input class={cn(field, "h-control", extra)} {...props} />;
}

/**
 * The props for {@link Select}: every `<select>` attribute, plus these.
 * @group Controls
 */
export type SelectProps = JSX.SelectHTMLAttributes & { class?: string };

/**
 * A select, the same height as a medium {@link Button}. Wrap it in a {@link Field} to label it.
 * @group Controls
 */
export function Select({ class: extra, ...props }: SelectProps) {
  return (
    <select class={cn(field, "h-control select-chevron", extra)} {...props} />
  );
}

/**
 * The props for {@link TextArea}: every `<textarea>` attribute, plus these.
 * @group Controls
 */
export type TextAreaProps = JSX.TextareaHTMLAttributes & { class?: string };

/**
 * A multi-line text input. Wrap it in a {@link Field} to label it.
 * @group Controls
 */
export function TextArea({ class: extra, ...props }: TextAreaProps) {
  return <textarea class={cn(field, "py-1.5", extra)} {...props} />;
}

/**
 * The props for {@link Field}.
 * @group Controls
 */
export type FieldProps = {
  label: ComponentChildren;
  class?: string;
  /** The control the label is for. */
  children: ComponentChildren;
};

/**
 * Labels a control, such as an {@link Input}, {@link Select} or {@link TextArea}.
 * @group Controls
 */
export function Field({ label, class: extra, children }: FieldProps) {
  return (
    <label class={cn("flex flex-col gap-1 type-label text-muted", extra)}>
      {label}
      {children}
    </label>
  );
}
