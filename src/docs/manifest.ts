export type DocPage = {
  slug: string;
  title: string;
  file: string;
};

export type DocSection = {
  slug: string;
  title: string;
  pages: DocPage[];
};

export type DocManifest = {
  home: DocPage;
  sections: DocSection[];
};

export const manifest: DocManifest = {
  home: { slug: "", title: "Overview", file: "index.md" },
  sections: [
    {
      slug: "user",
      title: "User",
      pages: [
        { slug: "user", title: "Joining a community", file: "user/index.md" },
        {
          slug: "user/install",
          title: "Install your own server",
          file: "user/install.md",
        },
      ],
    },
    {
      slug: "operator",
      title: "Operator",
      pages: [
        { slug: "operator", title: "Operator overview", file: "operator/index.md" },
        {
          slug: "operator/docker",
          title: "Docker (production)",
          file: "operator/docker.md",
        },
        {
          slug: "operator/backup",
          title: "Backup & restore",
          file: "operator/backup.md",
        },
        {
          slug: "operator/federation",
          title: "Federation",
          file: "operator/federation.md",
        },
        {
          slug: "operator/operations",
          title: "Operations & CLI",
          file: "operator/operations.md",
        },
        {
          slug: "operator/release-notes-v1.0",
          title: "v1.0 release notes",
          file: "operator/release-notes-v1.0.md",
        },
      ],
    },
    {
      slug: "developer",
      title: "Developer",
      pages: [
        {
          slug: "developer",
          title: "Developer overview",
          file: "developer/index.md",
        },
        {
          slug: "developer/architecture",
          title: "Server architecture",
          file: "developer/architecture.md",
        },
        {
          slug: "developer/roles",
          title: "Roles & privileges",
          file: "developer/roles.md",
        },
        {
          slug: "developer/api-reference",
          title: "API reference",
          file: "developer/api-reference.md",
        },
        {
          slug: "developer/client",
          title: "Client (web + desktop)",
          file: "developer/client.md",
        },
        {
          slug: "developer/sdk",
          title: "Python SDK",
          file: "developer/sdk.md",
        },
      ],
    },
  ],
};

export function findPage(slug: string): DocPage | null {
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  if (normalized === "" || normalized === "index") return manifest.home;
  for (const section of manifest.sections) {
    for (const page of section.pages) {
      if (page.slug === normalized) return page;
    }
  }
  return null;
}

export function sectionOf(slug: string): DocSection | null {
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  if (normalized === "") return null;
  const top = normalized.split("/")[0];
  return manifest.sections.find((s) => s.slug === top) ?? null;
}
