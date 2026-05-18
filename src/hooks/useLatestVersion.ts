import { useEffect, useState } from "react";

import { fetchReleases } from "../services/githubReleases";

// Latest stable client release shown in the nav. Cached at the module
// level so navigating between routes doesn't refetch — the GitHub API
// is rate-limited per IP, and the version doesn't change inside a
// single SPA session.
let cached: Promise<string | null> | null = null;

function load(): Promise<string | null> {
  if (cached) return cached;
  cached = fetchReleases()
    .then((releases) => {
      const latest = releases.find((r) => !r.prerelease) ?? releases[0] ?? null;
      return latest ? latest.tag_name : null;
    })
    .catch(() => null);
  return cached;
}

export function useLatestVersion(): string | null {
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    load().then((v) => {
      if (!cancelled) setTag(v);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return tag;
}
