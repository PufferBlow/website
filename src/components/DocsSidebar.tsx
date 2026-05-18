import { NavLink } from "react-router-dom";

import { manifest } from "../docs/manifest";

function navClass({ isActive }: { isActive: boolean }): string {
  const base =
    "block rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-hover)]";
  return isActive
    ? `${base} bg-[var(--color-active)] text-[var(--color-text)] font-medium`
    : `${base} text-[var(--color-text-secondary)] hover:text-[var(--color-text)]`;
}

export default function DocsSidebar() {
  return (
    <nav aria-label="Documentation" className="space-y-6 text-sm">
      <div>
        <NavLink to="/docs" end className={navClass}>
          {manifest.home.title}
        </NavLink>
      </div>
      {manifest.sections.map((section) => (
        <div key={section.slug}>
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.pages.map((page) => (
              <li key={page.slug}>
                <NavLink
                  to={page.slug === section.slug ? `/docs/${page.slug}` : `/docs/${page.slug}`}
                  end
                  className={navClass}
                >
                  {page.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
