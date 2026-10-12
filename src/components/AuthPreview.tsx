// Interactive replica of the app's sign-in and create-account screens (client-new AuthLayout +
// AuthFields). The fields are real and validate like the app does, but nothing is sent anywhere.

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, AtSign, Eye, EyeOff, Lock } from "lucide-react";

import GoldPuffer from "./GoldPuffer";

const HANDLE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PASSWORD_MIN = 8;

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  error,
  secret,
  autoComplete,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  secret?: boolean;
  autoComplete?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <label className="flex flex-col gap-[7px]">
      <span className="text-[13px] text-[var(--color-text-tertiary)]">{label}</span>
      <span
        className={`flex h-12 items-center gap-2.5 rounded-xl border bg-[var(--color-surface-secondary)] pl-3.5 pr-2 text-[15px] text-[var(--color-text-tertiary)] focus-within:ring-4 ${
          error
            ? "border-[var(--color-error)]/70 focus-within:ring-[var(--color-error)]/15"
            : "border-[var(--color-border-secondary)] focus-within:border-[var(--color-primary)]/55 focus-within:ring-[var(--color-primary)]/10"
        }`}
      >
        {icon}
        <input
          type={secret && !shown ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete ?? "off"}
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          className="min-w-0 flex-1 bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
        {secret && (
          <button
            type="button"
            aria-label={shown ? "Hide password" : "Show password"}
            onClick={() => setShown((s) => !s)}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]"
          >
            {shown ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </span>
      {error && (
        <span role="alert" className="text-xs text-[var(--color-error)]">
          {error}
        </span>
      )}
    </label>
  );
}

type Errors = Record<string, string | undefined>;

function Screen({
  mode,
  eyebrow,
  title,
  cta,
  footer,
}: {
  mode: "signin" | "signup";
  eyebrow: string;
  title: string;
  cta: string;
  footer: string;
}) {
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!HANDLE.test(handle.trim())) next.handle = "Use a handle like name@chat.example.com.";
    if (mode === "signin" && !password) next.password = "Enter your password.";
    if (mode === "signup") {
      if (password.length < PASSWORD_MIN) next.password = `Use at least ${PASSWORD_MIN} characters.`;
      if (confirm !== password) next.confirm = "Passwords don't match.";
    }
    setErrors(next);
    setDone(Object.keys(next).length === 0);
  };

  const clear = (set: (v: string) => void) => (v: string) => {
    set(v);
    setDone(false);
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-[18px] rounded-[14px] bg-[var(--color-surface)] px-7 py-8 sm:px-10"
    >
      <div className="flex items-center gap-2.5">
        <GoldPuffer size={34} />
        <span className="font-display text-[24px] leading-none text-[var(--color-text)]">Pufferblow</span>
      </div>
      <div>
        <div className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          {eyebrow}
        </div>
        <h3 className="mt-2 font-display text-[32px] font-normal leading-[1.1] text-[var(--color-text)]">{title}</h3>
      </div>

      <Field
        label="Handle"
        icon={<AtSign size={16} />}
        value={handle}
        onChange={clear(setHandle)}
        placeholder="name@chat.example.com"
        error={errors.handle}
      />
      <Field
        label="Password"
        icon={<Lock size={16} />}
        value={password}
        onChange={clear(setPassword)}
        placeholder={mode === "signup" ? `At least ${PASSWORD_MIN} characters` : "Enter your password"}
        error={errors.password}
        secret
        autoComplete="new-password"
      />
      {mode === "signup" && (
        <Field
          label="Confirm password"
          icon={<Lock size={16} />}
          value={confirm}
          onChange={clear(setConfirm)}
          placeholder="Re-enter your password"
          error={errors.confirm}
          secret
          autoComplete="new-password"
        />
      )}

      <button
        type="submit"
        className="mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[var(--color-primary-hover)] to-[#d99c3a] font-heading text-base font-semibold uppercase tracking-[0.1em] text-[var(--color-on-primary)] hover:brightness-105"
      >
        {cta}
        <ArrowRight size={16} aria-hidden="true" />
      </button>

      <p role="status" className="m-0 min-h-5 text-center text-[13px] text-[var(--color-text-tertiary)]">
        {done ? "That looks good. This is a demo, so nothing was sent." : footer}
      </p>
    </form>
  );
}

export default function AuthPreview() {
  return (
    <div
      role="group"
      aria-label="Interactive demo of the Pufferblow sign-in and create-account screens. Nothing you type is sent anywhere."
      className="grid gap-2.5 overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-background)] p-2.5 shadow-[0_18px_42px_var(--color-shadow-lg)] md:grid-cols-2"
    >
      <Screen
        mode="signin"
        eyebrow="Welcome back"
        title="Sign in to your instance"
        cta="Sign in"
        footer="Demo only. Nothing is sent."
      />
      <Screen
        mode="signup"
        eyebrow="Join an instance"
        title="Create your account"
        cta="Create account"
        footer="Demo only. Nothing is sent."
      />
    </div>
  );
}
