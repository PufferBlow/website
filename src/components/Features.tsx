import { Activity, Blocks, Globe, HardDrive, Hash, KeyRound, Mic, Network, ShieldCheck, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

// Each line is something the code does today. Where a thing is still being built the line says so.
const FEATURES: Feature[] = [
  {
    icon: HardDrive,
    title: "Yours to run",
    body: "Open source (GPL-3.0) and self-hosted. One server, one media server and a database; the Docker setup brings a TURN relay too. Your messages stay on your machine.",
  },
  {
    icon: Network,
    title: "Federated, on your terms",
    body: "Talk to people on other instances by handle. You pick the mode (open, allowlist or closed), approve or block each instance, and decide whether its pictures and files show up.",
  },
  {
    icon: ShieldCheck,
    title: "Calls only two people can hear",
    body: "1:1 calls are end-to-end encrypted. Each side signs its connection with a key only its device holds, and you can compare a safety number. Even through the media server, the audio is sealed.",
  },
  {
    icon: Mic,
    title: "Voice that holds up",
    body: "Voice channels run on a Go media server: join, mute, deafen, see who is speaking. Rooms rejoin cleanly, and a call that cannot connect directly carries on through the server.",
  },
  {
    icon: Hash,
    title: "Rooms with some order",
    body: "Text and voice channels in categories, topics, pins, replies, reactions and search. Reactions are puffer faces first, emoji too.",
  },
  {
    icon: KeyRound,
    title: "Roles and a clear owner",
    body: "Owner, admins and roles with privileges you can read. Private channels, timeouts, and an audit trail of who changed what.",
  },
  {
    icon: Activity,
    title: "Health you can see",
    body: "Uptime, latency, checks, incidents and linked instances on one page, so you know before your members tell you.",
  },
  {
    icon: Blocks,
    title: "Built to be extended",
    body: "Bot tokens that never do more than their owner can, a Python SDK, a documented API and a realtime protocol with versioned events.",
  },
  {
    icon: Globe,
    title: "Recognisable everywhere",
    body: "Everyone gets a fish and a colour from their handle, the same on every instance, so you can tell people apart across the fediverse before they set a picture.",
  },
];

export default function Features() {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, body }) => (
        <li key={title} className="flex flex-col gap-3 rounded-xl bg-surface p-5 shadow-[inset_0_0_0_1px_rgba(242,242,242,0.08)]">
          <span className="grid size-10 place-items-center rounded-lg bg-surface-secondary text-text">
            <Icon size={19} aria-hidden="true" />
          </span>
          <h3 className="pb-section-label m-0 !text-[13px] !text-text">{title}</h3>
          <p className="m-0 text-[14.5px] leading-relaxed text-text-tertiary">{body}</p>
        </li>
      ))}
    </ul>
  );
}
