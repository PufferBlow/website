// Transform the small set of MkDocs-Material extensions used in the source
// docs into plain CommonMark / GFM that react-markdown can render.
//
// What we handle, and why each rule exists:
//   - `:octicons-...:{ .md-button }`  → stripped (button-styled icon links)
//   - `!!! type "title"` admonitions  → rendered as a styled blockquote with
//                                       a leading **title** line. react-markdown
//                                       then renders the blockquote; the docs
//                                       CSS gives it the colored side-bar treatment.
//   - `!!swagger ./openapi.json!!`    → replaced with a callout pointing to
//                                       the live `/docs` Swagger UI on a
//                                       running instance, since we don't ship
//                                       the spec from this site.

export type AdmonitionKind = "note" | "warning" | "danger" | "tip" | "info";

function stripOcticonButtons(input: string): string {
  // Pattern: [Label :octicons-x:](href){ .md-button } → [Label](href)
  return input
    .replace(/:octicons-[\w-]+:/g, "")
    .replace(/\)\{\s*\.md-button[^}]*\}/g, ")");
}

function rewriteSwagger(input: string): string {
  return input.replace(/!!swagger[^!]*!!/g, () =>
    [
      "> **Live API docs**",
      ">",
      "> Every running Pufferblow instance serves an interactive",
      "> Swagger UI at `/docs` and the raw OpenAPI schema at",
      "> `/openapi.json`. Point your browser at",
      "> `https://your.instance.example/docs` to explore endpoints.",
    ].join("\n"),
  );
}

function transformAdmonitions(input: string): string {
  const lines = input.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = /^!!!\s+(\w+)(?:\s+"([^"]*)")?\s*$/.exec(line);
    if (!m) {
      out.push(line);
      i++;
      continue;
    }

    const kind = m[1].toLowerCase();
    const title = m[2] ?? kind[0].toUpperCase() + kind.slice(1);
    i++;

    // Consume the indented body. MkDocs requires 4-space indentation.
    const body: string[] = [];
    while (i < lines.length) {
      const next = lines[i];
      if (next === "") {
        // blank lines are allowed inside the block
        body.push("");
        i++;
        continue;
      }
      if (/^\s{4}/.test(next)) {
        body.push(next.slice(4));
        i++;
        continue;
      }
      break;
    }
    // Trim trailing blank lines we may have absorbed
    while (body.length && body[body.length - 1] === "") body.pop();

    out.push(`> **${title}**`);
    out.push(">");
    for (const b of body) out.push(b === "" ? ">" : `> ${b}`);
    out.push("");
  }
  return out.join("\n");
}

export function preprocessMarkdown(input: string): string {
  let s = input;
  s = stripOcticonButtons(s);
  s = rewriteSwagger(s);
  s = transformAdmonitions(s);
  return s;
}
