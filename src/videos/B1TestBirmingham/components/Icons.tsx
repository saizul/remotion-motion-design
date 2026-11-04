import { b1 } from "../theme";

export type IconName =
  | "unlock"
  | "coursework"
  | "tutor"
  | "clock"
  | "book"
  | "cap"
  | "heart"
  | "cross"
  | "phone"
  | "mail"
  | "pin"
  | "check"
  | "trend"
  | "star"
  | "headphones"
  | "mic"
  | "chat"
  | "calendar"
  | "globe"
  | "trophy"
  | "chart";

type Shape =
  | { t: "path"; d: string }
  | { t: "circle"; cx: number; cy: number; r: number }
  | { t: "rect"; x: number; y: number; w: number; h: number; rx: number };

const ICONS: Record<IconName, Shape[]> = {
  unlock: [
    { t: "rect", x: 4, y: 11, w: 16, h: 11, rx: 2 },
    { t: "path", d: "M8 11V7a4 4 0 0 1 7.9-1" },
    { t: "path", d: "M12 15v3" },
  ],
  coursework: [
    { t: "path", d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
    { t: "path", d: "M14 2v6h6" },
    { t: "path", d: "M8 13h8" },
    { t: "path", d: "M8 17h5" },
  ],
  tutor: [
    { t: "circle", cx: 9, cy: 8, r: 4 },
    { t: "path", d: "M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" },
    { t: "path", d: "M16 3h5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2l-2 2V9h-1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" },
  ],
  clock: [
    { t: "circle", cx: 12, cy: 12, r: 10 },
    { t: "path", d: "M12 6v6l4 2" },
  ],
  book: [
    { t: "path", d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" },
    { t: "path", d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
  ],
  cap: [
    { t: "path", d: "M22 10 12 5 2 10l10 5 10-5z" },
    { t: "path", d: "M6 12v5c3 3 9 3 12 0v-5" },
    { t: "path", d: "M22 10v6" },
  ],
  heart: [
    {
      t: "path",
      d: "M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z",
    },
  ],
  cross: [{ t: "path", d: "M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" }],
  phone: [
    {
      t: "path",
      d: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
    },
  ],
  mail: [
    { t: "rect", x: 2, y: 4, w: 20, h: 16, rx: 2 },
    { t: "path", d: "m22 7-10 6L2 7" },
  ],
  pin: [
    { t: "path", d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" },
    { t: "circle", cx: 12, cy: 10, r: 3 },
  ],
  check: [{ t: "path", d: "M20 6 9 17l-5-5" }],
  trend: [
    { t: "path", d: "M22 7 13.5 15.5l-5-5L2 17" },
    { t: "path", d: "M16 7h6v6" },
  ],
  star: [{ t: "path", d: "M12 2l3 7h7l-5.5 4.5 2 7.5L12 17l-6.5 4 2-7.5L2 9h7z" }],
  headphones: [
    { t: "path", d: "M3 18v-6a9 9 0 0 1 18 0v6" },
    { t: "path", d: "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" },
    { t: "path", d: "M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" },
  ],
  mic: [
    { t: "rect", x: 9, y: 2, w: 6, h: 12, rx: 3 },
    { t: "path", d: "M19 10v1a7 7 0 0 1-14 0v-1" },
    { t: "path", d: "M12 18v4" },
  ],
  chat: [
    { t: "path", d: "M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" },
    { t: "path", d: "M8 12h.01M12 12h.01M16 12h.01" },
  ],
  calendar: [
    { t: "rect", x: 3, y: 4, w: 18, h: 18, rx: 2 },
    { t: "path", d: "M16 2v4M8 2v4M3 10h18" },
    { t: "path", d: "M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" },
  ],
  globe: [
    { t: "circle", cx: 12, cy: 12, r: 10 },
    { t: "path", d: "M2 12h20" },
    { t: "path", d: "M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" },
  ],
  trophy: [
    { t: "path", d: "M6 9H4a2 2 0 0 1 0-4h2M18 9h2a2 2 0 0 0 0-4h-2" },
    { t: "path", d: "M6 3h12v7a6 6 0 0 1-12 0z" },
    { t: "path", d: "M12 16v3M8 22h8M9 19h6" },
  ],
  chart: [
    { t: "path", d: "M3 3v18h18" },
    { t: "path", d: "M8 17v-4M13 17V9M18 17V5" },
  ],
};

// Line icon that draws its strokes as `progress` goes 0 → 1.
export const Icon: React.FC<{
  name: IconName;
  size: number;
  progress?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ name, size, progress = 1, color = b1.colors.navy, strokeWidth = 2 }) => {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - progress,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: "visible" }}>
      {ICONS[name].map((s, i) =>
        s.t === "path" ? (
          <path key={i} d={s.d} {...common} />
        ) : s.t === "circle" ? (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} {...common} />
        ) : (
          <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} {...common} />
        ),
      )}
    </svg>
  );
};

// White disc with red ring holding a navy icon.
export const IconBadge: React.FC<{
  name: IconName;
  size: number;
  progress?: number;
  glow?: number;
  color?: string;
  ring?: string;
}> = ({ name, size, progress = 1, glow = 1, color = b1.colors.navy, ring = b1.colors.red }) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at 30% 25%, #FFFFFF, #EAF1FC 75%)",
      border: `${Math.max(2, size * 0.025)}px solid ${ring}`,
      boxShadow: `0 ${size * 0.12}px ${size * 0.3}px rgba(1,33,105,${0.12 + 0.12 * glow}), 0 0 ${24 * glow}px rgba(200,16,46,${0.25 * glow})`,
    }}
  >
    <Icon name={name} size={size * 0.5} progress={progress} color={color} />
  </div>
);
