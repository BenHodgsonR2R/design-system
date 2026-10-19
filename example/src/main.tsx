import {
  applyStoredTheme,
  Badge,
  Button,
  dataTone,
  Field,
  Highlight,
  Input,
  Link,
  Message,
  Page,
  Panel,
  Select,
  TextArea,
  ThemeToggle,
} from "@bhodgson/design-system";
import { render } from "preact";
import { ColourTable } from "./ColourTable.tsx";

function Code({ children }: { children: string }) {
  return (
    <pre class="overflow-x-auto rounded-lg border border-line bg-surface-sunken p-3 font-mono text-xs leading-relaxed">
      <code>{children.trim()}</code>
    </pre>
  );
}

function Docs() {
  return (
    <Page
      eyebrow="@bhodgson/design-system"
      project="design-system"
      title={
        <>
          One <Highlight>design system</Highlight> for my projects
        </>
      }
      description={
        <>
          Tailwind CSS theme tokens, Preact components and this page layout.
          Every colour pair below meets WCAG AA, in light and dark mode, and a
          test suite keeps it that way.
        </>
      }
      actions={
        <>
          <Link href="https://github.com/BenHodgsonR2R/design-system">
            Source on GitHub
          </Link>
          <Link href="https://www.npmjs.com/package/@bhodgson/design-system">
            npm
          </Link>
        </>
      }
    >
      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Panel id="install" title="Install">
          <div class="flex flex-col gap-3 text-sm">
            <Code>{`pnpm add @bhodgson/design-system preact`}</Code>
            <p>Import the theme after Tailwind:</p>
            <Code>
              {`
@import "tailwindcss";
@import "@bhodgson/design-system/theme.css";`}
            </Code>
            <p>
              Apply a saved theme before the first render, so there's no flash:
            </p>
            <Code>
              {`
import { applyStoredTheme } from "@bhodgson/design-system";

applyStoredTheme();
render(<App />, root);`}
            </Code>
          </div>
        </Panel>

        <Panel id="buttons" title="Buttons">
          <div class="flex flex-col gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="link">Link</Button>
              <Button variant="icon" aria-label="Remove">
                ×
              </Button>
              <Button disabled>Disabled</Button>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="sm" variant="secondary">
                Small
              </Button>
              <Button size="sm" variant="icon" aria-label="Remove">
                ×
              </Button>
            </div>
            <Code>{`<Button variant="secondary" size="sm">Small</Button>`}</Code>
          </div>
        </Panel>

        <Panel id="fields" title="Fields">
          <div class="flex flex-col gap-3">
            <div class="flex flex-wrap items-end gap-2">
              <Field label="Name" class="flex-1 basis-40">
                <Input placeholder="e.g. people" />
              </Field>
              <Field label="Answer">
                <Select>
                  <option>One value</option>
                  <option>Any number of values</option>
                </Select>
              </Field>
              <Button variant="icon" aria-label="Remove">
                ×
              </Button>
            </div>
            <Field label="Notes">
              <TextArea placeholder="Anything else?" />
            </Field>
          </div>
        </Panel>

        <Panel id="messages" title="Messages">
          <div class="flex flex-col gap-2">
            <Message tone="info">Info: something worth knowing.</Message>
            <Message tone="success">Success: it worked.</Message>
            <Message tone="warning">
              Warning: check this before you go on.
            </Message>
            <Message tone="error">Error: something to fix.</Message>
          </div>
        </Panel>

        <Panel id="badges" title="Badges">
          <div class="flex flex-col gap-3">
            <div class="flex flex-wrap gap-1.5">
              <Badge>neutral</Badge>
              <Badge tone="accent">accent</Badge>
              <Badge tone="info">info</Badge>
              <Badge tone="success">success</Badge>
              <Badge tone="warning">warning</Badge>
              <Badge tone="danger">danger</Badge>
            </div>
            <p class="text-sm text-muted">
              Six categorical tones tell groups apart, and stay distinct with
              colour-vision deficiencies. Always pair them with text.
            </p>
            <div class="flex flex-wrap gap-1.5">
              {[
                "people",
                "setting",
                "time-of-day",
                "weather",
                "room",
                "style",
              ].map((name, index) => (
                <Badge key={name} tone={dataTone(index)}>
                  {name}
                </Badge>
              ))}
            </div>
            <Code>{`<Badge tone={dataTone(index)}>{name}</Badge>`}</Code>
          </div>
        </Panel>

        <Panel id="text" title="Text and theme">
          <div class="flex flex-col gap-3 text-sm leading-relaxed">
            <p>
              Mark a few words with a <Highlight>blue</Highlight> or{" "}
              <Highlight tone="red">signal red</Highlight> highlight, and link
              with a <Link href="#text">bold underline</Link>.
            </p>
            <div class="flex items-center gap-2">
              <ThemeToggle align="start" />
              <span class="text-muted">
                Cycles system, light and dark. Every toggle on the page stays in
                step, and the choice is saved.
              </span>
            </div>
          </div>
        </Panel>

        <div class="lg:col-span-2">
          <Panel id="colours" title="Colours">
            <ColourTable />
          </Panel>
        </div>
      </div>
    </Page>
  );
}

applyStoredTheme();
const root = document.getElementById("app");
if (root !== null) {
  render(<Docs />, root);
}
