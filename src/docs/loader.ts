// Bundle every doc page at build time as a raw string. Vite resolves the
// glob keys relative to *this* file, so the paths start with
// "../content/docs/...".
const rawDocs = import.meta.glob("../content/docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const PREFIX = "../content/docs/";

function normalizeKey(key: string): string {
  return key.startsWith(PREFIX) ? key.slice(PREFIX.length) : key;
}

const byFile: Record<string, string> = {};
for (const [key, value] of Object.entries(rawDocs)) {
  byFile[normalizeKey(key)] = value;
}

export function loadDocSource(file: string): string | null {
  return byFile[file] ?? null;
}

export function allDocFiles(): string[] {
  return Object.keys(byFile);
}
