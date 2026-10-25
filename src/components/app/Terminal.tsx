import type { ReactNode } from "react";

/** One line of a terminal: a command (with its prompt), its output, or a comment. */
export type TerminalLine =
  | { cmd: string }
  | { out: ReactNode; tone?: "ok" | "warn" | "dim" }
  | { note: string };

const TONE = {
  ok: "text-success",
  warn: "text-warning",
  dim: "text-text-muted",
} as const;

/** A terminal window for the page: the commands you would actually type, and what they print. */
export function Terminal({
  title,
  lines,
  className = "",
}: {
  title: string;
  lines: TerminalLine[];
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg bg-background shadow-[inset_0_0_0_1px_rgba(242,242,242,0.1)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-border-secondary px-3 py-1.5">
        <span className="size-2 rounded-full bg-surface-tertiary" />
        <span className="size-2 rounded-full bg-surface-tertiary" />
        <span className="size-2 rounded-full bg-surface-tertiary" />
        <span className="ml-2 truncate font-mono text-[11px] text-text-muted">
          {title}
        </span>
      </div>
      <pre className="m-0 whitespace-pre-wrap break-words px-3 py-2.5 font-mono text-[12px] leading-[1.65] text-text-body">
        {lines.map((line, i) =>
          "cmd" in line ? (
            <div key={i}>
              <span className="select-none text-text-muted">$ </span>
              {line.cmd}
            </div>
          ) : "note" in line ? (
            <div key={i} className="text-text-muted">
              # {line.note}
            </div>
          ) : (
            <div
              key={i}
              className={line.tone ? TONE[line.tone] : "text-text-tertiary"}
            >
              {line.out}
            </div>
          ),
        )}
      </pre>
    </div>
  );
}
