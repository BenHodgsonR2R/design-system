import { Application, normalizePath } from "typedoc";

type Part = {
  kind: string;
  text: string;
  tag?: string;
  target?: unknown;
};

type Comment = {
  summary: Part[];
  blockTags?: { tag: string; content: Part[] }[];
};

type TypeNode = {
  type: string;
  name?: string;
  value?: unknown;
  target?: unknown;
  types?: TypeNode[];
  elements?: TypeNode[];
  elementType?: TypeNode;
  typeArguments?: TypeNode[];
  operator?: string;
  objectType?: TypeNode;
  indexType?: TypeNode;
  queryType?: TypeNode;
  declaration?: Declaration;
};

type Signature = {
  comment?: Comment;
  parameters?: Declaration[];
  type?: TypeNode;
};

type Declaration = {
  id: number;
  name: string;
  kind: number;
  flags: { isOptional?: boolean; isStatic?: boolean; isExternal?: boolean };
  comment?: Comment;
  children?: Declaration[];
  signatures?: Signature[];
  getSignature?: Signature;
  type?: TypeNode;
  extendedTypes?: TypeNode[];
  sources?: { line: number; url?: string }[];
};

type Project = { children?: Declaration[] };

/** A type, as text with links to the entries it names. */
export type ApiType = { text: string; href?: string }[];

export type ApiField = {
  name: string;
  optional: boolean;
  type: ApiType;
  /** HTML. */
  description: string;
};

export type ApiMethod = {
  name: string;
  signature: string;
  /** HTML. */
  summary: string;
  parameters: ApiField[];
  returns: ApiType;
};

export type ApiEntry = {
  name: string;
  /** Such as `layout/page`. */
  slug: string;
  group: string;
  kind: "component" | "function" | "class" | "type" | "constant";
  /** HTML. */
  summary: string;
  /** The summary without markup, for the page description. */
  plainSummary: string;
  signature?: string;
  examples: { lang: string; code: string }[];
  props?: ApiField[];
  /** The element whose attributes a component also takes, such as `button`. */
  propsElement?: string;
  parameters?: ApiField[];
  returns?: ApiType;
  fields?: ApiField[];
  values?: ApiType[];
  /** What a class extends. */
  extends?: ApiType;
  /** How to construct a class. */
  construct?: ApiMethod;
  methods?: ApiMethod[];
  usedBy: { name: string; href: string }[];
  sourceUrl?: string;
};

export type Api = { groups: string[]; entries: ApiEntry[] };

export type LoadApiOptions = {
  entryPoints: string[];
  tsconfig: string;
  /** Where the API pages are served, such as `/design-system/api/`. */
  base: string;
  /** The order of the `@group` names. Groups not listed come last. */
  groups?: string[];
};

const kinds = {
  variable: 32,
  function: 64,
  class: 128,
  constructor: 512,
  method: 2048,
  accessor: 262144,
  typeAlias: 2097152,
};

const elementNames: Record<string, string> = {
  Anchor: "a",
  Textarea: "textarea",
};

// Astro loads the config and the pages as separate module copies, so the cache lives on globalThis.
const cacheKey = Symbol.for("@bhodgson/docs/api");
const loaded: Map<string, Promise<Api>> = ((
  globalThis as Record<symbol, unknown>
)[cacheKey] ??= new Map()) as Map<string, Promise<Api>>;

/**
 * Documents a package from its source with TypeDoc, for the API pages and sidebar.
 *
 * Every export gets a page in its `@group`, with its summary, `@example`s and what uses it. A type named after a
 * component with `Props` on the end, such as `ButtonProps` for `Button`, is shown as that component's props
 * rather than on a page of its own.
 */
export function loadApi(options: LoadApiOptions): Promise<Api> {
  const key = JSON.stringify(options);
  let api = loaded.get(key);
  if (api === undefined) {
    api = convert(options);
    loaded.set(key, api);
  }
  return api;
}

async function convert(options: LoadApiOptions): Promise<Api> {
  const app = await Application.bootstrapWithPlugins({
    entryPoints: options.entryPoints,
    tsconfig: options.tsconfig,
    excludePrivate: true,
    excludeInternal: true,
    sort: ["source-order"],
    gitRevision: "main",
    logLevel: "Warn",
  });
  const project = await app.convert();
  if (project === undefined) {
    throw new Error("TypeDoc couldn't document the entry points.");
  }
  const json = app.serializer.projectToObject(
    project,
    normalizePath(process.cwd()),
  ) as Project;
  return buildApi(json.children ?? [], options);
}

function buildApi(declarations: Declaration[], options: LoadApiOptions): Api {
  const byId = new Map(declarations.map((d) => [d.id, d]));

  // A component's props type is documented on the component's page.
  const propsOf = new Map<number, Declaration>();
  for (const d of declarations) {
    const parameter = d.signatures?.[0]?.parameters?.[0];
    const target = parameter?.type?.target;
    const props = typeof target === "number" ? byId.get(target) : undefined;
    if (props !== undefined && props.name === `${d.name}Props`) {
      propsOf.set(d.id, props);
    }
  }
  const mergedInto = new Map([...propsOf].map(([id, props]) => [props.id, id]));

  const documented = declarations.filter((d) => !mergedInto.has(d.id));
  const slugs = new Map(
    documented.map((d) => [
      d.id,
      `${groupOf(d).toLowerCase()}/${d.name.toLowerCase()}`,
    ]),
  );
  const hrefOf = (id: number): string | undefined => {
    const owner = mergedInto.get(id);
    const slug = slugs.get(owner ?? id);
    if (slug === undefined) {
      return undefined;
    }
    return `${options.base}${slug}/${owner === undefined ? "" : "#props"}`;
  };

  const references = new Map<number, Set<number>>();
  const entries = documented.map((d) => {
    const used = new Set<number>();
    const entry = describe(d, propsOf.get(d.id), {
      hrefOf,
      refer: (id) => used.add(mergedInto.get(id) ?? id),
      slug: slugs.get(d.id) ?? d.name,
    });
    used.delete(d.id);
    for (const id of used) {
      references.set(id, (references.get(id) ?? new Set()).add(d.id));
    }
    return { id: d.id, entry };
  });

  for (const { id, entry } of entries) {
    entry.usedBy = [...(references.get(id) ?? [])].flatMap((user) => {
      const name = byId.get(user)?.name;
      const href = hrefOf(user);
      return name === undefined || href === undefined ? [] : [{ name, href }];
    });
  }

  const found = [...new Set(entries.map(({ entry }) => entry.group))];
  const order = options.groups ?? [];
  const rank = (group: string) =>
    order.includes(group) ? order.indexOf(group) : order.length;
  const groups = found.toSorted((a, b) => rank(a) - rank(b));

  return {
    groups,
    entries: entries
      .map(({ entry }) => entry)
      .toSorted((a, b) => a.name.localeCompare(b.name)),
  };
}

type Context = {
  hrefOf: (id: number) => string | undefined;
  refer: (id: number) => void;
  slug: string;
};

function describe(
  d: Declaration,
  props: Declaration | undefined,
  context: Context,
): ApiEntry {
  const signature = d.signatures?.[0];
  const comment = signature?.comment ?? d.comment;
  const entry: ApiEntry = {
    name: d.name,
    slug: context.slug,
    group: groupOf(d),
    kind: "type",
    summary: html(comment?.summary ?? [], context),
    plainSummary: (comment?.summary ?? [])
      .map((part) => part.text.replaceAll("`", ""))
      .join(""),
    examples: examplesOf(comment),
    usedBy: [],
    sourceUrl: d.sources?.[0]?.url,
  };

  if (d.kind === kinds.function && signature !== undefined) {
    const returns = tokens(signature.type, context);
    if (props !== undefined) {
      entry.kind = "component";
      entry.props = fieldsOf(props.type, props.children, context);
      entry.propsElement = elementOf(props.type);
      entry.signature = `${d.name}(props: ${props.name}): ${text(returns)}`;
      return entry;
    }
    entry.kind = "function";
    entry.parameters = (signature.parameters ?? []).map((p) =>
      field(p, context),
    );
    entry.returns = returns;
    const parameters = entry.parameters
      .map((p) => `${p.name}${p.optional ? "?" : ""}: ${text(p.type)}`)
      .join(", ");
    entry.signature = `${d.name}(${parameters}): ${text(returns)}`;
    return entry;
  }

  if (d.kind === kinds.class) {
    entry.kind = "class";
    const members = membersOf(d.children, context, d.name);
    const parent = d.extendedTypes?.[0];
    entry.extends = parent === undefined ? undefined : tokens(parent, context);
    entry.construct = members.construct;
    entry.fields = members.fields;
    entry.methods = members.methods;
    entry.signature = `class ${d.name}${entry.extends === undefined ? "" : ` extends ${text(entry.extends)}`}`;
    return entry;
  }

  if (d.kind === kinds.variable) {
    entry.kind = "constant";
    entry.signature = `const ${d.name}: ${text(tokens(d.type, context))}`;
    return entry;
  }

  if (d.children !== undefined) {
    const members = membersOf(d.children, context);
    entry.fields = members.fields;
    entry.methods = members.methods.length > 0 ? members.methods : undefined;
    return entry;
  }
  const fields = fieldsOf(d.type, undefined, context);
  if (fields.length > 0) {
    entry.fields = fields;
    return entry;
  }
  if (d.type?.type === "union") {
    entry.values = (d.type.types ?? []).map((t) => tokens(t, context));
    return entry;
  }
  entry.signature = `type ${d.name} = ${text(tokens(d.type, context))}`;
  return entry;
}

function groupOf(d: Declaration): string {
  const comment = d.signatures?.[0]?.comment ?? d.comment;
  const tag = comment?.blockTags?.find((t) => t.tag === "@group");
  return (
    tag?.content
      .map((part) => part.text)
      .join("")
      .trim() ?? "Other"
  );
}

function examplesOf(comment: Comment | undefined) {
  return (comment?.blockTags ?? [])
    .filter((t) => t.tag === "@example")
    .map((t) => {
      const source = t.content.map((part) => part.text).join("");
      const fenced = /^```(\w*)\n([\s\S]*?)\n```$/.exec(source.trim());
      return {
        lang: fenced?.[1] || "ts",
        code: fenced?.[2] ?? source.trim(),
      };
    });
}

// Members inherited from outside the package, such as Error's stack, aren't the package's to document.
function isOwn(d: Declaration): boolean {
  return d.flags.isExternal !== true;
}

function bySource(a: Declaration, b: Declaration): number {
  return (a.sources?.[0]?.line ?? 0) - (b.sources?.[0]?.line ?? 0);
}

function membersOf(
  children: Declaration[] | undefined,
  context: Context,
  className?: string,
) {
  const own = (children ?? []).filter(isOwn).toSorted(bySource);
  const constructor = own.find((d) => d.kind === kinds.constructor);
  return {
    construct:
      constructor === undefined || className === undefined
        ? undefined
        : method(constructor, context, `new ${className}`),
    fields: own
      .filter((d) => d.kind !== kinds.constructor && d.kind !== kinds.method)
      .map((d) => field(d, context)),
    methods: own
      .filter((d) => d.kind === kinds.method)
      .map((d) =>
        method(
          d,
          context,
          `${d.flags.isStatic === true ? "static " : ""}${d.name}`,
        ),
      ),
  };
}

/** A method or constructor, called `label` in its signature, such as `new Tagger` or `static parse`. */
function method(d: Declaration, context: Context, label: string): ApiMethod {
  const signature = d.signatures?.[0];
  const parameters = (signature?.parameters ?? []).map((p) =>
    field(p, context),
  );
  const returns = tokens(signature?.type, context);
  const list = parameters
    .map((p) => `${p.name}${p.optional ? "?" : ""}: ${text(p.type)}`)
    .join(", ");
  const constructs = label.startsWith("new ");
  return {
    name: d.name,
    signature: constructs
      ? `${label}(${list})`
      : `${label}(${list}): ${text(returns)}`,
    summary: html(signature?.comment?.summary ?? [], context),
    parameters,
    returns,
  };
}

function fieldsOf(
  type: TypeNode | undefined,
  children: Declaration[] | undefined,
  context: Context,
): ApiField[] {
  const declared =
    children ??
    type?.declaration?.children ??
    (type?.types ?? []).flatMap((t) => t.declaration?.children ?? []);
  return declared
    .filter(isOwn)
    .toSorted(bySource)
    .map((child) => field(child, context));
}

// TypeDoc calls a destructured parameter __namedParameters; name it after its type, as TaggingRequest becomes request.
function parameterName(d: Declaration): string {
  if (d.name !== "__namedParameters") {
    return d.name;
  }
  const words = d.type?.name?.match(/[A-Z][a-z]*/g) ?? [];
  return words.at(-1)?.toLowerCase() ?? "options";
}

function field(d: Declaration, context: Context): ApiField {
  return {
    name: parameterName(d),
    optional: d.flags.isOptional === true,
    type: tokens(d.type ?? d.getSignature?.type, context),
    description: html(d.comment?.summary ?? [], context),
  };
}

/** The element whose attributes a props type takes, from a reference such as `JSX.ButtonHTMLAttributes`. */
function elementOf(type: TypeNode | undefined): string | undefined {
  for (const t of type?.types ?? []) {
    const match = /(\w+)HTMLAttributes$/.exec(t.name ?? "");
    if (match?.[1] !== undefined) {
      return elementNames[match[1]] ?? match[1].toLowerCase();
    }
  }
  return undefined;
}

function tokens(type: TypeNode | undefined, context: Context): ApiType {
  if (type === undefined) {
    return [{ text: "unknown" }];
  }
  const join = (types: TypeNode[] | undefined, separator: string) =>
    (types ?? []).flatMap((t, i) => [
      ...(i > 0 ? [{ text: separator }] : []),
      ...tokens(t, context),
    ]);

  switch (type.type) {
    case "intrinsic":
      return [{ text: type.name ?? "unknown" }];
    case "literal":
      return [
        { text: type.value === null ? "null" : JSON.stringify(type.value) },
      ];
    case "reference": {
      const href =
        typeof type.target === "number"
          ? context.hrefOf(type.target)
          : undefined;
      if (typeof type.target === "number") {
        context.refer(type.target);
      }
      const name = { text: type.name ?? "unknown", href };
      if (type.typeArguments === undefined) {
        return [name];
      }
      return [
        name,
        { text: "<" },
        ...join(type.typeArguments, ", "),
        { text: ">" },
      ];
    }
    case "union":
      return join(type.types, " | ");
    case "intersection":
      return join(type.types, " & ");
    case "array":
      return [...tokens(type.elementType, context), { text: "[]" }];
    case "tuple":
      return [{ text: "[" }, ...join(type.elements, ", "), { text: "]" }];
    case "typeOperator":
      return [
        { text: `${type.operator ?? ""} ` },
        ...tokens(type.target as TypeNode, context),
      ];
    case "indexedAccess":
      return [
        ...tokens(type.objectType, context),
        { text: "[" },
        ...tokens(type.indexType, context),
        { text: "]" },
      ];
    case "query":
      return [{ text: "typeof " }, ...tokens(type.queryType, context)];
    case "reflection":
      return reflectionTokens(type.declaration, context);
    default:
      return [{ text: type.name ?? type.type }];
  }
}

function reflectionTokens(
  d: Declaration | undefined,
  context: Context,
): ApiType {
  const signature = d?.signatures?.[0];
  if (signature !== undefined) {
    const parameters = (signature.parameters ?? []).flatMap((p, i) => [
      {
        text: `${i > 0 ? ", " : ""}${p.name}${p.flags.isOptional ? "?" : ""}: `,
      },
      ...tokens(p.type, context),
    ]);
    return [
      { text: "(" },
      ...parameters,
      { text: ") => " },
      ...tokens(signature.type, context),
    ];
  }
  const members = (d?.children ?? []).flatMap((child, i) => [
    {
      text: `${i > 0 ? "; " : ""}${child.name}${child.flags.isOptional ? "?" : ""}: `,
    },
    ...tokens(child.type, context),
  ]);
  return [{ text: "{ " }, ...members, { text: " }" }];
}

function text(type: ApiType): string {
  return type.map((token) => token.text).join("");
}

const codeClass = "rounded bg-surface-sunken px-1 py-0.5 type-code";
const linkClass =
  "font-medium text-link underline decoration-2 underline-offset-2 hover:decoration-ink";

function html(parts: Part[], context: Context): string {
  const inline = parts
    .map((part) => {
      if (part.kind === "code") {
        return `<code class="${codeClass}">${escape(part.text.replace(/^`+|`+$/g, ""))}</code>`;
      }
      if (part.kind === "inline-tag" && typeof part.target === "number") {
        const href = context.hrefOf(part.target);
        if (href !== undefined) {
          return `<a class="${linkClass}" href="${href}">${escape(part.text)}</a>`;
        }
      }
      return escape(part.text);
    })
    .join("");
  return inline
    .split(/\n\n+/)
    .filter((paragraph) => paragraph.trim() !== "")
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

function escape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** A sidebar group linking to every API page, in groups. */
export function apiSidebar(api: Api, label = "API reference") {
  return {
    label,
    collapsed: true,
    items: api.groups.map((group) => ({
      label: group,
      items: api.entries
        .filter((entry) => entry.group === group)
        .map((entry) => ({ label: entry.name, link: `/api/${entry.slug}/` })),
    })),
  };
}

/** The static paths for a `src/pages/api/[...slug].astro` page. */
export function apiPaths(api: Api) {
  return api.entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
