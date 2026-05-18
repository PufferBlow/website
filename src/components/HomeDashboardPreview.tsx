// Static preview of the live Pufferblow dashboard. Mirrors the panel
// composition and class tokens used in
// client/app/components/pages/DashboardPage.tsx so the marketing screenshot
// stays honest as the real UI evolves. No state, no interactivity — just
// shells of the real components.

type Channel = {
  id: string;
  name: string;
  unread?: boolean;
  draft?: boolean;
  selected?: boolean;
};

type Member = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  statusText?: string;
};

type Message = {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  status: "online" | "idle" | "dnd";
};

const textChannels: Channel[] = [
  { id: "welcome", name: "welcome", selected: true },
  { id: "announcements", name: "announcements", unread: true },
  { id: "general", name: "general" },
  { id: "design", name: "design", draft: true },
  { id: "media", name: "media" },
];

const voiceChannels: Channel[] = [
  { id: "lounge", name: "Lounge" },
  { id: "standup", name: "Stand-up" },
];

const messages: Message[] = [
  {
    id: "m1",
    author: "John Doe",
    avatar: "JD",
    timestamp: "Today at 2:31 PM",
    content:
      "First chat app where I don't have to wonder what's being logged. The server runs on our own box — everything stays here.",
    status: "online",
  },
  {
    id: "m2",
    author: "Sarah Jane",
    avatar: "SJ",
    timestamp: "Today at 2:33 PM",
    content:
      "No ads, no \"recommended\" channels, no analytics SDK staring at me. I keep forgetting how loud the alternative was.",
    status: "idle",
  },
  {
    id: "m3",
    author: "Mike Brown",
    avatar: "MB",
    timestamp: "Today at 2:36 PM",
    content:
      "Closed my account on the big one yesterday. Honestly didn't realize how much it bothered me until I stopped seeing tracker prompts every time I joined a call.",
    status: "dnd",
  },
];

const roleGroups: { role: string; members: Member[] }[] = [
  {
    role: "Admin",
    members: [
      { id: "u1", name: "John Doe", avatar: "JD", status: "online", statusText: "online" },
    ],
  },
  {
    role: "Moderator",
    members: [
      { id: "u2", name: "Sarah Jane", avatar: "SJ", status: "idle", statusText: "away" },
      { id: "u3", name: "Mike Brown", avatar: "MB", status: "dnd", statusText: "do not disturb" },
    ],
  },
  {
    role: "Member",
    members: [
      { id: "u4", name: "Alex Park", avatar: "AP", status: "online" },
      { id: "u5", name: "Pat Lin", avatar: "PL", status: "online" },
      { id: "u6", name: "Sam Cole", avatar: "SC", status: "offline" },
    ],
  },
];

function statusDot(status: Member["status"] | Message["status"]): string {
  if (status === "online") return "bg-[var(--color-success)]";
  if (status === "idle") return "bg-[var(--color-warning)]";
  if (status === "dnd") return "bg-[var(--color-error)]";
  return "bg-[var(--color-text-muted)]";
}

function HashIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function SpeakerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function BellIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UsersIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PencilIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function MicIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M19 10a7 7 0 0 1-14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function HeadphonesIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1v-7h3v5z" />
      <path d="M3 19a2 2 0 0 0 2 2h1v-7H3v5z" />
    </svg>
  );
}

function CogIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function HomeDashboardPreview() {
  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="overflow-hidden rounded-[1.75rem] border border-[var(--color-border-secondary)] bg-[var(--color-surface)] shadow-xl">
        {/* Browser chrome */}
        <div className="h-10 bg-[var(--color-surface-secondary)] border-b border-[var(--color-border)] flex items-center px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-error)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-warning)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
          </div>
          <div className="flex-1 text-center text-xs text-[var(--color-text-secondary)]">
            your.instance.example/dashboard
          </div>
        </div>

        {/* Dashboard shell — same classes as the live app's outer wrapper */}
        <div className="h-[620px] overflow-hidden bg-[var(--color-background)] flex font-sans gap-2 p-2 select-none relative min-w-0">
          {/* Left sidebar column: server rail + channel panel stacked over user panel */}
          <div className="flex flex-col gap-2 h-full shrink-0 min-w-0">
            <div className="flex flex-1 gap-2 min-h-0">
              {/* ServerRail */}
              <div className="w-16 shrink-0 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2 flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-[var(--color-on-primary)]">
                    PB
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-surface)]" />
                </div>
                <div className="w-8 h-px bg-[var(--color-surface-tertiary)]" />
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-surface-secondary)] text-sm font-semibold text-[var(--color-text-secondary)]">
                  WS
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-surface-secondary)] text-sm font-semibold text-[var(--color-text-secondary)]">
                  DV
                </div>
                <button
                  type="button"
                  className="mt-auto flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-lg text-[var(--color-text-secondary)]"
                >
                  +
                </button>
              </div>

              {/* ChannelPanel */}
              <div className="flex w-72 lg:w-80 shrink-0 min-w-[16rem] max-w-[22rem] flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                {/* ChannelSidebarHeader — banner + overlapping server avatar */}
                <div className="relative">
                  <div className="h-14 w-full bg-gradient-to-br from-[var(--color-surface-tertiary)] via-[var(--color-surface-secondary)] to-[var(--color-surface)]" />
                  <div className="absolute left-3 top-8 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[var(--color-background)] bg-[var(--color-primary)] text-sm font-bold text-[var(--color-on-primary)]">
                    PB
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 pt-8 pb-3 border-b border-[var(--color-border)]">
                  <div className="min-w-0">
                    <h1 className="truncate text-base font-bold text-[var(--color-text)]">
                      Welcome Server
                    </h1>
                    <p className="truncate text-[11px] text-[var(--color-text-muted)]">
                      Decentralized community
                    </p>
                  </div>
                  <button
                    type="button"
                    className="pb-icon-btn shrink-0"
                    aria-label="Server menu"
                  >
                    <ChevronDownIcon className="pb-icon" />
                  </button>
                </div>

                {/* ChannelList */}
                <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
                  <div>
                    <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                      Text channels
                    </p>
                    <ul className="space-y-0.5">
                      {textChannels.map((ch) => (
                        <li key={ch.id}>
                          <div
                            className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm ${
                              ch.selected
                                ? "bg-[var(--color-active)] text-[var(--color-text)]"
                                : "text-[var(--color-text-secondary)]"
                            }`}
                          >
                            <HashIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-secondary)]" />
                            <span className={`truncate ${ch.unread && !ch.selected ? "font-medium text-[var(--color-text)]" : ""}`}>
                              {ch.name}
                            </span>
                            <span className="ml-auto flex items-center gap-1.5">
                              {ch.draft && (
                                <PencilIcon className="h-3 w-3 text-[var(--color-primary)]" />
                              )}
                              {ch.unread && !ch.selected && (
                                <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                              )}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                      Voice channels
                    </p>
                    <ul className="space-y-0.5">
                      {voiceChannels.map((ch) => (
                        <li key={ch.id}>
                          <div className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-[var(--color-text-secondary)]">
                            <SpeakerIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-secondary)]" />
                            <span className="truncate">{ch.name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* UserPanel under the left sidebar column */}
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
              <div className="relative shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-[var(--color-on-primary)]">
                  JD
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-surface)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[var(--color-text)]">John Doe</p>
                <p className="truncate text-[11px] text-[var(--color-text-muted)]">online</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" className="pb-icon-btn" aria-label="Mute mic">
                  <MicIcon className="pb-icon" />
                </button>
                <button type="button" className="pb-icon-btn" aria-label="Deafen">
                  <HeadphonesIcon className="pb-icon" />
                </button>
                <button type="button" className="pb-icon-btn" aria-label="User settings">
                  <CogIcon className="pb-icon" />
                </button>
              </div>
            </div>
          </div>

          {/* MessagePane */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* ChatHeader */}
            <div className="h-12 flex items-center justify-between border-b border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface-secondary)_70%,transparent)] px-4">
              <div className="flex items-center gap-2 min-w-0">
                <HashIcon className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" />
                <h2 className="truncate font-semibold tracking-tight text-[var(--color-text)]">
                  welcome
                </h2>
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)] sm:inline">
                  channel
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" className="pb-icon-btn relative" aria-label="Notifications">
                  <BellIcon className="pb-icon-lg" />
                  <span className="absolute -right-1 -top-1 rounded-full bg-[var(--color-primary)] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[var(--color-on-primary)]">
                    2
                  </span>
                </button>
                <button type="button" className="pb-icon-btn" aria-label="Search messages">
                  <SearchIcon className="pb-icon-lg" />
                </button>
                <button type="button" className="pb-icon-btn" aria-label="Toggle members">
                  <UsersIcon className="pb-icon-lg" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 break-words">
              {messages.map((m) => (
                <div key={m.id} className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-[var(--color-on-primary)]">
                      {m.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--color-surface)] ${statusDot(m.status)}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        {m.author}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">{m.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {m.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="border-t border-[var(--color-border)] p-3">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3 py-2">
                <button
                  type="button"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                  aria-label="Add attachment"
                >
                  +
                </button>
                <span className="flex-1 truncate text-sm text-[var(--color-text-muted)]">
                  Message #welcome
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">⏎</span>
              </div>
            </div>
          </div>

          {/* MembersPanel */}
          <div className="hidden xl:flex w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="h-12 flex items-center justify-between border-b border-[var(--color-border)] px-4">
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">
                Members
              </p>
              <span className="text-xs text-[var(--color-text-muted)]">
                {roleGroups.reduce((n, g) => n + g.members.length, 0)}
              </span>
            </div>

            <div className="border-b border-[var(--color-border)] px-3 py-2">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <div className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-secondary)] py-1.5 pl-8 pr-2 text-xs text-[var(--color-text-muted)]">
                  Search members
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {roleGroups.map((group) => (
                <div key={group.role} className="space-y-2">
                  <p className="rounded border border-[var(--color-border)] bg-[var(--color-surface-tertiary)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                    {group.role} — {group.members.length}
                  </p>
                  <ul className="space-y-1">
                    {group.members.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5"
                      >
                        <div className="relative shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-secondary)] text-[11px] font-semibold text-[var(--color-text)]">
                            {member.avatar}
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-surface)] ${statusDot(member.status)}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-[var(--color-text)]">{member.name}</p>
                          {member.statusText && (
                            <p className="truncate text-[11px] text-[var(--color-text-muted)]">
                              {member.statusText}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
