import { Link } from "react-router-dom";

import { PufferblowMark } from "../components/PufferblowBrand";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page not found — Pufferblow");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-[1.75rem] border border-[var(--color-border-secondary)] bg-[var(--color-surface)] p-8">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-border-secondary)] bg-[var(--color-background)]">
              <PufferblowMark size={44} surfaceColor="var(--color-background)" />
            </div>
            <h1 className="mb-2 text-6xl font-bold text-[var(--color-text)]">404</h1>
            <p className="text-xl text-[var(--color-text-secondary)]">
              The requested page could not be found.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block w-full rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Go Home
            </Link>
            <Link
              to="/download"
              className="inline-block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-6 py-3 font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]"
            >
              Go to Download
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
