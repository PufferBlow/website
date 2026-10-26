// A working copy of the app's chat view, built from the same markup, sizes and classes as the real
// client (client): the space rail, the sidebar with its banner and grouped channels, the voice
// roster with speaking rings, the chat with role tags, mentions, replies, attachments and puff
// reactions, pins and search with filters, the member list grouped by role, and Home (friends and
// direct messages with a call log). Everything is local state: switch channels, collapse a category,
// drag the server tiles, send a message, pin one, search, puff a reaction, join the voice channel.
// Nothing leaves the page.

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  FileText,
  Globe,
  Hash,
  ArrowLeftRight,
  Headphones,
  Lock,
  Mic,
  MicOff,
  MessageSquare,
  Paperclip,
  Phone,
  PhoneMissed,
  Pin,
  Plus,
  Reply,
  Search,
  Send,
  Settings,
  UserPlus,
  Users,
  Volume2,
  X,
} from "lucide-react";

import { defaultBannerCss } from "@pufferblow/spines";
import { parsePuff, puffReaction, PUFF_FACES } from "@pufferblow/spines";
import { Avatar, CountBadge, presenceLabel, type Presence } from "./app/Avatar";
import { HostPill } from "./app/HostPill";
import { PuffFace } from "./app/PuffFace";
import { BadgeOf } from "./app/roleBadge";
import { SpaceIcon } from "./app/SpaceIcon";
import { PufferblowMark } from "./PufferblowBrand";

const HOME = "switchyard.works";
const ME = { name: "you", handle: `you@${HOME}` };

interface Person {
  name: string;
  host: string;
  status: Presence;
  note?: string;
  role?: { name: string; colour: string };
}

const ROLE_ORDER = ["Owner", "Moderator", "Member"] as const;

const BRASS = "#e3ae4f";
const VIOLET = "#a99cf2";
const SAGE = "#9fcf8a";

const PEOPLE: Record<string, Person> = {
  ada: {
    name: "Ada",
    host: HOME,
    status: "online",
    role: { name: "Owner", colour: BRASS },
  },
  grace: {
    name: "Grace",
    host: HOME,
    status: "online",
    role: { name: "Moderator", colour: VIOLET },
  },
  linus: {
    name: "Linus",
    host: HOME,
    status: "idle",
    role: { name: "Member", colour: SAGE },
  },
  margaret: {
    name: "Margaret",
    host: "mesh.garden",
    status: "online",
    note: "Compiling something",
    role: { name: "Member", colour: SAGE },
  },
  alan: {
    name: "Alan",
    host: HOME,
    status: "offline",
    role: { name: "Member", colour: SAGE },
  },
  you: {
    name: "you",
    host: HOME,
    status: "online",
    role: { name: "Member", colour: SAGE },
  },
};

const handleOf = (key: string) =>
  `${PEOPLE[key]!.name.toLowerCase()}@${PEOPLE[key]!.host}`;

interface Message {
  id: number;
  who: string;
  time: string;
  body: Segment[];
  reactions: Record<string, { count: number; mine: boolean }>;
  reply?: { who: string; text: string };
  attachment?: {
    name: string;
    size: string;
    kind: "image" | "file";
    seed?: string;
  };
}

type Segment = string | { mention: string; you?: boolean } | { code: string };

const puff = (face: string) => puffReaction(face as never);

const SEED: Record<string, Message[]> = {
  welcome: [
    {
      id: 1,
      who: "ada",
      time: "2:31 PM",
      body: ["Welcome in. Channels on the left, people on the right."],
      reactions: { [puff("happy")]: { count: 3, mine: false } },
    },
    {
      id: 2,
      who: "ada",
      time: "2:31 PM",
      body: [
        "This whole instance runs on one small server. Try the message box below.",
      ],
      reactions: {},
    },
    {
      id: 3,
      who: "grace",
      time: "2:33 PM",
      body: [
        { mention: "you", you: true },
        " moved the roadmap thread to ",
        { code: "#announcements" },
        ".",
      ],
      reactions: { [puff("wink")]: { count: 1, mine: false } },
    },
    {
      id: 4,
      who: "margaret",
      time: "2:36 PM",
      body: [
        "Hello from mesh.garden. I can see this channel from my instance.",
      ],
      reactions: { [puff("surprised")]: { count: 2, mine: false } },
    },
    {
      id: 10,
      who: "ada",
      time: "2:40 PM",
      body: ["Good to have you here, Margaret."],
      reply: {
        who: "margaret",
        text: "Hello from mesh.garden. I can see this channel from my instance.",
      },
      reactions: {},
    },
  ],
  announcements: [
    {
      id: 5,
      who: "ada",
      time: "1:02 PM",
      body: [
        "The next release is pinned. Voice calls are end-to-end encrypted now.",
      ],
      reactions: { [puff("default")]: { count: 4, mine: false } },
    },
    {
      id: 11,
      who: "ada",
      time: "1:03 PM",
      body: ["Release notes attached."],
      attachment: { name: "release-notes.pdf", size: "212 KB", kind: "file" },
      reactions: {},
    },
  ],
  general: [
    {
      id: 6,
      who: "linus",
      time: "11:40 AM",
      body: ["Anyone up for a call later?"],
      reactions: {},
    },
    {
      id: 12,
      who: "linus",
      time: "11:41 AM",
      body: ["Here is the view from my desk."],
      attachment: {
        name: "desk.jpg",
        size: "1.4 MB",
        kind: "image",
        seed: "linus@switchyard.works",
      },
      reactions: {},
    },
    {
      id: 7,
      who: "grace",
      time: "11:42 AM",
      body: ["Yes, after lunch."],
      reactions: {},
    },
  ],
  design: [
    {
      id: 8,
      who: "grace",
      time: "9:15 AM",
      body: ["Pinned the checklist. Fish only, no emoji."],
      reactions: { [puff("sleepy")]: { count: 1, mine: false } },
    },
  ],
  staff: [
    {
      id: 9,
      who: "ada",
      time: "8:00 AM",
      body: ["Only staff can see this channel."],
      reactions: {},
    },
  ],
};

// "Text Channels" and "Voice Channels" are the default categories every channel starts in (an admin can
// rename them); "Information" is one the owner made. Every category collapses.
const CHANNELS = [
  {
    group: "Information",
    items: [{ id: "welcome" }, { id: "announcements", pings: 2 }],
  },
  {
    group: "Text Channels",
    items: [
      { id: "general" },
      { id: "design" },
      { id: "staff", private: true },
    ],
  },
];

const RAIL = [
  { host: "switchyard.works", name: "Switchyard", badge: 2 },
  { host: "mesh.garden", name: "Mesh Garden", badge: 0 },
  { host: "kiln.social", name: "Kiln", badge: 0 },
];

const FRIENDS = ["grace", "margaret", "linus", "alan"];

const iconButton =
  "grid h-8 w-8 place-items-center rounded-md text-text-tertiary transition-colors duration-(--motion-fast) hover:bg-active hover:text-text";

function Tile({
  selected,
  children,
  label,
  className = "",
  onClick,
  drag,
}: {
  selected?: boolean;
  children: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
  drag?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className="group/tile relative flex w-full justify-center" {...drag}>
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-r bg-text transition-[height] duration-(--motion-base) ease-(--motion-ease-out) ${selected ? "h-9" : "h-0 group-hover/tile:h-5"}`}
      />
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        className={`relative grid h-12 w-12 place-items-center font-display text-lg text-on-primary transition-[border-radius,filter] hover:rounded-[12px] hover:brightness-110 ${selected ? "rounded-[12px]" : "rounded-[14px]"} ${className}`}
      >
        {children}
      </button>
    </div>
  );
}

function Message({
  message,
  grouped,
  pinned,
  onReact,
  onPin,
}: {
  message: Message;
  grouped: boolean;
  pinned: boolean;
  onReact: (id: number, reaction: string) => void;
  onPin: (id: number) => void;
}) {
  const person = PEOPLE[message.who]!;
  const [pops, setPops] = useState<Record<string, number>>({});
  const remote = person.host !== HOME;
  return (
    <article
      className={`group relative flex flex-wrap gap-x-[14px] gap-y-0.5 px-4 hover:bg-text/[0.03] ${grouped ? "py-px" : "mt-[14px] py-[3px] first:mt-0"}`}
    >
      <div className="w-10 shrink-0">
        {grouped ? (
          <span className="block pt-[3px] text-center text-[10.5px] text-text-muted opacity-0 group-hover:opacity-100">
            {message.time.replace(/ [AP]M/, "")}
          </span>
        ) : (
          <Avatar handle={handleOf(message.who)} size={40} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {message.reply && (
          <div className="mb-0.5 flex min-w-0 items-center gap-1.5 text-[12px] text-text-tertiary">
            <Reply size={12} className="shrink-0" aria-hidden="true" />
            <Avatar handle={handleOf(message.reply.who)} size={14} />
            <span className="shrink-0 font-semibold text-text-body">
              {PEOPLE[message.reply.who]!.name}
            </span>
            <span className="truncate">{message.reply.text}</span>
          </div>
        )}
        {!grouped && (
          <header className="flex flex-wrap items-baseline gap-2">
            <span className="pb-username">{person.name}</span>
            {person.role && <BadgeOf role={person.role.name} size={16} />}
            {remote && <HostPill host={person.host} />}
            <time className="pb-timestamp">{message.time}</time>
            {pinned && (
              <Pin size={11} className="text-text-muted" aria-label="Pinned" />
            )}
          </header>
        )}
        <p className="pb-message-body m-0 break-words">
          {message.body.map((part, i) =>
            typeof part === "string" ? (
              part
            ) : "mention" in part ? (
              <span
                key={i}
                className={part.you ? "pb-mention-you" : "pb-mention-other"}
              >
                @{part.mention}
              </span>
            ) : (
              <code key={i} className="pb-inline-code">
                {part.code}
              </code>
            ),
          )}
        </p>
        {message.attachment && (
          <div className="mt-1.5 w-fit max-w-full overflow-hidden rounded-lg bg-surface-secondary shadow-[inset_0_0_0_1px_rgba(242,242,242,0.08)]">
            {message.attachment.kind === "image" ? (
              <div
                className="h-[120px] w-[220px]"
                style={{
                  background: defaultBannerCss(message.attachment.seed ?? HOME),
                }}
                role="img"
                aria-label={message.attachment.name}
              />
            ) : null}
            <div className="flex items-center gap-2.5 px-3 py-2">
              {message.attachment.kind === "file" && (
                <FileText
                  size={22}
                  className="shrink-0 text-text-tertiary"
                  aria-hidden="true"
                />
              )}
              <div className="min-w-0 leading-tight">
                <div className="truncate text-[13px] font-semibold text-text-body">
                  {message.attachment.name}
                </div>
                <div className="pb-meta text-[11px]">
                  {message.attachment.size}
                </div>
              </div>
            </div>
          </div>
        )}
        {Object.keys(message.reactions).length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {Object.entries(message.reactions).map(
              ([reaction, { count, mine }]) => {
                const face = parsePuff(reaction);
                return (
                  <button
                    key={reaction}
                    type="button"
                    aria-pressed={mine}
                    aria-label={`${face?.label ?? "Reaction"} reaction, ${count}`}
                    onClick={() => {
                      if (!mine)
                        setPops((p) => ({
                          ...p,
                          [reaction]: (p[reaction] ?? 0) + 1,
                        }));
                      onReact(message.id, reaction);
                    }}
                    className={`flex h-7 items-center gap-1.5 rounded-pill pl-1.5 pr-2.5 text-[12.5px] font-semibold transition-colors duration-(--motion-fast) ${
                      mine
                        ? "bg-text text-on-primary"
                        : "bg-surface-secondary text-text-body shadow-[inset_0_0_0_1px_rgba(242,242,242,0.08)] hover:bg-surface-tertiary"
                    }`}
                  >
                    <PuffFace
                      reaction={reaction}
                      size={18}
                      pop={pops[reaction] ?? 0}
                    />
                    <span className="text-xs">{count}</span>
                  </button>
                );
              },
            )}
            <span className="hidden items-center gap-0.5 rounded-pill bg-surface-secondary px-1 group-hover:flex">
              {PUFF_FACES.map(({ face }) => (
                <button
                  key={face}
                  type="button"
                  aria-label={`Add ${face} reaction`}
                  onClick={() => {
                    setPops((p) => ({
                      ...p,
                      [puffReaction(face)]: (p[puffReaction(face)] ?? 0) + 1,
                    }));
                    onReact(message.id, puffReaction(face));
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-active"
                >
                  <PuffFace reaction={puffReaction(face)} size={18} />
                </button>
              ))}
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label={pinned ? "Unpin message" : "Pin message"}
        aria-pressed={pinned}
        onClick={() => onPin(message.id)}
        className={`${iconButton} absolute right-3 top-0 hidden -translate-y-1/2 bg-surface-secondary shadow-popover group-hover:grid`}
      >
        <Pin size={14} aria-hidden="true" />
      </button>
    </article>
  );
}

const textOf = (m: Message) =>
  m.body
    .map((part) =>
      typeof part === "string"
        ? part
        : "mention" in part
          ? `@${part.mention}`
          : part.code,
    )
    .join("");

/** The search box's filters, as Discord-style tokens: `from:ada`, `has:file`, `has:image`, `is:pinned`; the rest is words. */
function matches(m: Message, query: string, pinned: Set<number>): boolean {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => {
      if (token.startsWith("from:")) return m.who.startsWith(token.slice(5));
      if (token === "has:file") return m.attachment?.kind === "file";
      if (token === "has:image") return m.attachment?.kind === "image";
      if (token === "is:pinned") return pinned.has(m.id);
      return textOf(m).toLowerCase().includes(token);
    });
}

const FILTERS = [
  { token: "from:ada", hint: "Messages from a person" },
  { token: "has:file", hint: "Messages with a file" },
  { token: "has:image", hint: "Messages with a picture" },
  { token: "is:pinned", hint: "Pinned messages" },
];

type DmItem =
  | { id: number; who: string; time: string; text: string }
  | { id: number; call: "ended" | "missed"; time: string; length?: string };

const DM_SEED: DmItem[] = [
  { id: 1, who: "grace", time: "11:42 AM", text: "Yes, after lunch." },
  { id: 2, call: "ended", time: "2:05 PM", length: "4:12" },
  {
    id: 3,
    who: "grace",
    time: "2:11 PM",
    text: "That sounded clear on my side.",
  },
  { id: 4, call: "missed", time: "5:48 PM" },
];

function CallLog({ item }: { item: Extract<DmItem, { call: string }> }) {
  const missed = item.call === "missed";
  const Icon = missed ? PhoneMissed : Phone;
  return (
    <div
      className={`my-2 flex items-center gap-2.5 px-4 text-[13px] ${missed ? "text-error-text" : "text-text-tertiary"}`}
    >
      <span
        className={`grid size-7 place-items-center rounded-full ${missed ? "bg-error/14" : "bg-surface-secondary"}`}
      >
        <Icon size={14} aria-hidden="true" />
      </span>
      <span className="font-semibold">{missed ? "Missed call" : "Call"}</span>
      {!missed && <span className="tabular-nums">· {item.length}</span>}
      <time className="pb-timestamp">{item.time}</time>
    </div>
  );
}

/** Home: Friends and Direct Messages, the app's start page. The send-request form stays hidden until "Add friend". */
function HomeView() {
  const [view, setView] = useState<"friends" | "dm">("friends");
  const [tab, setTab] = useState<"online" | "all" | "pending">("online");
  const [adding, setAdding] = useState(false);
  const [handle, setHandle] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [dm, setDm] = useState(DM_SEED);
  const [draft, setDraft] = useState("");
  const next = useRef(100);

  const shown = FRIENDS.filter((k) =>
    tab === "online" ? PEOPLE[k]!.status !== "offline" : tab === "all",
  );
  const sendDm = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDm((d) => [
      ...d,
      {
        id: next.current++,
        who: "you",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        text,
      },
    ]);
    setDraft("");
  };

  return (
    <>
      <aside className="flex w-[288px] shrink-0 flex-col overflow-hidden rounded-lg bg-surface max-md:hidden">
        <div className="px-2 pt-3">
          <button
            type="button"
            onClick={() => setView("friends")}
            aria-current={view === "friends" ? "page" : undefined}
            className={`flex h-[38px] w-full items-center gap-2.5 rounded-sm px-2.5 text-[14.5px] font-semibold hover:bg-surface-secondary ${view === "friends" ? "bg-surface-tertiary text-text" : "text-text-tertiary"}`}
          >
            <Users size={17} aria-hidden="true" />
            Friends
          </button>
          <div className="pb-section-label px-2.5 pb-1.5 pt-4">
            Direct Messages
          </div>
          {["grace", "margaret"].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setView("dm")}
              aria-current={view === "dm" && k === "grace" ? "page" : undefined}
              className={`flex h-[42px] w-full items-center gap-2.5 rounded-sm px-2.5 text-left hover:bg-surface-secondary ${view === "dm" && k === "grace" ? "bg-surface-tertiary" : ""}`}
            >
              <Avatar
                handle={handleOf(k)}
                size={30}
                presence={PEOPLE[k]!.status}
                ringColor="var(--color-surface)"
              />
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-text-body">
                {PEOPLE[k]!.name}
              </span>
              {PEOPLE[k]!.host !== HOME && <HostPill host={PEOPLE[k]!.host} />}
            </button>
          ))}
        </div>
      </aside>

      {view === "friends" ? (
        <section
          className="flex min-h-0 min-w-0 flex-1 flex-col rounded-[14px] bg-surface"
          aria-label="Friends"
        >
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border-secondary px-[18px]">
            <Users
              size={18}
              className="text-text-tertiary"
              aria-hidden="true"
            />
            <h1 className="m-0 font-heading text-[19px] font-semibold">
              Friends
            </h1>
            <div className="ml-3 flex gap-1">
              {(["online", "all", "pending"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  className={`h-8 rounded-md px-3 text-[13px] font-semibold capitalize ${tab === t ? "bg-surface-tertiary text-text" : "text-text-tertiary hover:bg-surface-secondary"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAdding((a) => !a)}
              aria-expanded={adding}
              className="pb-button-primary ml-auto !h-8 !px-3 !text-[13px]"
            >
              <UserPlus
                size={14}
                className="mr-1.5 inline"
                aria-hidden="true"
              />
              Add friend
            </button>
          </header>
          {adding && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (handle.trim()) {
                  setSent(handle.trim());
                  setHandle("");
                }
              }}
              className="flex items-center gap-2 border-b border-border-secondary px-[18px] py-3"
            >
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="name@instance"
                aria-label="Handle to send a request to"
                className="h-9 min-w-0 flex-1 rounded-md bg-surface-secondary px-3 text-sm outline-none placeholder:text-text-muted focus:shadow-[0_0_0_2px_var(--color-text)]"
              />
              <button
                type="submit"
                className="pb-button-secondary !h-9 !px-4 !text-[13px]"
              >
                Send request
              </button>
            </form>
          )}
          {sent && adding && (
            <p className="m-0 px-[18px] pt-2 text-[12.5px] text-success">
              Request sent to {sent}.
            </p>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {tab === "pending" ? (
              <p className="m-0 p-6 text-center text-sm text-text-muted">
                No pending requests.
              </p>
            ) : (
              <ul className="m-0 list-none p-0">
                {shown.map((k) => (
                  <li
                    key={k}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-surface-secondary"
                  >
                    <Avatar
                      handle={handleOf(k)}
                      size={38}
                      presence={PEOPLE[k]!.status}
                    />
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold">
                          {PEOPLE[k]!.name}
                        </span>
                        {PEOPLE[k]!.host !== HOME && (
                          <HostPill host={PEOPLE[k]!.host} />
                        )}
                      </div>
                      <div className="pb-meta text-[12px]">
                        {PEOPLE[k]!.note ?? presenceLabel(PEOPLE[k]!.status)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setView("dm")}
                      aria-label={`Message ${PEOPLE[k]!.name}`}
                      className={`${iconButton} bg-surface-secondary`}
                    >
                      <MessageSquare size={15} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : (
        <section
          className="flex min-h-0 min-w-0 flex-1 flex-col rounded-[14px] bg-surface"
          aria-label="Direct message with grace"
        >
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border-secondary px-[18px]">
            <Avatar handle={handleOf("grace")} size={28} presence="online" />
            <h1 className="m-0 font-heading text-[19px] font-semibold">
              grace
            </h1>
            <div className="ml-auto flex items-center gap-1 text-text-tertiary">
              <span className={iconButton}>
                <Phone size={17} aria-hidden="true" />
              </span>
              <span className={iconButton}>
                <Pin size={17} aria-hidden="true" />
              </span>
              <span className="flex h-8 w-[150px] items-center gap-2 rounded-pill bg-surface-secondary px-3 text-[12.5px] text-text-muted max-lg:hidden">
                <Search size={14} aria-hidden="true" />
                Search messages
              </span>
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto py-3">
            {dm.map((item) =>
              "call" in item ? (
                <CallLog key={item.id} item={item} />
              ) : (
                <article
                  key={item.id}
                  className="flex gap-[14px] px-4 py-[3px] hover:bg-text/[0.03]"
                >
                  <Avatar handle={handleOf(item.who)} size={40} />
                  <div>
                    <header className="flex items-baseline gap-2">
                      <span className="pb-username">
                        {PEOPLE[item.who]!.name}
                      </span>
                      <time className="pb-timestamp">{item.time}</time>
                    </header>
                    <p className="pb-message-body m-0">{item.text}</p>
                  </div>
                </article>
              ),
            )}
          </div>
          <form onSubmit={sendDm} className="mx-3.5 mb-3.5 shrink-0">
            <div className="flex items-center gap-3 rounded-lg bg-surface-secondary py-1.75 pl-4 pr-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Message grace"
                aria-label="Message grace"
                className="min-w-0 flex-1 bg-transparent py-2 text-[14.5px] text-text outline-none placeholder:text-text-tertiary"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!draft.trim()}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-on-primary disabled:bg-surface-tertiary disabled:text-text-faint"
              >
                <Send size={14} aria-hidden="true" />
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}

export default function AppPreview() {
  const [channel, setChannel] = useState("welcome");
  const [messages, setMessages] = useState(SEED);
  const [draft, setDraft] = useState("");
  const [inVoice, setInVoice] = useState(false);
  const [muted, setMuted] = useState(false);
  const [talker, setTalker] = useState(0);
  const [home, setHome] = useState(false);
  const [order, setOrder] = useState(RAIL.map((r) => r.host));
  const [dragging, setDragging] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [pinned, setPinned] = useState<Set<number>>(new Set([1]));
  const [showPins, setShowPins] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const nextId = useRef(100);
  const log = useRef<HTMLDivElement>(null);

  // Whoever is "speaking" in the voice roster moves around, the way the real roster pulses.
  useEffect(() => {
    const t = setInterval(() => setTalker((n) => (n + 1) % 4), 1400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [channel, messages]);

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const stamp = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    setMessages((m) => ({
      ...m,
      [channel]: [
        ...m[channel]!,
        {
          id: nextId.current++,
          who: "you",
          time: stamp,
          body: [text],
          reactions: {},
        },
      ],
    }));
    setDraft("");
  };

  const react = (id: number, reaction: string) =>
    setMessages((all) => ({
      ...all,
      [channel]: all[channel]!.map((m) => {
        if (m.id !== id) return m;
        const current = m.reactions[reaction];
        const reactions = { ...m.reactions };
        if (!current) reactions[reaction] = { count: 1, mine: true };
        else if (current.mine) {
          if (current.count <= 1) delete reactions[reaction];
          else reactions[reaction] = { count: current.count - 1, mine: false };
        } else reactions[reaction] = { count: current.count + 1, mine: true };
        return { ...m, reactions };
      }),
    }));

  const togglePin = (id: number) =>
    setPinned((set) => {
      const next = new Set(set);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  const toggleGroup = (name: string) =>
    setCollapsed((c) => ({ ...c, [name]: !c[name] }));
  const move = (host: string, over: string) =>
    setOrder((list) => {
      if (host === over) return list;
      const next = list.filter((h) => h !== host);
      next.splice(next.indexOf(over), 0, host);
      return next;
    });

  const all = messages[channel] ?? [];
  const rows = query.trim()
    ? all.filter((m) => matches(m, query, pinned))
    : all;
  const pinnedRows = all.filter((m) => pinned.has(m.id));
  const roster = [
    { key: "ada", muted: false },
    { key: "grace", muted: true },
    { key: "linus", muted: false },
    ...(inVoice ? [{ key: "you", muted }] : []),
  ];
  const onlineKeys = ["ada", "grace", "linus", "margaret", "you"];
  const roleGroups = [
    ...ROLE_ORDER.map((role) => ({
      label: role as string,
      keys: onlineKeys.filter(
        (k) => (PEOPLE[k]!.role?.name ?? "Member") === role,
      ),
    })),
    { label: "Offline", keys: ["alan"] },
  ].filter((g) => g.keys.length > 0);

  return (
    <div
      className="relative mx-auto flex h-[640px] w-full max-w-[1180px] gap-2 overflow-hidden rounded-2xl border border-border-secondary bg-background p-2 shadow-modal"
      role="group"
      aria-label="Interactive preview of the Pufferblow app"
    >
      {/* Space rail: the tiles reorder by dragging */}
      <nav
        aria-label="Spaces"
        className="flex w-[72px] shrink-0 flex-col items-center gap-2.5 overflow-hidden pb-[76px] pt-1.5 max-sm:hidden"
      >
        <Tile
          label="Home"
          selected={home}
          onClick={() => setHome(true)}
          className="bg-surface-secondary !text-[#f2f2f2] hover:bg-primary hover:!text-black"
        >
          <PufferblowMark size={30} tone="current" />
        </Tile>
        <div className="h-0.5 w-7 rounded bg-border-secondary" />
        {order.map((host) => {
          const space = RAIL.find((r) => r.host === host)!;
          return (
            <Tile
              key={host}
              label={`${space.name} on ${host}`}
              selected={!home && host === HOME}
              onClick={() => host === HOME && setHome(false)}
              className="bg-surface-secondary"
              drag={{
                draggable: true,
                onDragStart: () => setDragging(host),
                onDragOver: (e) => {
                  e.preventDefault();
                  if (dragging) move(dragging, host);
                },
                onDragEnd: () => setDragging(null),
                style: { opacity: dragging === host ? 0.4 : 1 },
              }}
            >
              <SpaceIcon
                id={host}
                name={space.name}
                size={48}
                radius="inherit"
                className="absolute inset-0"
              />
              <CountBadge
                count={space.badge}
                className="absolute -bottom-1.5 -right-1.5 border-[3px] border-background"
              />
            </Tile>
          );
        })}
        <Tile
          label="Add an instance"
          className="!rounded-full bg-surface-secondary text-text-tertiary hover:!rounded-[14px] hover:bg-surface-tertiary hover:text-text"
        >
          <Plus size={20} aria-hidden="true" />
        </Tile>
      </nav>

      {home ? (
        <HomeView />
      ) : (
        <>
          {/* Sidebar */}
          <aside className="flex w-[288px] shrink-0 flex-col overflow-hidden rounded-lg bg-surface max-md:hidden">
            <div
              className="relative h-[118px] shrink-0"
              style={{
                background: `linear-gradient(transparent 30%, rgba(10,10,10,.85)), ${defaultBannerCss(HOME)}`,
              }}
            >
              <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-lg bg-black/30 text-[#dadada]">
                <ChevronDown size={15} aria-hidden="true" />
              </span>
              <div className="absolute inset-x-3.5 bottom-3 min-w-0">
                <h2 className="pb-panel-header m-0 truncate text-xl">
                  Switchyard
                </h2>
                <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#dadada]">
                  <Globe size={11} aria-hidden="true" />
                  {HOME}
                </div>
              </div>
            </div>

            <nav
              aria-label="Channels"
              className="min-h-0 flex-1 overflow-y-auto px-2 pt-1"
            >
              {CHANNELS.map((group) => {
                const shut = collapsed[group.group];
                return (
                  <section key={group.group} aria-label={group.group}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.group)}
                      aria-expanded={!shut}
                      className="pb-section-label flex w-full items-center gap-1.5 px-2.5 pb-1.5 pt-3.5 text-left hover:text-text"
                    >
                      {shut ? (
                        <ChevronRight size={11} aria-hidden="true" />
                      ) : (
                        <ChevronDown size={11} aria-hidden="true" />
                      )}
                      {group.group}
                    </button>
                    <div className="flex flex-col gap-px">
                      {group.items
                        .filter(
                          (item) =>
                            !shut ||
                            channel === item.id ||
                            ("pings" in item && item.pings),
                        )
                        .map((item) => {
                          const Icon =
                            "private" in item && item.private ? Lock : Hash;
                          const active = channel === item.id;
                          const pings =
                            !active && "pings" in item ? item.pings : 0;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setChannel(item.id);
                                setQuery("");
                                setShowPins(false);
                              }}
                              aria-current={active ? "page" : undefined}
                              className={`flex h-[34px] items-center gap-2 rounded-sm pl-2.5 pr-3 text-left text-[14.5px] transition-colors duration-(--motion-fast) hover:bg-surface-secondary ${
                                active
                                  ? "bg-surface-tertiary font-semibold text-text"
                                  : pings
                                    ? "font-semibold text-text"
                                    : "font-medium text-text-tertiary hover:text-text-body"
                              }`}
                            >
                              <Icon size={16} aria-hidden="true" />
                              <span className="flex-1 truncate">{item.id}</span>
                              <CountBadge count={pings ?? 0} />
                            </button>
                          );
                        })}
                    </div>
                  </section>
                );
              })}

              <section>
                <button
                  type="button"
                  onClick={() => toggleGroup("Voice Channels")}
                  aria-expanded={!collapsed["Voice Channels"]}
                  className="pb-section-label flex w-full items-center gap-1.5 px-2.5 pb-1.5 pt-3.5 text-left hover:text-text"
                >
                  {collapsed["Voice Channels"] ? (
                    <ChevronRight size={11} aria-hidden="true" />
                  ) : (
                    <ChevronDown size={11} aria-hidden="true" />
                  )}
                  Voice Channels
                </button>
                {(!collapsed["Voice Channels"] || inVoice) && (
                  <>
                    <button
                      type="button"
                      aria-pressed={inVoice}
                      onClick={() => setInVoice((v) => !v)}
                      className={`flex h-[34px] w-full items-center gap-2 rounded-sm pl-2.5 pr-3 text-left text-[14.5px] transition-colors duration-(--motion-fast) hover:bg-surface-secondary ${inVoice ? "font-semibold text-success" : "text-text-tertiary"}`}
                    >
                      <Volume2 size={16} aria-hidden="true" />
                      <span className="flex-1 truncate">Lounge</span>
                      <span className="flex items-center gap-1 rounded-full bg-surface-secondary px-1.5 py-px text-[11.5px] font-medium tabular-nums text-text-muted">
                        <Users size={11} />
                        {roster.length}
                      </span>
                    </button>
                    <ul
                      aria-label="In this call"
                      className="m-0 mb-1 ml-[22px] mt-0.5 list-none space-y-px p-0"
                    >
                      {roster.map((p, i) => (
                        <li
                          key={p.key}
                          className="flex h-7 items-center gap-2 rounded-md pl-2 pr-1.5 text-[13px] text-text-body"
                        >
                          <Avatar
                            handle={handleOf(p.key)}
                            size={22}
                            speaking={!p.muted && talker === i}
                            muted={p.muted}
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {PEOPLE[p.key]!.name}
                          </span>
                          {p.muted && (
                            <MicOff
                              size={12}
                              aria-label="Muted"
                              className="shrink-0 text-text-muted"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            </nav>

            {inVoice && (
              <div
                role="status"
                className="mx-2 mt-2 flex items-center gap-2 rounded-xl bg-surface-secondary px-2.5 py-2"
              >
                <Volume2
                  size={16}
                  className="shrink-0 text-success"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="text-[12.5px] font-semibold text-success">
                    Voice connected
                  </div>
                  <div className="truncate text-[11.5px] text-text-tertiary">
                    Lounge
                  </div>
                </div>
              </div>
            )}
            <div aria-hidden="true" className="h-[76px] shrink-0" />
          </aside>

          {/* Chat */}
          <section
            className="flex min-h-0 min-w-0 flex-1 flex-col rounded-[14px] bg-surface"
            aria-label={`#${channel}`}
          >
            <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border-secondary px-[18px]">
              {channel === "staff" ? (
                <Lock
                  size={18}
                  className="text-text-tertiary"
                  aria-hidden="true"
                />
              ) : (
                <Hash
                  size={18}
                  className="text-text-tertiary"
                  aria-hidden="true"
                />
              )}
              <h1 className="m-0 font-heading text-[19px] font-semibold">
                {channel}
              </h1>
              <p className="m-0 min-w-0 flex-1 truncate text-[13px] text-text-tertiary max-sm:hidden">
                {channel === "welcome"
                  ? "Start here. Say hello."
                  : channel === "announcements"
                    ? "Release notes and plans."
                    : ""}
              </p>
              <div className="ml-auto flex items-center gap-1 text-text-tertiary">
                <span className={iconButton}>
                  <Bell size={17} aria-hidden="true" />
                </span>
                <button
                  type="button"
                  aria-label="Pinned messages"
                  aria-pressed={showPins}
                  onClick={() => setShowPins((v) => !v)}
                  className={`${iconButton} max-sm:hidden ${showPins ? "bg-surface-secondary text-text" : ""}`}
                >
                  <Pin size={17} aria-hidden="true" />
                </button>
                <div className="relative max-lg:hidden">
                  <label className="flex h-8 w-[170px] items-center gap-2 rounded-pill bg-surface-secondary px-3 text-[12.5px] text-text-muted focus-within:shadow-[0_0_0_2px_var(--color-text)]">
                    <Search size={14} aria-hidden="true" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setSearching(true)}
                      onBlur={() => setTimeout(() => setSearching(false), 120)}
                      placeholder={`Search #${channel}`}
                      aria-label={`Search #${channel}`}
                      className="min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-text-muted"
                    />
                    {query && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setQuery("")}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </label>
                  {searching && !query && (
                    <div className="absolute right-0 top-10 z-20 w-[260px] rounded-lg bg-surface-secondary p-1.5 shadow-popover">
                      <div className="pb-section-label px-2 pb-1 pt-1.5">
                        Search options
                      </div>
                      {FILTERS.map((f) => (
                        <button
                          key={f.token}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setQuery(`${f.token} `)}
                          className="flex w-full items-baseline gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-surface-tertiary"
                        >
                          <code className="pb-inline-code">{f.token}</code>
                          <span className="text-[12px] text-text-tertiary">
                            {f.hint}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span
                  className={`${iconButton} bg-surface-secondary text-primary max-xl:hidden`}
                >
                  <Users size={17} aria-hidden="true" />
                </span>
              </div>
            </header>

            {query.trim() && (
              <div className="flex items-center gap-2 border-b border-border-secondary px-[18px] py-2 text-[12.5px] text-text-tertiary">
                <Search size={13} aria-hidden="true" />
                {rows.length} {rows.length === 1 ? "result" : "results"} for{" "}
                <code className="pb-inline-code">{query.trim()}</code>
              </div>
            )}
            {showPins && (
              <div className="border-b border-border-secondary bg-surface-secondary px-[18px] py-2.5">
                <div className="pb-section-label mb-1.5 flex items-center gap-1.5">
                  <Pin size={11} aria-hidden="true" />
                  Pinned in #{channel}
                </div>
                {pinnedRows.length === 0 ? (
                  <p className="m-0 text-[13px] text-text-muted">
                    Nothing pinned yet. Hover a message and press the pin.
                  </p>
                ) : (
                  pinnedRows.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 py-1 text-[13px]"
                    >
                      <Avatar handle={handleOf(m.who)} size={20} />
                      <span className="font-semibold">
                        {PEOPLE[m.who]!.name}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-text-body">
                        {textOf(m)}
                      </span>
                      <button
                        type="button"
                        aria-label="Unpin"
                        onClick={() => togglePin(m.id)}
                        className="text-text-muted hover:text-text"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            <div
              ref={log}
              className="min-h-0 flex-1 overflow-y-auto py-3"
              data-message-list
            >
              {rows.map((m, i) => (
                <Message
                  key={m.id}
                  message={m}
                  grouped={i > 0 && rows[i - 1]!.who === m.who && !m.reply}
                  pinned={pinned.has(m.id)}
                  onReact={react}
                  onPin={togglePin}
                />
              ))}
              {rows.length === 0 && (
                <p className="m-0 p-8 text-center text-sm text-text-muted">
                  No messages match.
                </p>
              )}
            </div>

            <form onSubmit={send} className="relative mx-3.5 mb-3.5 shrink-0">
              <div className="flex items-end gap-3 rounded-lg bg-surface-secondary py-1.75 pl-3 pr-2 text-text-tertiary focus-within:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-text)]">
                <span className="mb-0.75 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-tertiary">
                  <Paperclip size={15} aria-hidden="true" />
                </span>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message #${channel}`}
                  aria-label={`Message #${channel}`}
                  className="min-w-0 flex-1 bg-transparent py-2 text-[14.5px] leading-5 text-text outline-none placeholder:text-text-tertiary"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!draft.trim()}
                  className="mb-0.75 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-on-primary disabled:bg-surface-tertiary disabled:text-text-faint"
                >
                  <Send size={14} aria-hidden="true" />
                </button>
              </div>
            </form>
          </section>

          {/* Members */}
          <aside
            aria-label="Members"
            className="w-60 shrink-0 overflow-y-auto rounded-lg bg-surface px-2.5 py-3 max-xl:hidden"
          >
            {roleGroups.map((group) => (
              <section key={group.label}>
                <h3 className="pb-section-label m-0 flex items-center gap-1.5 px-1.5 pb-1.5 pt-3">
                  {group.label !== "Offline" && (
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        background: PEOPLE[group.keys[0]!]!.role?.colour,
                      }}
                    />
                  )}
                  {group.label} — {group.keys.length}
                </h3>
                <ul className="m-0 list-none p-0">
                  {group.keys.map((key) => {
                    const person = PEOPLE[key]!;
                    return (
                      <li
                        key={key}
                        className="flex items-center gap-2.5 rounded-sm p-1.5 hover:bg-surface-secondary"
                      >
                        <Avatar
                          handle={handleOf(key)}
                          size={32}
                          presence={person.status}
                          activity={inVoice && key === "you"}
                        />
                        <div className="min-w-0 leading-tight">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`truncate text-sm font-semibold ${person.status === "offline" ? "text-text-muted" : "text-text-body"}`}
                            >
                              {person.name}
                            </span>
                            {person.role && (
                              <BadgeOf role={person.role.name} size={20} />
                            )}
                            {person.host !== HOME && (
                              <HostPill host={person.host} />
                            )}
                          </div>
                          <div className="pb-meta truncate text-[11.5px]">
                            {person.note ?? presenceLabel(person.status)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </aside>
        </>
      )}

      {/* The user panel floats across the rail and the sidebar, as in the app. */}
      <div className="pointer-events-none absolute bottom-2 left-2 w-[352px] max-w-[calc(100%-1rem)] max-md:w-[calc(100%-1rem)]">
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-lg bg-surface-secondary px-3 py-2.5 shadow-modal">
          <Avatar
            handle={ME.handle}
            size={34}
            presence="online"
            activity={inVoice}
            muted={inVoice && muted}
            ringColor="var(--color-surface-secondary)"
          />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-bold">{ME.name}</div>
            <div className="pb-meta truncate text-[11px]">{HOME}</div>
          </div>
          <button
            type="button"
            className={`${iconButton} ${muted ? "text-error-text" : ""}`}
            aria-label={muted ? "Unmute microphone" : "Mute microphone"}
            aria-pressed={muted}
            disabled={!inVoice}
            onClick={() => setMuted((m) => !m)}
          >
            {muted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <span className={iconButton}>
            <Headphones size={16} aria-hidden="true" />
          </span>
          <span className={iconButton} title="Switch account">
            <ArrowLeftRight size={16} aria-hidden="true" />
          </span>
          <span className={iconButton}>
            <Settings size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}
