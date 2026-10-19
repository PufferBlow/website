// Interactive replica of the app's chat view (client-new): server rail, channel sidebar with
// its banner header, chat panel with grouped messages and composer, member list. Same layout,
// sizes and tokens as the real components. Everything is local state: switch channels, send a
// message. Nothing leaves the page.

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ChevronDown,
  Globe,
  Hash,
  Headphones,
  LogOut,
  Lock,
  Mic,
  Paperclip,
  Send,
  Settings,
  Volume2,
} from "lucide-react";

import GoldPuffer from "./GoldPuffer";

const PRESENCE = {
  online: { label: "Online", color: "#9fd487" },
  idle: { label: "Idle", color: "#ffffff" },
  offline: { label: "Offline", color: "#555555" },
} as const;

type Presence = keyof typeof PRESENCE;

const GRADIENTS: Record<string, string> = {
  gold: "linear-gradient(135deg, #f2f2f2, #3a3a3a)",
  violet: "linear-gradient(135deg, #cfcfcf, #3d3d3d)",
  green: "linear-gradient(135deg, #bdbdbd, #333333)",
  teal: "linear-gradient(135deg, #c4c4c4, #404040)",
  coral: "linear-gradient(135deg, #e0e0e0, #383838)",
};

type Msg = { author: string; gradient: string; time: string; text: string };

type Channel = { name: string; private?: boolean; unread?: number };

const CHANNELS: Channel[] = [
  { name: "welcome" },
  { name: "announcements", unread: 2 },
  { name: "general" },
  { name: "design" },
  { name: "staff", private: true },
];
const VOICE = ["Lounge", "Stand-up"];

const ADA = { author: "Ada", gradient: "gold" };
const LINUS = { author: "Linus", gradient: "teal" };
const GRACE = { author: "Grace", gradient: "violet" };

const SEED: Record<string, Msg[]> = {
  welcome: [
    { ...ADA, time: "2:31 PM", text: "Welcome in. Channels on the left, people on the right." },
    { ...ADA, time: "2:31 PM", text: "Try the message box below." },
    { ...LINUS, time: "2:33 PM", text: "Moved the roadmap thread to #announcements." },
    { ...GRACE, time: "2:36 PM", text: "Nice. Voice is next on my list." },
  ],
  announcements: [
    { ...ADA, time: "1:02 PM", text: "Roadmap for the next release is pinned." },
    { ...ADA, time: "1:03 PM", text: "Feedback welcome." },
  ],
  general: [
    { ...GRACE, time: "11:40 AM", text: "Anyone up for a call later?" },
    { ...LINUS, time: "11:42 AM", text: "Yes, after lunch." },
  ],
  design: [{ ...GRACE, time: "9:15 AM", text: "Pinned the checklist." }],
  staff: [{ ...ADA, time: "8:00 AM", text: "Only staff can see this channel." }],
};

const MEMBERS: { label: string; people: { name: string; gradient: string; status: Presence }[] }[] = [
  {
    label: "Online",
    people: [
      { name: "Ada", gradient: "gold", status: "online" },
      { name: "Grace", gradient: "violet", status: "online" },
      { name: "Linus", gradient: "teal", status: "idle" },
    ],
  },
  {
    label: "Offline",
    people: [
      { name: "Alan", gradient: "green", status: "offline" },
      { name: "Margaret", gradient: "coral", status: "offline" },
    ],
  },
];

const MAX_PER_CHANNEL = 30;

const groupLabel =
  "font-heading text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]";

const now = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function Avatar({
  name,
  gradient,
  size,
  status,
  ring = "var(--color-surface)",
}: {
  name: string;
  gradient: string;
  size: number;
  status?: Presence;
  ring?: string;
}) {
  const dot = Math.max(10, Math.round(size * 0.33));
  return (
    <div
      className="relative grid shrink-0 place-items-center rounded-full font-heading font-bold text-[var(--color-on-primary)]"
      style={{ width: size, height: size, background: GRADIENTS[gradient], fontSize: Math.round(size * 0.34) }}
      aria-hidden="true"
    >
      {name.slice(0, 2).toUpperCase()}
      {status && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full"
          style={{ width: dot, height: dot, background: PRESENCE[status].color, border: `3px solid ${ring}` }}
        />
      )}
    </div>
  );
}

function Rail({ unread }: { unread: number }) {
  return (
    <div className="flex w-[72px] shrink-0 flex-col items-center gap-2.5 py-1.5">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-surface)]">
        <GoldPuffer size={38} />
      </div>
      <div className="h-0.5 w-7 rounded bg-[var(--color-border-secondary)]" />
      <div className="relative flex w-full justify-center">
        <span className="absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r bg-[var(--color-text)]" />
        <div className="relative grid h-12 w-12 place-items-center rounded-[12px] bg-[var(--color-surface-secondary)] font-heading text-[15px] font-bold text-[var(--color-on-primary)]">
          DC
          {unread > 0 && (
            <span className="absolute -bottom-1.5 -right-1.5 grid h-[18px] min-w-5 place-items-center rounded-full border-[3px] border-[var(--color-background)] bg-[var(--color-error)] px-1.5 text-[10.5px] font-bold leading-none text-white">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  channel,
  unread,
  onSelect,
}: {
  channel: string;
  unread: Record<string, number>;
  onSelect: (name: string) => void;
}) {
  return (
    <aside className="hidden w-[244px] shrink-0 flex-col overflow-hidden rounded-[14px] bg-[var(--color-surface)] md:flex">
      <div
        className="relative h-[118px] shrink-0"
        style={{ background: "radial-gradient(120% 100% at 20% 10%, #3a3a3a 0%, #1a1a1a 75%)" }}
      >
        <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-lg bg-black/30 text-[#dadada]">
          <ChevronDown size={15} />
        </span>
        <div className="absolute inset-x-3.5 bottom-3">
          <h2 className="m-0 truncate font-display text-xl font-normal leading-tight tracking-normal text-[var(--color-text)]">
            Dev Community
          </h2>
          <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#dadada]">
            <Globe size={11} />
            chat.example.org
          </div>
        </div>
      </div>

      <nav aria-label="Channels" className="min-h-0 flex-1 px-2 pt-1">
        <div className={`flex items-center gap-1 px-1.5 pb-1.5 pt-3.5 ${groupLabel}`}>
          <ChevronDown size={11} />
          Channels
        </div>
        <div className="flex flex-col gap-px">
          {CHANNELS.map((c) => {
            const Icon = c.private ? Lock : Hash;
            const selected = c.name === channel;
            const count = unread[c.name] ?? 0;
            return (
              <button
                key={c.name}
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => onSelect(c.name)}
                className={`flex h-8 items-center gap-2 rounded-lg pl-2.5 pr-2 text-left text-[14.5px] transition-colors hover:bg-[var(--color-surface-secondary)] ${
                  selected
                    ? "bg-[var(--color-surface-tertiary)] font-semibold text-[var(--color-text)]"
                    : count > 0
                      ? "font-semibold text-[var(--color-text)]"
                      : "text-[var(--color-text-tertiary)]"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="flex-1 truncate">{c.name}</span>
                {count > 0 && (
                  <span className="grid h-[18px] min-w-5 place-items-center rounded-full bg-[var(--color-error)] px-1.5 text-[10.5px] font-bold leading-none text-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className={`flex items-center gap-1 px-1.5 pb-1.5 pt-3.5 ${groupLabel}`}>
          <ChevronDown size={11} />
          Voice
        </div>
        <div className="flex flex-col gap-px">
          {VOICE.map((v) => (
            <div
              key={v}
              title="Voice isn't in the demo"
              className="flex h-8 items-center gap-2 rounded-lg pl-2.5 pr-2 text-[14.5px] text-[var(--color-text-muted)]"
            >
              <Volume2 size={16} />
              {v}
            </div>
          ))}
        </div>
      </nav>

      <div className="m-2 flex items-center gap-2.5 rounded-xl bg-[var(--color-surface-secondary)] px-2.5 py-2">
        <Avatar name="Ada" gradient="gold" size={34} status="online" ring="var(--color-surface-secondary)" />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[13px] font-semibold text-[var(--color-text)]">Ada</div>
          <div className="truncate text-[11px] text-[var(--color-text-tertiary)]">@chat.example.org</div>
        </div>
        {[Mic, Headphones, Settings, LogOut].map((Icon, i) => (
          <span key={i} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--color-text-tertiary)]">
            <Icon size={16} />
          </span>
        ))}
      </div>
    </aside>
  );
}

function Chat({
  channel,
  isPrivate,
  messages,
  onSend,
  onSelect,
}: {
  channel: string;
  isPrivate: boolean;
  messages: Msg[];
  onSend: (text: string) => void;
  onSelect: (name: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const Icon = isPrivate ? Lock : Hash;

  // Scroll the message list only; never the page.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, channel]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <section
      className="flex min-h-0 min-w-0 flex-1 flex-col rounded-[14px] bg-[var(--color-surface)]"
      aria-label={`#${channel}`}
    >
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--color-border-secondary)] px-[18px]">
        <Icon size={18} className="text-[var(--color-text-tertiary)]" aria-hidden="true" />
        <h1 className="m-0 font-heading text-[19px] font-semibold text-[var(--color-text)]">{channel}</h1>
        {/* Small screens hide the sidebar, so offer a way to switch channels there too. */}
        <select
          aria-label="Channel"
          value={channel}
          onChange={(e) => onSelect(e.target.value)}
          className="ml-auto rounded-lg border border-[var(--color-border-secondary)] bg-[var(--color-surface-secondary)] px-2 py-1 text-sm text-[var(--color-text-secondary)] md:hidden"
        >
          {CHANNELS.map((c) => (
            <option key={c.name} value={c.name}>
              #{c.name}
            </option>
          ))}
        </select>
      </header>

      <div ref={scroller} className="flex min-h-0 flex-1 flex-col overflow-y-auto py-2.5">
        <div className="mt-auto">
          {messages.map((m, i) => {
            const start = i === 0 || messages[i - 1]!.author !== m.author;
            return (
              <article
                key={i}
                className={`flex gap-3 px-[18px] hover:bg-[var(--color-text)]/[0.03] ${
                  start ? "mt-[14px] py-[3px] first:mt-0" : "py-px"
                }`}
              >
                <div className="w-10 shrink-0">
                  {start ? (
                    <Avatar name={m.author} gradient={m.gradient} size={40} />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  {start && (
                    <header className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[15px] font-bold text-[var(--color-text)]">{m.author}</span>
                      <span className="text-[11.5px] text-[var(--color-text-muted)]">{m.time}</span>
                    </header>
                  )}
                  <p className="m-0 break-words text-[15px] text-[var(--color-text-secondary)]">{m.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <form onSubmit={submit} className="mx-3.5 mb-3.5 shrink-0">
        <div className="flex h-[50px] items-center gap-3 rounded-[14px] bg-[var(--color-surface-secondary)] pl-3 pr-2 text-[var(--color-text-tertiary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/30">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--color-surface-tertiary)]">
            <Paperclip size={15} />
          </span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={200}
            autoComplete="off"
            placeholder={`Message #${channel}`}
            aria-label={`Message #${channel}`}
            className="min-w-0 flex-1 bg-transparent text-[14.5px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim()}
            className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--color-primary)] text-[var(--color-on-primary)] transition-opacity disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </section>
  );
}

function Members() {
  return (
    <aside className="hidden w-60 shrink-0 overflow-hidden rounded-[14px] bg-[var(--color-surface)] px-2.5 py-3 xl:block">
      {MEMBERS.map((g) => (
        <section key={g.label}>
          <h3 className={`m-0 px-1.5 pb-1.5 pt-2.5 ${groupLabel}`}>
            {g.label} — {g.people.length}
          </h3>
          <ul className="m-0 list-none p-0">
            {g.people.map((p) => (
              <li
                key={p.name}
                className={`flex items-center gap-2.5 rounded-[10px] p-1.5 hover:bg-[var(--color-surface-secondary)] ${
                  p.status === "offline" ? "opacity-60" : ""
                }`}
              >
                <Avatar name={p.name} gradient={p.gradient} size={34} status={p.status} />
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-sm font-semibold text-[var(--color-text)]">{p.name}</div>
                  <div className="truncate text-[11.5px] text-[var(--color-text-tertiary)]">
                    {PRESENCE[p.status].label}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}

export default function HomeDashboardPreview() {
  const [channel, setChannel] = useState("welcome");
  const [log, setLog] = useState<Record<string, Msg[]>>(SEED);
  const [unread, setUnread] = useState<Record<string, number>>(
    Object.fromEntries(CHANNELS.filter((c) => c.unread).map((c) => [c.name, c.unread!])),
  );

  const select = (name: string) => {
    setChannel(name);
    setUnread((u) => ({ ...u, [name]: 0 }));
  };

  const send = (text: string) =>
    setLog((l) => ({
      ...l,
      [channel]: [...(l[channel] ?? []), { ...ADA, time: now(), text }].slice(-MAX_PER_CHANNEL),
    }));

  const total = Object.values(unread).reduce((a, b) => a + b, 0);
  const isPrivate = CHANNELS.find((c) => c.name === channel)?.private === true;

  return (
    <div
      role="group"
      aria-label="Interactive demo of the Pufferblow app. Nothing you type is sent anywhere."
      className="overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-background)] shadow-[0_18px_42px_var(--color-shadow-lg)]"
    >
      <div className="flex h-[560px] gap-2 bg-[var(--color-background)] p-2 pl-0">
        <Rail unread={total} />
        <div className="flex min-h-0 min-w-0 flex-1 gap-2">
          <Sidebar channel={channel} unread={unread} onSelect={select} />
          <Chat
            channel={channel}
            isPrivate={isPrivate}
            messages={log[channel] ?? []}
            onSend={send}
            onSelect={select}
          />
          <Members />
        </div>
      </div>
    </div>
  );
}
