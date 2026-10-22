import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's own sizes and shadow, so `size-control-sm` replaces `size-control` instead of joining it.
const merge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ["control", "control-sm"],
      shadow: ["window"],
    },
    // The theme's utilities, so `bg-grid` joins a background colour instead of replacing it.
    classGroups: {
      "bg-image": ["bg-grid"],
      "text-shadow": ["text-halo"],
    },
  },
});

/**
 * Joins classes, letting later ones replace earlier ones that set the same thing. Every component's `class` prop goes through it.
 * @group Utilities
 */
export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
