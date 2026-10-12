/** The brand's gold puffer, drawn the way the app draws it at rail size. */
export default function GoldPuffer({ size }: { size: number }) {
  const body = "#e3ae4f";
  const eye = "#0d0b09";
  const spine = "M43.2 31 Q43.8 22 46 14.5 Q50.6 22 52.8 31Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M27 45 C19 39 13 33.5 6.5 32.5 C8.5 40 10 46.5 13.5 52 C10 57.5 8.5 64 6.5 71.5 C13 70.5 19 65 27 59Z" fill={body} />
      {[0, 31, 62, 118, 149, 180, 211, 329].map((a) => (
        <path key={a} d={spine} transform={`rotate(${a} 48 52)`} fill={body} />
      ))}
      <circle cx="48" cy="52" r="25" fill={body} />
      <circle cx="73.5" cy="55" r="4.6" fill={body} />
      <circle cx="59" cy="45" r="6.2" fill={eye} />
      <circle cx="61.2" cy="42.8" r="1.9" fill={body} />
      <circle cx="74.6" cy="55" r="2.1" fill={eye} />
      <circle cx="84.5" cy="48.5" r="3.4" stroke={body} strokeWidth="2.2" fill="none" />
      <circle cx="92" cy="39.5" r="2.3" fill={body} />
    </svg>
  );
}
