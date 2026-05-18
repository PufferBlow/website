import { LegalSection, LegalShell } from "../components/LegalShell";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Terms() {
  useDocumentTitle(
    "Terms & Conditions — Pufferblow",
    "Terms and conditions governing use of the Pufferblow website and desktop client.",
  );

  return (
    <LegalShell eyebrow="Legal" title="Terms & Conditions" updated="2026-05-18">
      <p>
        These terms govern your use of this website and the Pufferblow desktop client distributed
        from it. Pufferblow is open-source software licensed under the GNU GPL v3.0. The terms
        below cover the website and download portal; the software itself is governed by its
        license.
      </p>

      <LegalSection title="1. The software">
        <p>
          Pufferblow is provided as free, open-source software under the GPL-3.0 license. The
          license — not these terms — governs your rights to copy, modify, run, and redistribute
          the source code and binaries. A copy of the license ships with every release and is
          available in the project repository.
        </p>
      </LegalSection>

      <LegalSection title="2. No warranty">
        <p>
          The software and this website are provided <strong>“as is”</strong>, without warranty of
          any kind, express or implied. We make no guarantees about uptime, fitness for a
          particular purpose, or freedom from defects. You install and run Pufferblow at your own
          risk.
        </p>
      </LegalSection>

      <LegalSection title="3. Self-hosted responsibility">
        <p>
          Pufferblow is a self-hosted platform. When you run an instance, you are the operator —
          you are responsible for the data you store, the users you onboard, the moderation
          decisions you make, and compliance with the laws that apply to you and your community.
        </p>
        <p>
          Pufferblow contributors are not party to your instance, do not have access to your data,
          and are not a service provider for anyone else's instance.
        </p>
      </LegalSection>

      <LegalSection title="4. Downloads & binaries">
        <p>
          Binary releases are published on GitHub and downloaded directly from there. This website
          links to those release artifacts; we don't re-host or modify them. Always verify
          signatures or hashes if you need stronger supply-chain guarantees.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable use of this website">
        <p>
          You agree not to abuse this website — no automated scraping at unreasonable rates, no
          attempts to disrupt service, and no use of the brand, name, or marks in a way that
          implies endorsement of an unrelated project.
        </p>
      </LegalSection>

      <LegalSection title="6. Trademarks">
        <p>
          The Pufferblow name and logo are project marks of the Pufferblow contributors. You may
          reference them to talk about, link to, or contribute to the project. You may not use
          them to brand a derivative service in a way that implies it is the official project.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes">
        <p>
          These terms may evolve as the project does. Material changes will be reflected in the
          “Last updated” date above. Continued use of the site after a change means you accept the
          updated terms.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          Questions, takedown notices, or security disclosures: open an issue or use the contact
          path documented in the project repository.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
