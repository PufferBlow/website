// A working copy of the app's chat view, built from the same markup, sizes and classes as the real
// client (client): the space rail, the sidebar with its banner and grouped channels, the voice
// roster with speaking rings, the chat with role tags, mentions and puff reactions, the member list.
// Everything is local state: switch channels, send a message, puff a reaction, join the voice
// channel. Nothing leaves the page.

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronDown, Globe, Hash, Headphones, Lock, MicOff, Mic, Paperclip, Pin, Plus, Search, Send, Settings, Users, Volume2, Bell } from "lucide-react";

import { defaultBannerCss } from "../lib/identity";
import { parsePuff, puffReaction, PUFF_FACES } from "../lib/puff";
import { Avatar, CountBadge, presenceLabel, type Presence } from "./app/Avatar";
import { HostPill } from "./app/HostPill";
import { PuffFace } from "./app/PuffFace";
import { RoleTag } from "./app/RoleTag";
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

const BRASS = "#e3ae4f";
const VIOLET = "#a99cf2";

const PEOPLE: Record<string, Person> = {
  ada: { name: "Ada", host: HOME, status: "online", role: { name: "Owner", colour: BRASS } },
  grace: { name: "Grace", host: HOME, status: "online", role: { name: "Moderator", colour: VIOLET } },
  linus: { name: "Linus", host: HOME, status: "idle" },
  margaret: { name: "Margaret", host: "mesh.garden", status: "online", note: "Compiling something" },
  alan: { name: "Alan", host: HOME, status: "offline" },
  you: { name: "you", host: HOME, status: "online" },
};

const handleOf = (key: string) => `${PEOPLE[key]!.name.toLowerCase()}@${PEOPLE[key]!.host}`;

interface Message {
  id: number;
  who: string;
  time: string;
  body: Segment[];
  reactions: Record<string, { count: number; mine: boolean }>;
}

type Segment = string | { mention: string; you?: boolean } | { code: string };

const puff = (face: string) => puffReaction(face as never);

const SEED: Record<string, Message[]> = {
  welcome: [
    { id: 1, who: "ada", time: "2:31 PM", body: ["Welcome in. Channels on the left, people on the right."], reactions: { [puff("happy")]: { count: 3, mine: false } } },
    { id: 2, who: "ada", time: "2:31 PM", body: ["This whole instance runs on one small server. Try the message box below."], reactions: {} },
    { id: 3, who: "grace", time: "2:33 PM", body: [{ mention: "you", you: true }, " moved the roadmap thread to ", { code: "#announcements" }, "."], reactions: { [puff("wink")]: { count: 1, mine: false } } },
    { id: 4, who: "margaret", time: "2:36 PM", body: ["Hello from mesh.garden. I can see this channel from my instance."], reactions: { [puff("surprised")]: { count: 2, mine: false } } },
  ],
  announcements: [
    { id: 5, who: "ada", time: "1:02 PM", body: ["The next release is pinned. Voice calls are end-to-end encrypted now."], reactions: { [puff("default")]: { count: 4, mine: false } } },
  ],
  general: [
    { id: 6, who: "linus", time: "11:40 AM", body: ["Anyone up for a call later?"], reactions: {} },
    { id: 7, who: "grace", time: "11:42 AM", body: ["Yes, after lunch."], reactions: {} },
  ],
  design: [{ id: 8, who: "grace", time: "9:15 AM", body: ["Pinned the checklist. Fish only, no emoji."], reactions: { [puff("sleepy")]: { count: 1, mine: false } } }],
  staff: [{ id: 9, who: "ada", time: "8:00 AM", body: ["Only staff can see this channel."], reactions: {} }],
};

const CHANNELS = [
  { group: "Information", items: [{ id: "welcome" }, { id: "announcements", pings: 2 }] },
  { group: "Community", items: [{ id: "general" }, { id: "design" }, { id: "staff", private: true }] },
];

const iconButton =
  "grid h-8 w-8 place-items-center rounded-md text-text-tertiary transition-colors duration-(--motion-fast) hover:bg-active hover:text-text";

function Tile({ selected, children, label, className = "" }: { selected?: boolean; children: React.ReactNode; label: string; className?: string }) {
  return (
    <div className="group/tile relative flex w-full justify-center">
      <span aria-hidden="true" className={`absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-r bg-text transition-[height] duration-(--motion-base) ease-(--motion-ease-out) ${selected ? "h-9" : "h-0 group-hover/tile:h-5"}`} />
      <button
        type="button"
        aria-label={label}
        title={label}
        className={`relative grid h-12 w-12 place-items-center font-display text-lg text-on-primary transition-[border-radius,filter] hover:rounded-[12px] hover:brightness-110 ${selected ? "rounded-[12px]" : "rounded-[14px]"} ${className}`}
      >
        {children}
      </button>
    </div>
  );
}

function Message({ message, grouped, onReact }: { message: Message; grouped: boolean; onReact: (id: number, reaction: string) => void }) {
  const person = PEOPLE[message.who]!;
  const [pops, setPops] = useState<Record<string, number>>({});
  const remote = person.host !== HOME;
  return (
    <article className={`group relative flex flex-wrap gap-x-[14px] gap-y-0.5 px-4 hover:bg-text/[0.03] ${grouped ? "py-px" : "mt-[14px] py-[3px] first:mt-0"}`}>
      <div className="w-10 shrink-0">
        {grouped ? (
          <span className="block pt-[3px] text-center text-[10.5px] text-text-muted opacity-0 group-hover:opacity-100">{message.time.replace(/ [AP]M/, "")}</span>
        ) : (
          <Avatar handle={handleOf(message.who)} size={40} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {!grouped && (
          <header className="flex flex-wrap items-baseline gap-2">
            <span className="pb-username">{person.name}</span>
            {person.role && <RoleTag name={person.role.name} colour={person.role.colour} />}
            {remote && <HostPill host={person.host} />}
            <time className="pb-timestamp">{message.time}</time>
          </header>
        )}
        <p className="pb-message-body m-0 break-words">
          {message.body.map((part, i) =>
            typeof part === "string" ? (
              part
            ) : "mention" in part ? (
              <span key={i} className={part.you ? "pb-mention-you" : "pb-mention-other"}>
                @{part.mention}
              </span>
            ) : (
              <code key={i} className="pb-inline-code">
                {part.code}
              </code>
            ),
          )}
        </p>
        {Object.keys(message.reactions).length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {Object.entries(message.reactions).map(([reaction, { count, mine }]) => {
              const face = parsePuff(reaction);
              return (
                <button
                  key={reaction}
                  type="button"
                  aria-pressed={mine}
                  aria-label={`${face?.label ?? "Reaction"} reaction, ${count}`}
                  onClick={() => {
                    if (!mine) setPops((p) => ({ ...p, [reaction]: (p[reaction] ?? 0) + 1 }));
                    onReact(message.id, reaction);
                  }}
                  className={`flex h-7 items-center gap-1.5 rounded-pill pl-1.5 pr-2.5 text-[12.5px] font-semibold transition-colors duration-(--motion-fast) ${
                    mine ? "bg-text text-on-primary" : "bg-surface-secondary text-text-body shadow-[inset_0_0_0_1px_rgba(242,242,242,0.08)] hover:bg-surface-tertiary"
                  }`}
                >
                  <PuffFace reaction={reaction} size={18} pop={pops[reaction] ?? 0} />
                  <span className="text-xs">{count}</span>
                </button>
              );
            })}
            <span className="hidden items-center gap-0.5 rounded-pill bg-surface-secondary px-1 group-hover:flex">
              {PUFF_FACES.map(({ face }) => (
                <button
                  key={face}
                  type="button"
                  aria-label={`Add ${face} reaction`}
                  onClick={() => {
                    setPops((p) => ({ ...p, [puffReaction(face)]: (p[puffReaction(face)] ?? 0) + 1 }));
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
    </article>
  );
}

export default function AppPreview() {
  const [channel, setChannel] = useState("welcome");
  const [messages, setMessages] = useState(SEED);
  const [draft, setDraft] = useState("");
  const [inVoice, setInVoice] = useState(false);
  const [muted, setMuted] = useState(false);
  const [talker, setTalker] = useState(0);
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
    const stamp = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMessages((m) => ({ ...m, [channel]: [...m[channel]!, { id: nextId.current++, who: "you", time: stamp, body: [text], reactions: {} }] }));
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

  const rows = messages[channel] ?? [];
  const roster = [
    { key: "ada", muted: false },
    { key: "grace", muted: true },
    { key: "linus", muted: false },
    ...(inVoice ? [{ key: "you", muted }] : []),
  ];
  const online = ["ada", "grace", "linus", "margaret", "you"];
  const offline = ["alan"];

  return (
    <div className="relative mx-auto flex h-[640px] w-full max-w-[1180px] gap-2 overflow-hidden rounded-2xl border border-border-secondary bg-background p-2 shadow-modal" role="group" aria-label="Interactive preview of the Pufferblow app">
      {/* Space rail */}
      <nav aria-label="Spaces" className="flex w-[72px] shrink-0 flex-col items-center gap-2.5 overflow-hidden pb-[76px] pt-1.5 max-sm:hidden">
        <Tile label="Home" className="bg-surface-secondary !text-[#f2f2f2] hover:bg-primary hover:!text-black">
          <PufferblowMark size={30} tone="current" />
        </Tile>
        <div className="h-0.5 w-7 rounded bg-border-secondary" />
        <Tile label="Switchyard on switchyard.works" selected className="bg-surface-secondary">
          <SpaceIcon id={HOME} name="Switchyard" size={48} radius="inherit" className="absolute inset-0" />
          <CountBadge count={2} className="absolute -bottom-1.5 -right-1.5 border-[3px] border-background" />
        </Tile>
        <Tile label="Mesh Garden on mesh.garden">
          <SpaceIcon id="mesh.garden" name="Mesh Garden" size={48} radius="inherit" className="absolute inset-0" />
        </Tile>
        <Tile label="Kiln on kiln.social">
          <SpaceIcon id="kiln.social" name="Kiln" size={48} radius="inherit" className="absolute inset-0" />
        </Tile>
        <Tile label="Add an instance" className="!rounded-full bg-surface-secondary text-text-tertiary hover:!rounded-[14px] hover:bg-surface-tertiary hover:text-text">
          <Plus size={20} aria-hidden="true" />
        </Tile>
      </nav>

      {/* Sidebar */}
      <aside className="flex w-[288px] shrink-0 flex-col overflow-hidden rounded-lg bg-surface max-md:hidden">
        <div className="relative h-[118px] shrink-0" style={{ background: `linear-gradient(transparent 30%, rgba(10,10,10,.85)), ${defaultBannerCss(HOME)}` }}>
          <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-lg bg-black/30 text-[#dadada]">
            <ChevronDown size={15} aria-hidden="true" />
          </span>
          <div className="absolute inset-x-3.5 bottom-3 min-w-0">
            <h2 className="pb-panel-header m-0 truncate text-xl">Switchyard</h2>
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#dadada]">
              <Globe size={11} aria-hidden="true" />
              {HOME}
            </div>
          </div>
        </div>

        <nav aria-label="Channels" className="min-h-0 flex-1 overflow-y-auto px-2 pt-1">
          {CHANNELS.map((group) => (
            <section key={group.group} aria-label={group.group}>
              <div className="pb-section-label flex items-center gap-1.5 px-2.5 pb-1.5 pt-3.5">
                <ChevronDown size={11} aria-hidden="true" />
                {group.group}
              </div>
              <div className="flex flex-col gap-px">
                {group.items.map((item) => {
                  const Icon = "private" in item && item.private ? Lock : Hash;
                  const active = channel === item.id;
                  const pings = !active && "pings" in item ? item.pings : 0;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setChannel(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={`flex h-[34px] items-center gap-2 rounded-sm pl-2.5 pr-3 text-left text-[14.5px] transition-colors duration-(--motion-fast) hover:bg-surface-secondary ${
                        active ? "bg-surface-tertiary font-semibold text-text" : pings ? "font-semibold text-text" : "font-medium text-text-tertiary hover:text-text-body"
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
          ))}

          <section>
            <div className="pb-section-label flex items-center gap-1.5 px-2.5 pb-1.5 pt-3.5">
              <ChevronDown size={11} aria-hidden="true" />
              Voice
            </div>
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
            <ul aria-label="In this call" className="m-0 mb-1 ml-[22px] mt-0.5 list-none space-y-px p-0">
              {roster.map((p, i) => (
                <li key={p.key} className="flex h-7 items-center gap-2 rounded-md pl-2 pr-1.5 text-[13px] text-text-body">
                  <Avatar handle={handleOf(p.key)} size={22} speaking={!p.muted && talker === i} muted={p.muted} />
                  <span className="min-w-0 flex-1 truncate">{PEOPLE[p.key]!.name}</span>
                  {p.muted && <MicOff size={12} aria-label="Muted" className="shrink-0 text-text-muted" />}
                </li>
              ))}
            </ul>
          </section>
        </nav>

        {inVoice && (
          <div role="status" className="mx-2 mt-2 flex items-center gap-2 rounded-xl bg-surface-secondary px-2.5 py-2">
            <Volume2 size={16} className="shrink-0 text-success" aria-hidden="true" />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-[12.5px] font-semibold text-success">Voice connected</div>
              <div className="truncate text-[11.5px] text-text-tertiary">Lounge</div>
            </div>
          </div>
        )}
        <div aria-hidden="true" className="h-[76px] shrink-0" />
      </aside>

      {/* Chat */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-[14px] bg-surface" aria-label={`#${channel}`}>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border-secondary px-[18px]">
          {channel === "staff" ? <Lock size={18} className="text-text-tertiary" aria-hidden="true" /> : <Hash size={18} className="text-text-tertiary" aria-hidden="true" />}
          <h1 className="m-0 font-heading text-[19px] font-semibold">{channel}</h1>
          <p className="m-0 min-w-0 flex-1 truncate text-[13px] text-text-tertiary max-sm:hidden">
            {channel === "welcome" ? "Start here. Say hello." : channel === "announcements" ? "Release notes and plans." : ""}
          </p>
          <div className="ml-auto flex items-center gap-1 text-text-tertiary">
            <span className={iconButton}>
              <Bell size={17} aria-hidden="true" />
            </span>
            <span className={`${iconButton} max-sm:hidden`}>
              <Pin size={17} aria-hidden="true" />
            </span>
            <span className="flex h-8 w-[150px] items-center gap-2 rounded-pill bg-surface-secondary px-3 text-[12.5px] text-text-muted max-lg:hidden">
              <Search size={14} aria-hidden="true" />
              Search #{channel}
            </span>
            <span className={`${iconButton} bg-surface-secondary text-primary max-xl:hidden`}>
              <Users size={17} aria-hidden="true" />
            </span>
          </div>
        </header>

        <div ref={log} className="min-h-0 flex-1 overflow-y-auto py-3" data-message-list>
          {rows.map((m, i) => (
            <Message key={m.id} message={m} grouped={i > 0 && rows[i - 1]!.who === m.who} onReact={react} />
          ))}
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
            <button type="submit" aria-label="Send message" disabled={!draft.trim()} className="mb-0.75 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-on-primary disabled:bg-surface-tertiary disabled:text-text-faint">
              <Send size={14} aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>

      {/* Members */}
      <aside aria-label="Members" className="w-60 shrink-0 overflow-y-auto rounded-lg bg-surface px-2.5 py-3 max-xl:hidden">
        {[
          { label: "Online", keys: online },
          { label: "Offline", keys: offline },
        ].map((group) => (
          <section key={group.label}>
            <h3 className="pb-section-label m-0 px-1.5 pb-1.5 pt-3">
              {group.label} — {group.keys.length}
            </h3>
            <ul className="m-0 list-none p-0">
              {group.keys.map((key) => {
                const person = PEOPLE[key]!;
                return (
                  <li key={key} className="flex items-center gap-2.5 rounded-sm p-1.5 hover:bg-surface-secondary">
                    <Avatar handle={handleOf(key)} size={32} presence={person.status} activity={inVoice && key === "you"} />
                    <div className="min-w-0 leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className={`truncate text-sm font-semibold ${person.status === "offline" ? "text-text-muted" : "text-text-body"}`}>{person.name}</span>
                        {person.host !== HOME && <HostPill host={person.host} />}
                      </div>
                      <div className="pb-meta truncate text-[11.5px]">{person.note ?? presenceLabel(person.status)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </aside>

      {/* The user panel floats across the rail and the sidebar, as in the app. */}
      <div className="pointer-events-none absolute bottom-2 left-2 w-[352px] max-w-[calc(100%-1rem)] max-md:w-[calc(100%-1rem)]">
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-lg bg-surface-secondary px-3 py-2.5 shadow-modal">
          <Avatar handle={ME.handle} size={34} presence="online" activity={inVoice} muted={inVoice && muted} ringColor="var(--color-surface-secondary)" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-bold">{ME.name}</div>
            <div className="pb-meta truncate text-[11px]">{HOME}</div>
          </div>
          <button type="button" className={`${iconButton} ${muted ? "text-error-text" : ""}`} aria-label={muted ? "Unmute microphone" : "Mute microphone"} aria-pressed={muted} disabled={!inVoice} onClick={() => setMuted((m) => !m)}>
            {muted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <span className={iconButton}>
            <Headphones size={16} aria-hidden="true" />
          </span>
          <span className={iconButton}>
            <Settings size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}

