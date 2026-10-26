import { DEFAULT_BADGES, RoleBadge } from "@pufferblow/spines";

/** The badge a built-in role (Owner, Admin, Moderator, ...) is drawn with in the app; none for ordinary members. */
export function BadgeOf({ role, size = 16 }: { role: string; size?: number }) {
  const preset = DEFAULT_BADGES.find((p) => p.name === role);
  if (!preset) return null;
  return <RoleBadge badge={{ tier: preset.tier, tone: preset.tone, glyph: preset.glyph }} size={size} label={role} />;
}
