import { render } from "preact-render-to-string";
import { describe, expect, test } from "vitest";

import { Page } from "./Page.tsx";

describe("Page", () => {
  test("credits the author and links to their GitHub", () => {
    const html = render(<Page title="Playground">Content</Page>);

    expect(html).toContain("Ben Hodgson");
    expect(html).toContain("~/ben");
    expect(html).toContain("avatars.githubusercontent.com");
    expect(html).toContain('href="https://github.com/BenHodgsonR2R"');
    expect(html).toContain("<h1");
    expect(html).toContain("Playground");
    expect(html).toContain("Content");
  });

  test("uses a different author when given one", () => {
    const html = render(
      <Page
        title="Docs"
        author={{
          name: "Ada",
          url: "https://example.com/ada",
          home: "~/ada",
        }}
      >
        Content
      </Page>,
    );

    expect(html).toContain("Ada");
    expect(html).toContain("~/ada");
    expect(html).not.toContain("Ben Hodgson");
  });

  test("shows the eyebrow, description, actions and footer when given", () => {
    const html = render(
      <Page
        title="Playground"
        eyebrow="image-tagger"
        project="tagger-demo"
        description="Tag images with your own vocabulary."
        actions={<a href="#try">Try it</a>}
        footer={<p>Sample credits</p>}
      >
        Content
      </Page>,
    );

    const nav = html.slice(html.indexOf("<nav"), html.indexOf("</nav>"));
    expect(nav.replace(/<[^>]+>/g, "")).toContain("~/ben/tagger-demo $");

    for (const text of [
      "image-tagger",
      "tagger-demo",
      "Tag images with your own vocabulary.",
      "Try it",
      "Sample credits",
    ]) {
      expect(html).toContain(text);
    }
  });
});
