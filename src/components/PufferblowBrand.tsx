interface PufferblowMarkProps {
  size?: number;
  className?: string;
}

interface PufferblowBrandProps extends PufferblowMarkProps {
  titleClassName?: string;
  subtitleClassName?: string;
  textClassName?: string;
  subtitle?: string;
  align?: "left" | "center";
}

const INK = "#1c1408";
const BRASS = "#e3ae4f";
const SPINE = "M43.2 31 Q43.8 22 46 14.5 Q50.6 22 52.8 31Z";

/** The puffer: a brass tile with an inked body, spines and tail. Same artwork as the app icon. */
export function PufferblowMark({ size = 64, className = "" }: PufferblowMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`.trim()}
    >
      <defs>
        <linearGradient id="pb-mark-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1c46a" />
          <stop offset="1" stopColor="#cf8f2c" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="27" fill="url(#pb-mark-tile)" />
      <g transform="translate(60 60) scale(.86) translate(-50 -52)" fill={INK}>
        <path d="M27 45 C19 39 13 33.5 6.5 32.5 C8.5 40 10 46.5 13.5 52 C10 57.5 8.5 64 6.5 71.5 C13 70.5 19 65 27 59Z" />
        {[0, 45, 135, 180, 225, 315].map((deg) => (
          <path key={deg} d={SPINE} transform={`rotate(${deg} 48 52)`} />
        ))}
        <circle cx="48" cy="52" r="25.5" />
        <circle cx="59" cy="45" r="7" fill={BRASS} />
        <circle cx="74" cy="55" r="4.4" />
        <circle cx="75" cy="55" r="2.3" fill={BRASS} />
        <circle cx="86" cy="47" r="4" />
      </g>
    </svg>
  );
}

export function PufferblowBrand({
  size = 64,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  textClassName = "",
  subtitle,
  align = "left",
}: PufferblowBrandProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <PufferblowMark size={size} />
      <div className={`flex flex-col ${alignment} ${textClassName}`.trim()}>
        <span
          className={`font-display text-3xl leading-none text-[var(--color-text)] ${titleClassName}`.trim()}
        >
          Pufferblow
        </span>
        {subtitle ? (
          <span
            className={`mt-1 font-heading text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)] ${subtitleClassName}`.trim()}
          >
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}
