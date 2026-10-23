import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { hydrate, render, type VNode } from "preact";
import { renderToString } from "preact-render-to-string";
import { act } from "preact/test-utils";
import { afterEach, describe, expect, test } from "vitest";
import { Annotation } from "./Annotation.tsx";
import { Credit, Identity } from "./author.tsx";
import { Badge } from "./Badge.tsx";
import { Breadcrumbs } from "./Breadcrumbs.tsx";
import { Button } from "./Button.tsx";
import { CommandBar } from "./CommandBar.tsx";
import { Facts, Stats } from "./data.tsx";
import { Disclosure } from "./Disclosure.tsx";
import { Field, Input, Select, TextArea } from "./fields.tsx";
import { Copyright, Footer } from "./Footer.tsx";
import { LinkCard } from "./LinkCard.tsx";
import { Menu } from "./Menu.tsx";
import { Message } from "./Message.tsx";
import { Page } from "./Page.tsx";
import { Panel } from "./Panel.tsx";
import { Search } from "./Search.tsx";
import { Steps } from "./Steps.tsx";
import { Terminal } from "./Terminal.tsx";
import { Highlight, Link } from "./text.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { Tooltip } from "./Tooltip.tsx";
import { ZoomDialog } from "./ZoomDialog.tsx";

/**
 * Renders on the server, where touching a browser API fails the test, then hydrates that HTML in a
 * browser whose saved state differs. The result must match rendering in the browser alone.
 */
async function expectHydrates(element: () => VNode, browserState: () => void) {
  const html = renderToString(element());

  GlobalRegistrator.register();
  browserState();

  const hydrated = document.createElement("div");
  hydrated.innerHTML = html;
  await act(() => hydrate(element(), hydrated));

  const rendered = document.createElement("div");
  await act(() => render(element(), rendered));

  expect(hydrated.innerHTML).toBe(rendered.innerHTML);
}

afterEach(async () => {
  if (GlobalRegistrator.isRegistered) {
    await GlobalRegistrator.unregister();
  }
});

const savedDarkTheme = () => localStorage.setItem("bhodgson-theme", "dark");

const components: [string, () => VNode][] = [
  ["Badge", () => <Badge tone="data-2">people</Badge>],
  ["Button", () => <Button variant="secondary">Save</Button>],
  [
    "Field",
    () => (
      <Field label="Name">
        <Input placeholder="e.g. people" />
      </Field>
    ),
  ],
  [
    "Select",
    () => (
      <Select>
        <option>One</option>
      </Select>
    ),
  ],
  ["TextArea", () => <TextArea placeholder="Notes" />],
  ["Message", () => <Message tone="error">Something to fix.</Message>],
  ["Highlight", () => <Highlight tone="red">words</Highlight>],
  ["Link", () => <Link href="#a">a link</Link>],
  [
    "Panel",
    () => (
      <Panel id="p" title="Panel">
        Content
      </Panel>
    ),
  ],
  ["Identity", () => <Identity project="docs" caret />],
  ["Credit", () => <Credit project="docs" />],
  [
    "Tooltip",
    () => (
      <Tooltip content="Hint">
        <Button>Trigger</Button>
      </Tooltip>
    ),
  ],
  ["Search", () => <Search search={async () => []} />],
  ["ThemeToggle", () => <ThemeToggle />],
  [
    "Menu",
    () => (
      <Menu>
        <a href="/">projects</a>
        <a href="/memos/" aria-current="page">
          memos
        </a>
      </Menu>
    ),
  ],
  [
    "CommandBar",
    () => (
      <CommandBar
        cwd="docs"
        commands={[{ name: "ls", description: "list", run: () => ({}) }]}
        search={async () => []}
      />
    ),
  ],
  [
    "Disclosure",
    () => (
      <Disclosure title="More" description="Details" open>
        Content
      </Disclosure>
    ),
  ],
  ["Steps", () => <Steps items={[{ title: "One", body: "first" }]} />],
  [
    "Annotation",
    () => (
      <Annotation note="the code">
        <Highlight tone="accent">acme</Highlight>
      </Annotation>
    ),
  ],
  ["Stats", () => <Stats items={[{ value: "4×", label: "faster" }]} />],
  ["Facts", () => <Facts items={[{ term: "Role", detail: "Lead" }]} />],
  [
    "Breadcrumbs",
    () => (
      <Breadcrumbs items={[{ label: "docs", href: "/" }, { label: "a" }]} />
    ),
  ],
  [
    "Footer",
    () => (
      <Footer links={[{ label: "home", href: "/" }]}>
        <Copyright year={2026} />
      </Footer>
    ),
  ],
  ["Terminal", () => <Terminal command="cat contact">email</Terminal>],
  ["LinkCard", () => <LinkCard href="#">Email me</LinkCard>],
  [
    "ZoomDialog",
    () => (
      <ZoomDialog open={false} title="Drawing" onClose={() => {}}>
        <svg />
      </ZoomDialog>
    ),
  ],
  [
    "Page",
    () => (
      <Page title="Docs" project="docs">
        Content
      </Page>
    ),
  ],
];

describe("server rendering", () => {
  test.each(components)(
    "%s hydrates to what the browser renders",
    (_, element) => expectHydrates(element, savedDarkTheme),
  );
});
