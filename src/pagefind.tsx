import { useMemo } from "preact/hooks";
import { Search, type SearchResult } from "./Search.tsx";

type PagefindData = {
  url: string;
  excerpt: string;
  meta: { title?: string };
  sub_results: { url: string; title: string; excerpt: string }[];
};

type Pagefind = {
  options(options: { baseUrl: string }): Promise<void>;
  debouncedSearch(
    query: string,
  ): Promise<{ results: { data(): Promise<PagefindData> }[] } | null>;
};

const bundles = new Map<string, Promise<Pagefind>>();

async function load(bundle: string, baseUrl: string): Promise<Pagefind> {
  const pagefind = (await import(
    /* @vite-ignore */ `${bundle}pagefind.js`
  )) as Pagefind;
  await pagefind.options({ baseUrl });
  return pagefind;
}

/**
 * Searches a site's Pagefind index, for {@link Search}.
 * @param bundle - Where the index is served, such as `/docs/pagefind/`.
 * @param baseUrl - The site's base path, such as `/docs/`.
 * @group Navigation
 */
export function pagefindSearch(
  bundle: string,
  baseUrl: string,
): (query: string) => Promise<SearchResult[]> {
  return async (query) => {
    let pagefind = bundles.get(bundle);
    if (pagefind === undefined) {
      pagefind = load(bundle, baseUrl);
      bundles.set(bundle, pagefind);
      pagefind.catch(() => bundles.delete(bundle));
    }
    const found = await (await pagefind).debouncedSearch(query);
    const pages = await Promise.all(
      (found?.results ?? []).slice(0, 8).map((result) => result.data()),
    );
    return pages.map((page) => ({
      url: page.url,
      title: page.meta.title ?? page.url,
      excerpt: page.excerpt,
      sections: page.sub_results
        .filter(
          (section) =>
            section.url !== page.url && section.title !== page.meta.title,
        )
        .slice(0, 3),
    }));
  };
}

/**
 * {@link Search} over a site's Pagefind index. The index exists only in a production build.
 * @group Navigation
 */
export function PagefindSearch({
  bundle,
  baseUrl,
}: {
  /** Where the index is served, such as `/docs/pagefind/`. */
  bundle: string;
  /** The site's base path, such as `/docs/`. */
  baseUrl: string;
}) {
  const search = useMemo(
    () => pagefindSearch(bundle, baseUrl),
    [bundle, baseUrl],
  );
  return (
    <Search
      search={search}
      unavailable="Search works in a production build, once the index is built."
    />
  );
}
