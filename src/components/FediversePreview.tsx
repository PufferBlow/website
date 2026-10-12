// Interactive illustration of federation: independent instances linked to each other. Click an
// instance to send a message from it; the message travels along the links and shows up on
// the others. Made-up content, all local.

import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";

import GoldPuffer from "./GoldPuffer";

type Node = { host: string; name: string; people: string[]; x: number; y: number };

const NODES: Node[] = [
  { host: "chat.example.org", name: "Dev Community", people: ["ada", "linus"], x: 14, y: 36 },
  { host: "club.example.net", name: "Book Club", people: ["grace"], x: 50, y: 78 },
  { host: "hq.example.com", name: "Studio HQ", people: ["alan", "margaret"], x: 86, y: 36 },
];

const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 2],
];

const LINES = ["Hello from another instance.", "Same conversation, different servers.", "No central company in the middle."];

const TRAVEL_MS = 900;
const ARRIVED_MS = 1800;

type Send = { id: number; from: number; line: string };

function InstanceCard({
  node,
  active,
  arrived,
  onSend,
}: {
  node: Node;
  active: boolean;
  arrived: boolean;
  onSend: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSend}
      aria-label={`Send a message from ${node.name} (${node.host})`}
      className={`absolute z-10 w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] border bg-[var(--color-surface)] p-3 text-left shadow-[0_8px_24px_var(--color-shadow)] transition-[transform,border-color,box-shadow] hover:scale-[1.03] hover:border-[var(--color-primary)]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] max-sm:w-[150px] max-sm:p-2.5 ${
        active || arrived ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"
      } ${arrived ? "shadow-[0_0_0_4px_rgba(227,174,79,0.18)]" : ""}`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <span className="flex items-center gap-2.5">
        <GoldPuffer size={30} />
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-display text-[17px] text-[var(--color-text)]">{node.name}</span>
          <span className="flex items-center gap-1 truncate text-[11px] text-[var(--color-text-tertiary)]">
            <Globe size={11} aria-hidden="true" />
            {node.host}
          </span>
        </span>
      </span>
      <span className="mt-2.5 flex flex-wrap gap-1.5">
        {node.people.map((p) => (
          <span
            key={p}
            className="rounded-full bg-[var(--color-surface-secondary)] px-2 py-0.5 text-[11.5px] text-[var(--color-text-secondary)]"
          >
            @{p}
          </span>
        ))}
      </span>
      {arrived && (
        <span className="absolute -top-2.5 right-3 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--color-on-primary)]">
          New message
        </span>
      )}
    </button>
  );
}

export default function FediversePreview() {
  const [sent, setSent] = useState<Send | null>(null);
  const [arrived, setArrived] = useState<number[]>([]);
  const counter = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const send = (from: number) => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    const id = ++counter.current;
    setArrived([]);
    setSent({ id, from, line: LINES[id % LINES.length]! });
    timers.current.push(
      window.setTimeout(() => setArrived(NODES.map((_, i) => i).filter((i) => i !== from)), TRAVEL_MS),
      window.setTimeout(() => setArrived([]), TRAVEL_MS + ARRIVED_MS),
    );
  };

  const author = sent ? NODES[sent.from]! : null;

  return (
    <div
      role="group"
      aria-label="Interactive demo: click an instance to send a message to the others. Nothing is sent anywhere."
      className="relative h-[460px] overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-background)] shadow-[0_18px_42px_var(--color-shadow-lg)] sm:h-[440px]"
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(239,230,212,0.03)_0_2px,transparent_2px_16px)]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {LINKS.map(([a, b]) => {
          const lit = sent !== null && (sent.from === a || sent.from === b);
          return (
            <line
              key={`${a}-${b}`}
              x1={NODES[a]!.x}
              y1={NODES[a]!.y}
              x2={NODES[b]!.x}
              y2={NODES[b]!.y}
              stroke="#e3ae4f"
              strokeOpacity={lit ? 0.9 : 0.4}
              strokeWidth={lit ? 2 : 1.5}
              strokeDasharray="5 5"
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke-opacity 200ms, stroke-width 200ms" }}
            />
          );
        })}
      </svg>

      {/* One packet per receiving instance, travelling from the sender. */}
      {sent &&
        NODES.map((to, i) =>
          i === sent.from ? null : (
            <span
              key={`${sent.id}-${i}`}
              aria-hidden="true"
              className="pb-packet pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)] shadow-[0_0_14px_3px_rgba(227,174,79,0.6)]"
              style={
                {
                  "--x0": `${NODES[sent.from]!.x}%`,
                  "--y0": `${NODES[sent.from]!.y}%`,
                  "--x1": `${to.x}%`,
                  "--y1": `${to.y}%`,
                  animationDuration: `${TRAVEL_MS}ms`,
                } as React.CSSProperties
              }
            />
          ),
        )}

      {NODES.map((n, i) => (
        <InstanceCard
          key={n.host}
          node={n}
          active={sent?.from === i}
          arrived={arrived.includes(i)}
          onSend={() => send(i)}
        />
      ))}

      <div
        role="status"
        className="absolute left-1/2 top-[7%] w-[min(320px,86%)] -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-3.5 py-2.5 shadow-[0_8px_24px_var(--color-shadow)]"
      >
        {sent && author ? (
          <>
            <div className="flex items-baseline gap-2 text-[13px]">
              <span className="font-bold text-[var(--color-text)]">{author.people[0]}</span>
              <span className="text-[11.5px] text-[var(--color-primary)]">@{author.host}</span>
            </div>
            <p className="m-0 mt-0.5 text-[14px] text-[var(--color-text-secondary)]">{sent.line}</p>
          </>
        ) : (
          <p className="m-0 text-center text-[14px] text-[var(--color-text-tertiary)]">Click an instance to send a message.</p>
        )}
      </div>
    </div>
  );
}
