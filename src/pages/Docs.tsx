import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import DocsSidebar from "../components/DocsSidebar";
import MarkdownDoc from "../components/MarkdownDoc";
import { SiteFooter, SiteNav } from "../components/SiteChrome";
import { findPage, manifest } from "../docs/manifest";
import { loadDocSource } from "../docs/loader";
import { preprocessMarkdown } from "../docs/preprocess";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const GITHUB_DOCS_BASE = "https://github.com/PufferBlow/pufferblow/blob/main/docs/";

function flatPages() {
  const list = [manifest.home];
  for (const s of manifest.sections) list.push(...s.pages);
  return list;
}

function adjacent(slug: string) {
  const flat = flatPages();
  const idx = flat.findIndex((p) => p.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

function slugFromPath(pathname: string): string {
  // "/docs"            → ""        (home)
  // "/docs/operator"   → "operator"
  // "/docs/operator/docker" → "operator/docker"
  const stripped = pathname.replace(/^\/docs\/?/, "").replace(/\/+$/, "");
  return stripped;
}

export default function Docs() {
  const location = useLocation();
  const slug = slugFromPath(location.pathname);
  const page = findPage(slug);

  const source = useMemo(() => {
    if (!page) return null;
    const raw = loadDocSource(page.file);
    return raw === null ? null : preprocessMarkdown(raw);
  }, [page]);

  const title = page
    ? page.slug === ""
      ? "Documentation — Pufferblow"
      : `${page.title} — Pufferblow Docs`
    : "Not found — Pufferblow Docs";

  useDocumentTitle(title);

  useEffect(() => {
    // Scroll content into view when the route changes — anchors handled by
    // the browser if the slug has a hash.
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  const { prev, next } = page ? adjacent(page.slug) : { prev: null, next: null };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <SiteNav subtitle="Documentation" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:py-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <DocsSidebar />
        </aside>

        <main className="min-w-0">
          {page && source ? (
            <>
              <MarkdownDoc source={source} currentSlug={page.slug} />

              <div className="mt-12 flex flex-col gap-6 border-t border-[var(--color-border-secondary)] pt-8">
                <a
                  href={`${GITHUB_DOCS_BASE}${page.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-text-tertiary)] underline underline-offset-2 hover:text-[var(--color-text-secondary)]"
                >
                  Edit this page on GitHub →
                </a>

                <nav className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
                  {prev ? (
                    <Link
                      to={prev.slug === "" ? "/docs" : `/docs/${prev.slug}`}
                      className="group flex-1 rounded-2xl border border-[var(--color-border-secondary)] bg-[var(--color-surface)] px-5 py-4 transition-colors hover:bg-[var(--color-surface-secondary)]"
                    >
                      <span className="block text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                        ← Previous
                      </span>
                      <span className="mt-1 block text-sm font-medium text-[var(--color-text)]">
                        {prev.title}
                      </span>
                    </Link>
                  ) : (
                    <span aria-hidden className="flex-1" />
                  )}
                  {next ? (
                    <Link
                      to={next.slug === "" ? "/docs" : `/docs/${next.slug}`}
                      className="group flex-1 rounded-2xl border border-[var(--color-border-secondary)] bg-[var(--color-surface)] px-5 py-4 text-right transition-colors hover:bg-[var(--color-surface-secondary)]"
                    >
                      <span className="block text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                        Next →
                      </span>
                      <span className="mt-1 block text-sm font-medium text-[var(--color-text)]">
                        {next.title}
                      </span>
                    </Link>
                  ) : (
                    <span aria-hidden className="flex-1" />
                  )}
                </nav>
              </div>
            </>
          ) : (
            <div className="rounded-[1.75rem] border border-[var(--color-border-secondary)] bg-[var(--color-surface)] p-10 text-center">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text)]">
                Page not found
              </h1>
              <p className="mt-3 text-[var(--color-text-secondary)]">
                We don't have a doc at <code className="text-[var(--color-text)]">/docs/{slug}</code>.
              </p>
              <Link
                to="/docs"
                className="mt-6 inline-flex rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                Back to docs home
              </Link>
            </div>
          )}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
