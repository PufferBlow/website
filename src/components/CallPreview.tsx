// The call card from the app (client-new `CallOverlay`) with its safety number dialog, as a small
// working demo: compare the digits, mark them as matching, and the lock changes.

import { useState } from "react";
import { Lock, Mic, MicOff, PhoneOff, ShieldCheck } from "lucide-react";

import { Avatar } from "./app/Avatar";

const SAFETY = "26568 72542 65128 89547 07755 95815 25399 64547 57193 29141 26690 17011".split(" ");

export default function CallPreview() {
  const [verified, setVerified] = useState(false);
  const [muted, setMuted] = useState(false);
  const Icon = verified ? ShieldCheck : Lock;

  return (
    <div className="mx-auto grid max-w-[980px] gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-center">
      <div className="flex flex-col gap-3">
        <div role="status" aria-label="Call with grace" className="rounded-2xl bg-surface-tertiary p-3.5 shadow-modal">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar handle="grace@switchyard.works" size={44} speaking ringColor="var(--color-surface-tertiary)" />
                <div className="min-w-0 flex-1 truncate text-[15px] font-bold">grace</div>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[12.5px] tabular-nums text-text-tertiary">4:12</span>
                <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${verified ? "text-success" : "text-text-tertiary"}`}>
                  <Icon size={13} aria-hidden="true" />
                  {verified ? "End-to-end encrypted · verified" : "End-to-end encrypted · not verified"}
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-pressed={muted}
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={() => setMuted((m) => !m)}
              className={`grid size-10 place-items-center rounded-full border-0 text-text ${muted ? "bg-error/14 text-error-text" : "bg-surface-secondary hover:bg-surface"}`}
            >
              {muted ? <MicOff size={17} /> : <Mic size={17} />}
            </button>
            <span className="grid size-10 place-items-center rounded-full bg-error/14 text-error-text">
              <PhoneOff size={17} aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-surface-tertiary p-5 shadow-modal">
          <h3 className="pb-title m-0">Safety number</h3>
          <p className="pb-meta mt-1.5 text-[13px]">If grace reads you the same digits (in person, or over another app), nobody can be listening in between you.</p>
          <p aria-label="Safety number" className="m-0 mt-4 grid grid-cols-4 gap-x-4 gap-y-2 text-center font-mono text-[15px] tabular-nums text-text">
            {SAFETY.map((group, i) => (
              <span key={i}>{group}</span>
            ))}
          </p>
          <div className="mt-5 flex justify-end">
            <button type="button" disabled={verified} onClick={() => setVerified(true)} className="pb-button-primary border-0 disabled:bg-surface-secondary disabled:text-text-faint">
              {verified ? "Verified" : "They match"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="pb-display m-0 !text-[30px]">Not even your own server can listen in.</h3>
        <ul className="m-0 mt-5 flex list-none flex-col gap-4 p-0 text-[15px] leading-relaxed text-text-body">
          <li>
            <strong className="text-text">Signed, not trusted.</strong> The instance passes your call&apos;s set-up messages along, so each side signs the details with a key that never leaves its device. A changed detail fails the check and the call does not start.
          </li>
          <li>
            <strong className="text-text">A changed key stops the call.</strong> The first key you see for someone is remembered. If it changes, Pufferblow asks before going on and suggests comparing safety numbers.
          </li>
          <li>
            <strong className="text-text">Through the server, still sealed.</strong> If two devices cannot reach each other, the call goes through the media server with every audio frame encrypted. A browser that cannot do that ends the call instead of quietly dropping the protection.
          </li>
          <li className="text-text-tertiary">Voice channels are group rooms the media server hosts; they are not end-to-end encrypted, and the app does not say they are.</li>
        </ul>
      </div>
    </div>
  );
}
