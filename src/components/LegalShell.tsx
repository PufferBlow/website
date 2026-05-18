import type { ReactNode } from "react";

import { SiteFooter, SiteNav } from "./SiteChrome";

interface LegalShellProps {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalShell({ eyebrow, title, updated, children }: LegalShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <SiteNav subtitle="Legal" />
      <main>
        <section className="border-b border-[var(--color-border-secondary)]">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--color-text)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-[var(--color-text-tertiary)]">Last updated {updated}</p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="prose-pb space-y-8 text-base leading-7 text-[var(--color-text-secondary)]">
              {children}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
