import { Link } from "react-router-dom";

import { useLatestVersion } from "../hooks/useLatestVersion";
import { PufferblowBrand } from "./PufferblowBrand";

export const DOCS_URL = "/docs";
export const GITHUB_URL = "https://github.com/pufferblow/pufferblow";

function VersionBadge() {
  const tag = useLatestVersion();
  // Reserve the badge slot only after we know there's a version to show
  // — no flicker, no layout shift while the API request is in flight.
  if (!tag) return null;
  return (
    <Link
      to="/download"
      title={`Latest release: ${tag}`}
      className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-secondary)] bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-[var(--color-text-tertiary)] transition-colors hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
      <span className="font-mono">{tag}</span>
    </Link>
  );
}

interface SiteNavProps {
  subtitle?: string;
}

export function SiteNav({ subtitle = "Self-Hosted Community Platform" }: SiteNavProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--color-border-secondary)] bg-[color:color-mix(in_srgb,var(--color-background)_94%,transparent)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="pb-focus-ring rounded-xl">
            <PufferblowBrand
              size={44}
              subtitle={subtitle}
              surfaceColor="var(--color-background)"
              titleClassName="text-2xl md:text-3xl"
              subtitleClassName="text-[10px] md:text-[11px]"
            />
          </Link>
          <VersionBadge />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={DOCS_URL}
            className="rounded-xl border border-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]"
          >
            Docs
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]"
          >
            GitHub
          </a>
          <Link
            to="/download"
            className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Download
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-secondary)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <PufferblowBrand
          size={36}
          subtitle="Self-Hosted Community Platform"
          surfaceColor="var(--color-background)"
          titleClassName="text-2xl"
          subtitleClassName="text-[10px]"
        />

        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
          <Link to={DOCS_URL} className="transition-colors hover:text-[var(--color-text)]">
            Documentation
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--color-text)]"
          >
            Source
          </a>
          <Link to="/download" className="transition-colors hover:text-[var(--color-text)]">
            Download
          </Link>
          <Link to="/terms" className="transition-colors hover:text-[var(--color-text)]">
            Terms
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-[var(--color-text)]">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
