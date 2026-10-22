import { useId } from "react";

interface PufferblowMarkProps {
  size?: number;
  className?: string;
  /** `current` takes the colour of the surrounding text, so hover and selected states can recolour it. */
  tone?: "cream" | "current";
}

interface PufferblowBrandProps extends PufferblowMarkProps {
  titleClassName?: string;
  subtitleClassName?: string;
  textClassName?: string;
  subtitle?: string;
  align?: "left" | "center";
}

const CREAM = "#f2f2f2";
const SMALL_BELOW_PX = 32;

// The v2 puffer face (brand sheet `brand/ui-mockups-v2`): a solid fill seen through a mask, so the
// eyes and mouth are real cut-outs. Full mark from 32 px up, simplified mark below.
const FULL = {
  body: { x: 13, y: 33, width: 94, height: 64, rx: 32 },
  spines:
    "M22 48Q14.03 36.69 12 23Q27.26 26.06 40 35ZM80 35Q92.74 26.06 108 23Q105.97 36.69 98 48ZM50 34Q52.67 22.84 60 14Q67.33 22.84 70 34ZM14 61Q9.68 63.74 6 70Q7.16 76.74 15 80ZM105 80Q109.84 76.74 114 70Q113.32 63.74 106 61ZM30 92Q24.59 98.53 24 107Q36.16 103.83 46 96ZM74 96Q83.84 103.83 96 107Q95.41 98.53 90 92Z",
  strokeWidth: 6,
  eyes: [
    { cx: 43, cy: 61, r: 11.5 },
    { cx: 77, cy: 61, r: 11.5 },
  ],
  mouth: { cx: 60, cy: 84, rx: 7.5, ry: 5.5 },
};
const SMALL = {
  body: { x: 10, y: 34, width: 100, height: 68, rx: 34 },
  spines: "M22 50Q12.76 36.92 11 21Q28.24 24.9 42 36ZM78 36Q91.76 24.9 109 21Q107.24 36.92 98 50ZM48 36Q51.34 23.11 60 13Q68.66 23.11 72 36Z",
  strokeWidth: 7,
  eyes: [
    { cx: 41, cy: 66, r: 14 },
    { cx: 79, cy: 66, r: 14 },
  ],
  mouth: { cx: 60, cy: 90, rx: 8, ry: 6 },
};

/** The puffer face in cream, for the dark site. Same artwork as the app icon. */
export function PufferblowMark({ size = 64, className = "", tone = "cream" }: PufferblowMarkProps) {
  const maskId = `pb-face-${useId().replace(/:/g, "")}`;
  const shape = size < SMALL_BELOW_PX ? SMALL : FULL;
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
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
          <rect width="120" height="120" fill="#000" />
          <rect {...shape.body} fill="#fff" />
          <path d={shape.spines} fill="#fff" stroke="#fff" strokeWidth={shape.strokeWidth} strokeLinejoin="round" />
          {shape.eyes.map((eye) => (
            <circle key={eye.cx} {...eye} fill="#000" />
          ))}
          <ellipse {...shape.mouth} fill="#000" />
        </mask>
      </defs>
      <rect width="120" height="120" fill={tone === "current" ? "currentColor" : CREAM} mask={`url(#${maskId})`} />
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
