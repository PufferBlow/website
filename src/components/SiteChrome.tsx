import { Link } from "react-router-dom";

import { PufferblowBrand } from "./PufferblowBrand";

export const GITHUB_URL = "https://github.com/pufferblow/pufferblow";

const navLink =
  "rounded-xl border border-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]";

export function DevBanner() {
  return (
    <div
      role="note"
      className="border-b border-[var(--color-border-secondary)] bg-[var(--color-background-secondary)]"
    >
      <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 text-center text-[13px] text-[var(--color-text-tertiary)] sm:px-6 lg:px-8">
        <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-primary)]">
          In development
        </span>
        <span>
          Pufferblow is a work in progress. Expect rough edges and breaking changes. Not ready for
          production use yet.
        </span>
      </p>
    </div>
  );
}

interface SiteNavProps {
  subtitle?: string;
}

export function SiteNav({ subtitle = "Self-Hosted Community Platform" }: SiteNavProps) {
  return (
    <>
      <DevBanner />
      <nav className="sticky top-0 z-40 border-b border-[var(--color-border-secondary)] bg-[color:color-mix(in_srgb,var(--color-background)_94%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="pb-focus-ring rounded-xl" aria-label="Pufferblow home">
            <PufferblowBrand
              size={40}
              subtitle={subtitle}
              titleClassName="text-2xl"
              subtitleClassName="hidden text-[11px] sm:block"
            />
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={navLink}>
              GitHub
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export function SiteFooter() {
  const link = "transition-colors hover:text-[var(--color-text)]";
  return (
    <footer className="border-t border-[var(--color-border-secondary)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="space-y-3">
          <PufferblowBrand
            size={36}
            subtitle="Self-Hosted Community Platform"
            titleClassName="text-2xl"
            subtitleClassName="text-[10px]"
          />
          <p className="max-w-md text-xs leading-5 text-[var(--color-text-muted)]">
            Pufferblow is in development and not yet production-ready. pufferblow.space
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={link}>
            Source
          </a>
          <Link to="/terms" className={link}>
            Terms
          </Link>
          <Link to="/privacy" className={link}>
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
