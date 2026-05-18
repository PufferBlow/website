import { LegalSection, LegalShell } from "../components/LegalShell";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Privacy() {
  useDocumentTitle(
    "Privacy Policy — Pufferblow",
    "How the Pufferblow marketing site handles requests, downloads, and third-party calls.",
  );

  return (
    <LegalShell eyebrow="Legal" title="Privacy Policy" updated="2026-05-18">
      <p>
        This policy covers <strong>this marketing website only</strong>. It does not cover any
        Pufferblow instance you join — each instance is run by its own operator and has its own
        data policy.
      </p>

      <LegalSection title="What this site collects">
        <p>
          This site is a static download portal. We do not run analytics scripts, set advertising
          cookies, or build behavioral profiles. Standard web server access logs may briefly
          record IP addresses and user-agent strings for operational and abuse-prevention
          purposes.
        </p>
      </LegalSection>

      <LegalSection title="Third-party requests your browser makes">
        <p>
          To load the page and the download list, your browser contacts a small number of third
          parties:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>GitHub</strong> — the download page fetches the public Releases API and links
            directly to release binaries hosted on GitHub.
          </li>
          <li>
            <strong>Google Fonts</strong> — fonts are loaded from <code>fonts.googleapis.com</code>{" "}
            and <code>fonts.gstatic.com</code>.
          </li>
        </ul>
        <p>
          Those services have their own privacy policies and may log the request. We don't pass
          them any information beyond what your browser sends automatically.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          This site does not set cookies. (An individual Pufferblow instance you sign into has its
          own session cookies — those are scoped to that instance, not to this site.)
        </p>
      </LegalSection>

      <LegalSection title="Your instance data">
        <p>
          Anything you do inside a Pufferblow instance — messages, channels, accounts, voice
          calls — is stored on that instance and governed by that operator's policy. The
          Pufferblow project does not host instances, does not have access to instance data, and
          is not a data processor for anyone else's instance.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If this policy changes in a meaningful way, the “Last updated” date above will reflect
          it. Substantive changes will also be noted in the project repository.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy: open an issue on the project repository or use the contact
          path documented there.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
