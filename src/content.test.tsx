import { render } from "preact-render-to-string";
import { describe, expect, test } from "vitest";
import { Annotation } from "./Annotation.tsx";
import { Breadcrumbs } from "./Breadcrumbs.tsx";
import { Facts, Stats } from "./data.tsx";
import { Disclosure } from "./Disclosure.tsx";
import { Copyright, Footer } from "./Footer.tsx";
import { LinkCard } from "./LinkCard.tsx";
import { Steps } from "./Steps.tsx";
import { Terminal } from "./Terminal.tsx";
import { Highlight } from "./text.tsx";

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

describe("Disclosure", () => {
  test("is a native details element, grouped by name", () => {
    const html = render(
      <Disclosure
        title="I want access"
        description="Ask for an invite"
        name="access"
        open
        data-panel="want"
      >
        Form
      </Disclosure>,
    );
    expect(html).toMatch(/^<details/);
    expect(html).toContain('name="access"');
    expect(html).toContain("open");
    expect(html).toContain('data-panel="want"');
    expect(text(html)).toContain("I want access Ask for an invite");
  });
});

describe("Steps", () => {
  test("numbers each step, with its title in bold", () => {
    const html = render(
      <Steps
        items={[
          { title: "Open the link,", body: "from the email." },
          { title: "Share any page." },
        ]}
      />,
    );
    expect(html).toMatch(/^<ol/);
    expect(text(html)).toBe(
      "1 Open the link, from the email. 2 Share any page.",
    );
    expect(html).toContain("<strong");
  });
});

describe("Annotation", () => {
  test("puts the note in the figure's caption", () => {
    const html = render(
      <Annotation note="your code">
        example.com/?invite=<Highlight tone="accent">acme</Highlight>
      </Annotation>,
    );
    expect(html).toMatch(/^<figure/);
    expect(html).toMatch(/<figcaption[^>]*>.*your code.*<\/figcaption>/);
    expect(html).toContain("ring-accent");
    expect(html).not.toContain("text-inherit");
  });
});

describe("Stats and Facts", () => {
  test("show each value with its label", () => {
    expect(
      text(render(<Stats items={[{ value: "4×", label: "faster" }]} />)),
    ).toBe("4× faster");
    const facts = render(
      <Facts
        items={[
          { term: "Role", detail: "Lead" },
          { term: "Stack", detail: "TypeScript", wide: true },
        ]}
      />,
    );
    expect(facts).toMatch(/^<dl/);
    expect(facts).toContain("col-span-2");
    expect(text(facts)).toBe("Role Lead Stack TypeScript");
  });
});

describe("Breadcrumbs", () => {
  test("links the trail and marks the current page", () => {
    const html = render(
      <Breadcrumbs
        back
        items={[{ label: "projects", href: "/" }, { label: "places" }]}
      />,
    );
    expect(html).toContain('href="/"');
    expect(html).toContain('aria-current="page"');
    expect(text(html)).toBe("← projects / places");
  });
});

describe("Footer", () => {
  test("shows its content and links, and a copyright", () => {
    const html = render(
      <Footer links={[{ label: "home", href: "/" }]}>
        <Copyright year={2026} />
      </Footer>,
    );
    expect(text(html)).toBe("© 2026 Ben Hodgson · GitHub home");
    expect(html).toContain('href="https://github.com/bhodgs"');
    expect(html).toContain('aria-label="Footer"');
  });

  test("takes a width", () => {
    const html = render(<Footer class="max-w-7xl">x</Footer>);
    expect(html).toContain("max-w-7xl");
    expect(html).not.toContain("max-w-6xl");
  });
});

describe("Terminal and LinkCard", () => {
  test("Terminal titles its output with the command", () => {
    const html = render(<Terminal command="cat contact">email</Terminal>);
    expect(text(html)).toBe("~/ben $ cat contact email");
    expect(html).toMatch(/aria-labelledby="([^"]+)".*id="\1"/);
  });

  test("LinkCard passes link attributes through", () => {
    const html = render(
      <LinkCard href="/cv.pdf" download="cv.pdf" tone="accent" arrow="↓">
        Download my CV
      </LinkCard>,
    );
    expect(html).toContain('download="cv.pdf"');
    expect(html).toContain("bg-accent-soft");
    expect(text(html)).toBe("Download my CV ↓");
  });
});
