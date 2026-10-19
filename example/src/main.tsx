import {
  Button,
  Field,
  Highlight,
  Input,
  Link,
  Message,
  Page,
  Panel,
  Select,
  TextArea,
} from "@bhodgson/design-system";
import { render } from "preact";

function Showcase() {
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
          Source on{" "}
          <Link href="https://github.com/BenHodgsonR2R/design-system">
            GitHub
          </Link>
          .
        </>
      }
      actions={
        <>
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
        </>
      }
      footer={<p>Footer content from the page goes here.</p>}
    >
      <div class="grid items-start gap-4 md:grid-cols-2">
        <Panel
          id="buttons"
          title="Buttons"
          actions={<Button variant="secondary">Panel action</Button>}
        >
          <div class="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="link">Link</Button>
            <Button variant="icon" aria-label="Remove">
              ×
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </Panel>

        <Panel id="fields" title="Fields">
          <div class="flex flex-col gap-3">
            <Field label="Name">
              <Input placeholder="e.g. people" />
            </Field>
            <Field label="Answer">
              <Select>
                <option>One value</option>
                <option>Any number of values</option>
              </Select>
            </Field>
            <Field label="Notes">
              <TextArea placeholder="Anything else?" />
            </Field>
          </div>
        </Panel>

        <Panel id="text" title="Text">
          <p class="leading-relaxed">
            Mark a few words with a <Highlight>blue</Highlight> or{" "}
            <Highlight tone="red">signal red</Highlight> highlight, and link
            with a <Link href="#text">bold underline</Link>.
          </p>
        </Panel>

        <Panel id="messages" title="Messages">
          <div class="flex flex-col gap-2">
            <Message tone="notice">A notice, such as a hint or status.</Message>
            <Message tone="error">An error the person needs to fix.</Message>
          </div>
        </Panel>

        <Panel id="tokens" title="Colour tokens">
          <ul class="grid grid-cols-3 gap-2 text-xs">
            {[
              "bg-canvas",
              "bg-surface",
              "bg-ink",
              "bg-muted",
              "bg-line",
              "bg-accent",
              "bg-accent-edge",
              "bg-link",
              "bg-highlight-red",
              "bg-highlight-blue",
              "bg-danger",
              "bg-notice-soft",
            ].map((token) => (
              <li key={token} class="flex flex-col gap-1">
                <span class={`h-10 rounded-lg border border-line ${token}`} />
                {token.replace("bg-", "")}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Page>
  );
}

const root = document.getElementById("app");
if (root !== null) {
  render(<Showcase />, root);
}
