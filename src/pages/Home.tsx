import { Link } from "react-router-dom";

import HomeDashboardPreview from "../components/HomeDashboardPreview";
import { PufferblowBrand } from "../components/PufferblowBrand";
import { DOCS_URL, SiteFooter, SiteNav } from "../components/SiteChrome";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const heroFacts = [
  "Self-hosted & open source",
  "End-to-end encrypted",
  "Federated via ActivityPub",
];

const steps = [
  {
    title: "Create a home instance account",
    body: "Sign in to your own server or join a community-run one without giving up the familiar chat experience.",
  },
  {
    title: "Organize people and channels",
    body: "Build structured spaces for teams, friends, and communities with moderation, roles, and focused rooms.",
  },
  {
    title: "Keep conversations moving",
    body: "Message, share files, and hop into voice with a product that feels fast and readable instead of overdesigned.",
  },
];

const features = [
  "Self-hosted on your own server",
  "End-to-end encrypted messages",
  "Federation via ActivityPub",
  "Role-based access control",
  "Voice channels via WebRTC",
  "Desktop and web client",
];

export default function Home() {
  useDocumentTitle(
    "Pufferblow — Self-Hosted Community Platform",
    "Self-hosted, open-source community platform with end-to-end encrypted messaging, ActivityPub federation, voice channels, and role-based access control.",
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <SiteNav />

      <main>
        <section className="border-b border-[var(--color-border-secondary)]">
          <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:px-8 lg:py-24">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-[var(--color-border-secondary)] bg-[var(--color-surface)] px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
                Open source · Self-hosted · Federated
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
                  Your community, on a server you own and control.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)] sm:text-xl">
                  Pufferblow is a self-hosted, open-source community platform with encrypted
                  messaging, ActivityPub federation, voice channels, and a client built to stay
                  readable.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/download"
                  className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-3 text-center text-sm font-medium text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  Download desktop client
                </Link>
                <Link
                  to={DOCS_URL}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-center text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-secondary)]"
                >
                  Read the docs
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {heroFacts.map((fact) => (
                  <div
                    key={fact}
                    className="rounded-2xl border border-[var(--color-border-secondary)] bg-[var(--color-surface)] px-4 py-4 text-sm text-[var(--color-text-secondary)]"
                  >
                    {fact}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border-secondary)] bg-[var(--color-surface)] p-6 sm:p-8">
              <PufferblowBrand
                size={84}
                align="center"
                subtitle="Encrypted · Federated · Open Source"
                surfaceColor="var(--color-surface)"
                className="mb-8 flex-col gap-5"
                textClassName="items-center"
                titleClassName="text-5xl"
                subtitleClassName="text-[11px] tracking-[0.28em]"
              />

              <dl className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-border-secondary)] bg-[var(--color-background)] p-5">
                  <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Ownership
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[var(--color-text-secondary)]">
                    Keep your server identity, policies, and data path under your control.
                  </dd>
                </div>
                <div className="rounded-2xl border border-[var(--color-border-secondary)] bg-[var(--color-background)] p-5">
                  <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Familiarity
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[var(--color-text-secondary)]">
                    Channels, members, settings, and moderation stay approachable instead of
                    ornamental.
                  </dd>
                </div>
                <div className="rounded-2xl border border-[var(--color-border-secondary)] bg-[var(--color-background)] p-5 sm:col-span-2">
                  <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Design direction
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[var(--color-text-secondary)]">
                    Black-first and white-first presets, grayscale by default, and a full appearance
                    editor when you want to customize it.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border-secondary)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text)] sm:text-4xl">
                A straightforward path from instance setup to daily communication.
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[1.75rem] border border-[var(--color-border-secondary)] bg-[var(--color-surface)] p-6"
                >
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)]">
                    0{index + 1}
                  </div>
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-[var(--color-text)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-[var(--color-text-secondary)]">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border-secondary)] bg-[var(--color-background-secondary)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  Product qualities
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text)] sm:text-4xl">
                  Designed to support real work and real communities.
                </h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-[1.5rem] border border-[var(--color-border-secondary)] bg-[var(--color-surface)] px-5 py-5 text-base text-[var(--color-text-secondary)]"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border-secondary)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Product preview
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text)] sm:text-4xl">
                A cleaner interface from the first screen onward.
              </h2>
              <p className="mt-3 text-lg leading-8 text-[var(--color-text-secondary)]">
                Explore the dashboard preview below to get a sense of the channel layout, member
                list, and message surfaces inside the redesigned client.
              </p>
            </div>
            <HomeDashboardPreview />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
