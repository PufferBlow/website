// The feature cards. Each one shows the thing instead of describing it: the same components the app
// uses (avatars, role tags, host pills, puff reactions) and the commands you would type.

import {
  Activity,
  Blocks,
  Globe,
  HardDrive,
  Hash,
  KeyRound,
  Lock,
  Mic,
  MicOff,
  Network,
  ShieldCheck,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Avatar } from "./app/Avatar";
import { HostPill } from "./app/HostPill";
import { PuffFace } from "./app/PuffFace";
import { RoleTag } from "./app/RoleTag";
import { SpaceIcon } from "./app/SpaceIcon";
import { Terminal } from "./app/Terminal";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  visual: ReactNode;
}

const row =
  "flex items-center gap-2.5 rounded-md bg-surface-secondary px-2.5 py-2";

const PEERS = [
  {
    host: "kiln.social",
    name: "Kiln",
    state: "Federating",
    tone: "text-success",
  },
  {
    host: "mesh.garden",
    name: "Mesh Garden",
    state: "Federating",
    tone: "text-success",
  },
  {
    host: "new.example",
    name: "New instance",
    state: "Pending",
    tone: "text-warning",
  },
];

const UPTIME = Array.from({ length: 45 }, (_, i) =>
  i === 12 ? "warn" : i === 31 ? "down" : "ok",
);

// Each line is something the code does today. Where a thing is still being built the line says so.
const FEATURES: Feature[] = [
  {
    icon: HardDrive,
    title: "Yours to run",
    body: "Open source (GPL-3.0) and self-hosted. One server, one media server and a database; the Docker setup brings a TURN relay too. Your messages stay on your machine.",
    visual: (
      <Terminal
        title="your server"
        lines={[
          { cmd: "docker compose up -d" },
          { out: "✔ postgres           healthy", tone: "ok" },
          { out: "✔ pufferblow-server  :7575", tone: "ok" },
          { out: "✔ media-sfu          :8787", tone: "ok" },
          { out: "✔ coturn             :3478", tone: "ok" },
        ]}
      />
    ),
  },
  {
    icon: Network,
    title: "Federated, on your terms",
    body: "Talk to people on other instances by handle. You pick the mode (open, allowlist or closed), approve or block each instance, and decide whether its pictures and files show up.",
    visual: (
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1 rounded-md bg-background p-1 text-[11.5px] font-semibold">
          {["Open", "Allowlist", "Closed"].map((m, i) => (
            <span
              key={m}
              className={`flex-1 rounded-sm py-1 text-center ${i === 1 ? "bg-surface-tertiary text-text" : "text-text-muted"}`}
            >
              {m}
            </span>
          ))}
        </div>
        {PEERS.map((p) => (
          <div key={p.host} className={row}>
            <SpaceIcon id={p.host} name={p.name} size={26} />
            <HostPill host={p.host} />
            <span className={`ml-auto text-[11.5px] font-semibold ${p.tone}`}>
              {p.state}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Calls only two people can hear",
    body: "1:1 calls are end-to-end encrypted. Each side signs its connection with a key only its device holds, and you can compare a safety number. Even through the media server, the audio is sealed.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className={row}>
          <Avatar
            handle="grace@switchyard.works"
            size={30}
            speaking
            ringColor="var(--color-surface-secondary)"
          />
          <div className="min-w-0 leading-tight">
            <div className="text-[13px] font-bold">grace</div>
            <div className="flex items-center gap-1 text-[11.5px] font-semibold text-success">
              <ShieldCheck size={12} aria-hidden="true" />
              End-to-end encrypted · verified
            </div>
          </div>
          <span className="ml-auto text-[12px] tabular-nums text-text-tertiary">
            4:12
          </span>
        </div>
        <p
          aria-label="Safety number"
          className="m-0 grid grid-cols-4 gap-x-2 gap-y-1 rounded-md bg-background px-3 py-2 text-center font-mono text-[12px] tabular-nums text-text-body"
        >
          {"26568 72542 65128 89547 07755 95815 25399 64547"
            .split(" ")
            .map((g) => (
              <span key={g}>{g}</span>
            ))}
        </p>
      </div>
    ),
  },
  {
    icon: Mic,
    title: "Voice that holds up",
    body: "Voice channels run on a Go media server: join, mute, deafen, see who is speaking. Rooms rejoin cleanly, and a call that cannot connect directly carries on through the server.",
    visual: (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 px-1 text-[13px] font-semibold text-success">
          <Volume2 size={15} aria-hidden="true" />
          Lounge
        </div>
        {[
          { key: "ada", speaking: true, muted: false },
          { key: "grace", speaking: false, muted: true },
          { key: "linus", speaking: false, muted: false },
        ].map((p) => (
          <div key={p.key} className={row}>
            <Avatar
              handle={`${p.key}@switchyard.works`}
              size={26}
              speaking={p.speaking}
              muted={p.muted}
              ringColor="var(--color-surface-secondary)"
            />
            <span className="text-[13px] capitalize text-text-body">
              {p.key}
            </span>
            {p.muted ? (
              <MicOff
                size={13}
                className="ml-auto text-text-muted"
                aria-label="Muted"
              />
            ) : null}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Hash,
    title: "Rooms with some order",
    body: "Text and voice channels in categories, topics, pins, replies, reactions and search. Reactions are puffer faces first, emoji too.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className="rounded-md bg-background px-2 py-1.5 text-[13px]">
          <div className="pb-section-label !text-[10.5px] pb-1">
            Text Channels
          </div>
          <div className="flex items-center gap-1.5 rounded-sm bg-surface-tertiary px-2 py-1 font-semibold">
            <Hash size={14} aria-hidden="true" />
            general
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 text-text-tertiary">
            <Lock size={13} aria-hidden="true" />
            staff
          </div>
        </div>
        <div className={`${row} !items-start`}>
          <Avatar handle="ada@switchyard.works" size={28} />
          <div className="min-w-0">
            <span className="pb-username">Ada</span>
            <p className="pb-message-body m-0 text-[13px]">
              Pinned the checklist. Fish only.
            </p>
            <div className="mt-1 flex gap-1.5">
              {[
                { r: "puff:happy", n: 3 },
                { r: "puff:wink", n: 1 },
              ].map(({ r, n }) => (
                <span
                  key={r}
                  className="flex h-6 items-center gap-1 rounded-pill bg-surface-tertiary pl-1 pr-2 text-xs font-semibold"
                >
                  <PuffFace reaction={r} size={16} />
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: KeyRound,
    title: "Roles and a clear owner",
    body: "Owner, admins and roles with privileges you can read. Private channels, timeouts, and an audit trail of who changed what.",
    visual: (
      <div className="flex flex-col gap-1.5">
        {[
          { who: "ada", role: "Owner", colour: "#e3ae4f" },
          { who: "grace", role: "Moderator", colour: "#a99cf2" },
          { who: "linus", role: "Member", colour: "#9fcf8a" },
        ].map((p) => (
          <div key={p.who} className={row}>
            <Avatar handle={`${p.who}@switchyard.works`} size={26} />
            <span className="text-[13px] font-semibold capitalize">
              {p.who}
            </span>
            <span className="ml-auto">
              <RoleTag name={p.role} colour={p.colour} />
            </span>
          </div>
        ))}
        <Terminal
          title="audit log"
          lines={[
            { out: "grace   timed out linus    10m" },
            { out: "ada     created  #design" },
          ]}
          className="mt-0.5"
        />
      </div>
    ),
  },
  {
    icon: Activity,
    title: "Health you can see",
    body: "Uptime, latency, checks, incidents and linked instances on one page, so you know before your members tell you.",
    visual: (
      <div className="flex flex-col gap-2.5 rounded-md bg-background p-3">
        <div className="flex items-baseline justify-between">
          <span className="font-heading text-2xl font-semibold tabular-nums">
            99.94%
          </span>
          <span className="text-[11.5px] text-text-tertiary">
            90 days · p95 82 ms
          </span>
        </div>
        <div
          className="flex h-7 items-end gap-[2px]"
          role="img"
          aria-label="Uptime over the last days"
        >
          {UPTIME.map((state, i) => (
            <span
              key={i}
              className={`h-full flex-1 rounded-[1px] ${state === "ok" ? "bg-success/70" : state === "warn" ? "bg-warning" : "bg-error"}`}
            />
          ))}
        </div>
        <div className="flex gap-3 text-[11.5px] text-text-tertiary">
          <span className="text-success">● database</span>
          <span className="text-success">● media</span>
          <span className="text-warning">● 1 peer slow</span>
        </div>
      </div>
    ),
  },
  {
    icon: Blocks,
    title: "Built to be extended",
    body: "Bot tokens that never do more than their owner can, a Python SDK, a documented API and a realtime protocol with versioned events.",
    visual: (
      <Terminal
        title="bot.py"
        lines={[
          { cmd: "pip install pypufferblow" },
          {
            out: (
              <>
                client =
                Client(ClientOptions(instance=&quot;https://chat.example.org&quot;,
                …))
              </>
            ),
          },
          { out: <>client.users.sign_in()</> },
          {
            out: (
              <>
                client.channels().send_message(&quot;general&quot;, &quot;Hello,
                world!&quot;)
              </>
            ),
          },
        ]}
      />
    ),
  },
  {
    icon: Globe,
    title: "Recognisable everywhere",
    body: "Everyone gets a fish and a colour from their handle, the same on every instance, so you can tell people apart across the fediverse before they set a picture.",
    visual: (
      <div className="flex flex-col gap-2.5 rounded-md bg-background p-3">
        <div className="flex items-center justify-between">
          {["ada", "grace", "linus", "margaret", "alan", "you"].map((n) => (
            <Avatar key={n} handle={`${n}@switchyard.works`} size={38} />
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11.5px] text-text-tertiary">
          <Avatar handle="margaret@mesh.garden" size={22} />
          <span>margaret on mesh.garden looks the same on every instance</span>
        </div>
      </div>
    ),
  },
];

export default function Features() {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, body, visual }) => (
        <li
          key={title}
          className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-[inset_0_0_0_1px_rgba(242,242,242,0.08)]"
        >
          <div className="min-h-[168px] rounded-lg bg-surface-tertiary/40 p-2.5">
            {visual}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="grid size-7 place-items-center rounded-md bg-surface-secondary text-text">
              <Icon size={15} aria-hidden="true" />
            </span>
            <h3 className="pb-section-label m-0 !text-[13px] !text-text">
              {title}
            </h3>
          </div>
          <p className="m-0 text-[14px] leading-relaxed text-text-tertiary">
            {body}
          </p>
        </li>
      ))}
    </ul>
  );
}
