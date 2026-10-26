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
import { BadgeOf } from "./app/roleBadge";
import { SpaceIcon } from "./app/SpaceIcon";
import { Terminal } from "./app/Terminal";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  points: { title: string; text: string }[];
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

    points: [
      { title: "One small stack", text: "The server, the media server and a database. The Docker setup adds a TURN relay so calls connect through strict networks." },
      { title: "Your data stays with you", text: "Messages and files live on the machine you run it on. Nothing needs a third-party service to work." },
      { title: "Open source", text: "GPL-3.0. Read the code, send a fix, file an issue. The operator guide walks through setting it up." },
      { title: "Still in development", text: "It is not ready for production use yet. The roadmap is public." },
    ],
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

    points: [
      { title: "Three modes", text: "Open talks to anyone, allowlist only to instances you approved, closed to nobody." },
      { title: "Per instance", text: "Approve, limit or block each instance on its own. Blocking one does not touch the rest." },
      { title: "Media you choose", text: "Decide whether a peer’s pictures and files are shown on your instance." },
      { title: "Learned on first contact", text: "The first time an instance shows up, yours asks what software and version it runs, and keeps the answer." },
      { title: "Handles", text: "People are addressed as name@instance, so a person is the same wherever you meet them." },
    ],
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

    points: [
      { title: "Keys stay on devices", text: "Each side signs its connection with a key only its device holds, so the server cannot stand in for either of you." },
      { title: "A safety number", text: "Compare it out loud or in person to be sure no one is in the middle. Verified calls say so." },
      { title: "Sealed through the server", text: "The media server forwards the audio but cannot read it." },
      { title: "A record in the chat", text: "Calls show up in the direct message with their length, or as missed." },
      { title: "Only 1:1 calls", text: "Voice channels are group calls the media server hosts. They are not end-to-end encrypted, and the app does not say they are." },
    ],
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
    body: "Voice channels run on a Go media server: join, mute, deafen, see who is speaking. Voice channels rejoin cleanly, and a call that cannot connect directly carries on through the server.",

    points: [
      { title: "Everything you expect", text: "Join, leave, mute, deafen, and a ring around whoever is speaking." },
      { title: "Built on a Go media server", text: "One SFU carries each voice channel, so a call does not depend on everyone reaching everyone." },
      { title: "Rejoins cleanly", text: "Drop out and come back, and you land back in the channel instead of a ghost seat." },
      { title: "A way through", text: "When two people cannot connect directly, the call goes through the server’s relay." },
    ],
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
    title: "Channels with some order",
    body: "Text and voice channels in categories, topics, pins, replies, reactions and search. Reactions are puffer faces first, emoji too.",

    points: [
      { title: "Categories", text: "Channels sit in categories you can collapse. Text and Voice are the defaults and can be renamed or reordered." },
      { title: "Pins and replies", text: "Pin what matters and see it in one list. Reply to a message and the quote stays attached." },
      { title: "Search that filters", text: "Type from:ada, has:file, has:image or is:pinned along with words to narrow results." },
      { title: "Files and pictures", text: "Attach them to a message, with a description, and edit it afterwards." },
      { title: "Puff reactions", text: "Reactions are puffer faces first, emoji too, with a count of who reacted." },
    ],
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

    points: [
      { title: "Roles you can read", text: "Each role lists what it may do, and the member list is grouped by role with its colour." },
      { title: "A clear owner", text: "One owner, then admins, then everyone else. Nobody guesses who can change settings." },
      { title: "Private channels", text: "Keep a channel to the people who should see it." },
      { title: "Timeouts", text: "Pause someone for a set time without removing them." },
      { title: "An audit log", text: "Who changed what, and when, kept where admins can read it." },
    ],
    visual: (
      <div className="flex flex-col gap-1.5">
        {[
          { who: "ada", role: "Owner" },
          { who: "grace", role: "Admin" },
          { who: "linus", role: "Moderator" },
        ].map((p) => (
          <div key={p.who} className={row}>
            <Avatar handle={`${p.who}@switchyard.works`} size={26} />
            <span className="text-[13px] font-semibold capitalize">
              {p.who}
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[12px] text-text-tertiary">
              {p.role}
              <BadgeOf role={p.role} size={20} />
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

    points: [
      { title: "Uptime and latency", text: "A 90-day uptime bar and response times, so slow patches are visible." },
      { title: "Checks", text: "Database, media server and the rest reported one by one." },
      { title: "Incidents", text: "When something went wrong and for how long, in one list." },
      { title: "Linked instances", text: "The instances you federate with, and which ones are slow, next to your own numbers." },
    ],
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

    points: [
      { title: "Bots that stay in their lane", text: "A bot token can never do more than the person who made it." },
      { title: "pypufferblow", text: "A Python SDK for signing in, reading channels and sending messages." },
      { title: "A documented API", text: "Every route is described in the developer docs." },
      { title: "A realtime protocol", text: "Events carry a version, so clients and bots can tell when something changed shape." },
    ],
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

    points: [
      { title: "From the handle", text: "Your fish and colour are worked out from your handle, so everyone gets one without doing anything." },
      { title: "The same everywhere", text: "Another instance computes the same face, so you recognise people across the fediverse." },
      { title: "Yours to replace", text: "Set a picture whenever you like; the fish is the fallback." },
      { title: "Servers too", text: "Server tiles get a generated icon the same way." },
    ],
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
    <ul className="m-0 flex list-none flex-col gap-6 p-0">
      {FEATURES.map(({ icon: Icon, title, body, points, visual }, n) => (
        <li
          key={title}
          className="grid grid-cols-1 items-center gap-8 rounded-2xl bg-surface p-6 shadow-[inset_0_0_0_1px_rgba(242,242,242,0.08)] sm:p-8 lg:grid-cols-2 lg:gap-14 lg:p-10"
        >
          <div className={`min-w-0 ${n % 2 ? "lg:order-2" : ""}`}>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-md bg-surface-secondary text-text">
                <Icon size={18} aria-hidden="true" />
              </span>
              <h3 className="m-0 text-2xl sm:text-3xl">{title}</h3>
            </div>
            <p className="mb-0 mt-4 text-base leading-relaxed text-text-body">{body}</p>
            <dl className="m-0 mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {points.map((pt) => (
                <div key={pt.title}>
                  <dt className="text-[14px] font-semibold text-text">{pt.title}</dt>
                  <dd className="m-0 mt-1 text-[13.5px] leading-relaxed text-text-tertiary">{pt.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={`min-w-0 rounded-xl bg-surface-tertiary/40 p-4 sm:p-6 ${n % 2 ? "lg:order-1" : ""}`}>
            <div className="mx-auto w-full max-w-md">{visual}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
