// The app's avatar (client-new `components/dashboard/Avatar.tsx`), without the account plumbing: the
// fish for a handle, a presence dot cut out of the surface, the sage speaking ring, the white
// muted ring. Same sizes, same rules.

import { defaultAvatarUrl } from "../../lib/identity";

export type Presence = "online" | "idle" | "dnd" | "offline";

const PRESENCE: Record<Presence, { label: string; color: string; dot: "solid" | "hollow" | "none" }> = {
  online: { label: "Online", color: "#f2f2f2", dot: "solid" },
  idle: { label: "Idle", color: "#9a9a9a", dot: "hollow" },
  dnd: { label: "Do not disturb", color: "#e2654f", dot: "solid" },
  offline: { label: "Offline", color: "#555555", dot: "none" },
};

export const presenceLabel = (p: Presence) => PRESENCE[p].label;

interface AvatarProps {
  /** The handle the fish is derived from (`name@instance`). */
  handle: string;
  size?: number;
  presence?: Presence;
  /** In a call: the sage dot, shown over the presence dot. */
  activity?: boolean;
  speaking?: boolean;
  muted?: boolean;
  /** The surface behind it, so the dot is cut out of that colour. */
  ringColor?: string;
}

export function Avatar({ handle, size = 40, presence, activity, speaking, muted, ringColor = "var(--color-surface)" }: AvatarProps) {
  const dot = Math.max(10, Math.round(size * 0.3));
  const look = presence ? PRESENCE[presence] : undefined;
  const showDot = size >= 24 && (activity || (look !== undefined && look.dot !== "none"));
  const dim = look?.dot === "none" && !activity;
  const ring = speaking ? undefined : muted ? `0 0 0 2px ${ringColor}, 0 0 0 4px var(--color-text)` : undefined;

  return (
    <div
      className={["relative shrink-0 rounded-full", speaking ? "pb-anim-speaking" : ""].join(" ")}
      style={{ width: size, height: size, opacity: dim ? 0.55 : 1, boxShadow: ring, ["--pb-ring-gap" as string]: ringColor }}
      aria-hidden="true"
    >
      <img src={defaultAvatarUrl(handle)} alt="" draggable={false} className="h-full w-full rounded-full object-cover" />
      {showDot && (
        <span
          className="absolute rounded-full"
          style={{
            width: dot,
            height: dot,
            right: -1,
            bottom: -1,
            background: activity ? "#9fd487" : look?.dot === "hollow" ? ringColor : look?.color,
            boxShadow: `${!activity && look?.dot === "hollow" ? `inset 0 0 0 3px ${look.color}, ` : ""}0 0 0 3px ${ringColor}`,
          }}
        />
      )}
    </div>
  );
}

/** A count on a tile or a channel. Red means someone mentioned you. */
export function CountBadge({ count, className = "" }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span className={`grid h-5 min-w-5 place-items-center rounded-[10px] bg-error px-1.5 font-sans text-[11px] font-bold leading-none text-white ${className}`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}
