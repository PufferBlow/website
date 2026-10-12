import type { ReactNode } from "react";

import AuthPreview from "../components/AuthPreview";
import FediversePreview from "../components/FediversePreview";
import HomeDashboardPreview from "../components/HomeDashboardPreview";
import { GITHUB_URL, SiteFooter, SiteNav } from "../components/SiteChrome";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mt-24">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {note ? <p className="mt-3 text-sm text-[var(--color-text-tertiary)]">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  useDocumentTitle(
    "Pufferblow: self-hosted community platform (in development)",
    "Pufferblow is an open-source, self-hosted community platform with channels, roles, voice and federation. Still in development.",
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <SiteNav />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Your community, on a server you own.
          </h1>
          <p className="mt-6 text-lg text-[var(--color-text-secondary)] sm:text-xl">
            Open source and self-hosted. Still in development.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Follow on GitHub
          </a>
        </div>

        <div className="mt-16">
          <HomeDashboardPreview />
        </div>

        <Section title="Sign in with a handle, or create an account.">
          <AuthPreview />
        </Section>

        <Section title="Instances connect to each other." note="Federation is in progress.">
          <FediversePreview />
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
