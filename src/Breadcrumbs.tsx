import { type ComponentChildren, Fragment } from "preact";
import { cn } from "./cn.ts";

/**
 * One of a {@link Breadcrumbs} trail's places.
 * @group Navigation
 */
export type Crumb = {
  label: ComponentChildren;
  /** Left out for the current page. */
  href?: string;
};

/**
 * The props for {@link Breadcrumbs}.
 * @group Navigation
 */
export type BreadcrumbsProps = {
  /** From the top, ending with the current page. */
  items: Crumb[];
  /** An arrow before the first place, when it's the way back. */
  back?: boolean;
  class?: string;
};

/**
 * Where the page sits, as a path: `← projects / place-images`.
 * @group Navigation
 */
export function Breadcrumbs({
  items,
  back = false,
  class: extra,
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" class={cn("font-mono text-xs", extra)}>
      <ol class="flex flex-wrap items-center gap-1.5">
        {items.map(({ label, href }, index) => (
          <Fragment key={index}>
            {index > 0 && <li aria-hidden="true">/</li>}
            {href === undefined || index === items.length - 1 ? (
              <li aria-current="page" class="text-ink">
                {label}
              </li>
            ) : (
              <li>
                <a
                  href={href}
                  class="group flex gap-1 font-semibold text-link no-underline"
                >
                  {back && index === 0 && <span aria-hidden="true">←</span>}
                  <span class="underline-offset-2 group-hover:underline">
                    {label}
                  </span>
                </a>
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
