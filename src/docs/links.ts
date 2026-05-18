// Resolve a markdown-relative href against the page it appeared on, then
// rewrite it to a router-friendly path. Examples (currentSlug = "operator/docker"):
//
//   "backup.md"         → "/docs/operator/backup"
//   "../user/install.md" → "/docs/user/install"
//   "#tls"              → "#tls"               (untouched, in-page anchor)
//   "https://x/y"       → "https://x/y"        (untouched)
//   "mailto:x@y"        → "mailto:x@y"         (untouched)
//
// External links and non-doc protocols pass through unchanged.

export type ResolvedLink = {
  href: string;
  external: boolean;
};

const EXTERNAL = /^([a-z][a-z0-9+.-]*:)|^\/\//i;

function joinDocPath(currentSlug: string, target: string): string {
  // currentSlug like "operator/docker" or "" for home.
  const fromParts = currentSlug ? currentSlug.split("/") : [];
  // The current slug points at a *page*, so the directory it lives in
  // is fromParts without the final segment.
  const dir = fromParts.slice(0, -1);

  const targetParts = target.split("/");
  const stack = [...dir];
  for (const part of targetParts) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return stack.join("/");
}

export function resolveDocLink(currentSlug: string, href: string): ResolvedLink {
  if (!href) return { href, external: false };
  if (href.startsWith("#")) return { href, external: false };
  if (EXTERNAL.test(href)) return { href, external: true };

  // Split off any trailing anchor / query.
  const hashIdx = href.indexOf("#");
  const queryIdx = href.indexOf("?");
  const cut = [hashIdx, queryIdx].filter((n) => n >= 0).sort((a, b) => a - b)[0];
  const pathPart = cut === undefined ? href : href.slice(0, cut);
  const tail = cut === undefined ? "" : href.slice(cut);

  // Only rewrite links that look like doc-relative `.md` links. Anything
  // else (absolute root paths, asset references) goes through unchanged.
  if (!/\.md$/i.test(pathPart)) {
    return { href, external: false };
  }

  const noExt = pathPart.replace(/\.md$/i, "").replace(/\/index$/i, "");
  const joined = joinDocPath(currentSlug, noExt);
  const routed = joined === "" ? "/docs" : `/docs/${joined}`;
  return { href: `${routed}${tail}`, external: false };
}
