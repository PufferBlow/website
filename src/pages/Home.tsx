import type { ReactNode } from "react";
import AppPreview from "../components/AppPreview";
import AuthPreview from "../components/AuthPreview";
import FediversePreview from "../components/FediversePreview";
import Features from "../components/Features";
import { GITHUB_URL, SiteFooter, SiteNav } from "../components/SiteChrome";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function Section({ id, label, title, note, children }: { id?: string; label?: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-28 scroll-mt-24">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        {label ? <p className="pb-section-label m-0 mb-3">{label}</p> : null}
        <h2 className="m-0 text-3xl sm:text-4xl">{title}</h2>
        {note ? <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-text-tertiary">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  useDocumentTitle(
    "Pufferblow: self-hosted community platform (in development)",
    "Pufferblow is an open-source, self-hosted community platform with channels, roles, voice, end-to-end encrypted calls and federation. Still in development.",
  );

  return (
    <div className="min-h-screen bg-background text-text">
      <SiteNav />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="pb-display m-0 !text-5xl !leading-[1.05] sm:!text-6xl lg:!text-7xl">Your community, on a server you own.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-body sm:text-xl">
            Channels, voice and private calls that stay private, with other instances one handle away. Open source and self-hosted. Still in development.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="pb-button-primary !px-6 !py-3.5 hover:bg-primary-hover">
              Follow on GitHub
            </a>
            <a href={`${GITHUB_URL}/tree/main/docs`} target="_blank" rel="noopener noreferrer" className="pb-button-secondary !px-6 !py-3.5 hover:bg-surface-tertiary">
              Read the docs
            </a>
          </div>
        </div>

        <div className="mt-16">
          <AppPreview />
          <p className="mt-4 text-center text-[13px] text-text-muted">This is the app. Switch channels, send a message, puff a reaction, join the voice channel.</p>
        </div>

        <Section id="why" label="Why Pufferblow" title="Small to run. Hard to lock you in." note="What it does today, in plain words. Anything still being built says so.">
          <Features />
        </Section>

        <Section label="Accounts" title="Sign in with a handle, or create an account.">
          <AuthPreview />
        </Section>

        <Section id="federation" label="Federation" title="Instances connect to each other." note="Federation is in progress. You choose who your instance talks to, instance by instance.">
          <FediversePreview />
        </Section>

        <Section title="Run your own.">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
            <p className="m-0 text-[15px] leading-relaxed text-text-tertiary">
              Pufferblow is in development and not ready for production use yet. The code, the docs and the roadmap are open; so is the issue tracker.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`${GITHUB_URL}/tree/main/docs/operator`} target="_blank" rel="noopener noreferrer" className="pb-button-primary !px-6 !py-3.5 hover:bg-primary-hover">
                Operator guide
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="pb-button-secondary !px-6 !py-3.5 hover:bg-surface-tertiary">
                Source on GitHub
              </a>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
