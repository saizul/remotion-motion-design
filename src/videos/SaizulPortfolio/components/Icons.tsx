import { sa } from "../theme";

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
  | "chart"
  | "user"
  | "crown"
  | "layers"
  | "bot"
  | "code"
  | "search"
  | "megaphone"
  | "funnel"
  | "target"
  | "workflow"
  | "database"
  | "cloud"
  | "cpu"
  | "users"
  | "headset"
  | "bolt"
  | "link"
  | "gauge"
  | "pen"
  | "settings"
  | "browser"
  | "mobile"
  | "rocket";

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
  user: [{ t: "circle", cx: 12, cy: 8, r: 4 }, { t: "path", d: "M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" }],
  crown: [{ t: "path", d: "M2 18h20" }, { t: "path", d: "M3 18 2 7l6 4 4-7 4 7 6-4-1 11" }],
  layers: [{ t: "path", d: "M12 2 2 7l10 5 10-5-10-5z" }, { t: "path", d: "M2 17l10 5 10-5" }, { t: "path", d: "M2 12l10 5 10-5" }],
  bot: [
    { t: "rect", x: 4, y: 8, w: 16, h: 12, rx: 2 },
    { t: "path", d: "M12 4v4" },
    { t: "circle", cx: 12, cy: 3, r: 1 },
    { t: "path", d: "M9 13h.01M15 13h.01M9 17h6" },
  ],
  code: [{ t: "path", d: "m16 18 6-6-6-6" }, { t: "path", d: "m8 6-6 6 6 6" }],
  search: [{ t: "circle", cx: 11, cy: 11, r: 8 }, { t: "path", d: "m21 21-4.3-4.3" }],
  megaphone: [
    { t: "path", d: "M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z" },
    { t: "path", d: "M16 8a5 5 0 0 1 0 8" },
    { t: "path", d: "M19 5a9 9 0 0 1 0 14" },
  ],
  funnel: [{ t: "path", d: "M3 4h18l-7 8v6l-4 2v-8z" }],
  target: [{ t: "circle", cx: 12, cy: 12, r: 10 }, { t: "circle", cx: 12, cy: 12, r: 6 }, { t: "circle", cx: 12, cy: 12, r: 2 }],
  workflow: [
    { t: "rect", x: 3, y: 3, w: 7, h: 7, rx: 1 },
    { t: "rect", x: 14, y: 14, w: 7, h: 7, rx: 1 },
    { t: "path", d: "M10 6.5h4a3 3 0 0 1 3 3V14" },
  ],
  database: [
    { t: "path", d: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z" },
    { t: "path", d: "M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" },
    { t: "path", d: "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" },
  ],
  cloud: [{ t: "path", d: "M17.5 19H7a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 11a4 4 0 0 1-2 8z" }],
  cpu: [{ t: "rect", x: 6, y: 6, w: 12, h: 12, rx: 2 }, { t: "path", d: "M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" }],
  users: [
    { t: "circle", cx: 9, cy: 8, r: 4 },
    { t: "path", d: "M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" },
    { t: "path", d: "M16 3.1a4 4 0 0 1 0 7.8" },
    { t: "path", d: "M22 21v-1a5 5 0 0 0-3.5-4.8" },
  ],
  headset: [
    { t: "path", d: "M3 14v-2a9 9 0 0 1 18 0v2" },
    { t: "path", d: "M21 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2z" },
    { t: "path", d: "M3 15a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z" },
    { t: "path", d: "M19 17v1a3 3 0 0 1-3 3h-3" },
  ],
  bolt: [{ t: "path", d: "M13 2 3 14h9l-1 8 10-12h-9l1-8z" }],
  link: [
    { t: "path", d: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" },
    { t: "path", d: "M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" },
  ],
  gauge: [{ t: "path", d: "M12 14l4-4" }, { t: "path", d: "M3.3 19a10 10 0 1 1 17.4 0" }],
  pen: [{ t: "path", d: "M12 20h9" }, { t: "path", d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" }],
  settings: [
    { t: "circle", cx: 12, cy: 12, r: 3 },
    { t: "path", d: "M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" },
  ],
  browser: [{ t: "rect", x: 2, y: 4, w: 20, h: 16, rx: 2 }, { t: "path", d: "M2 9h20" }, { t: "path", d: "M6 6.5h.01M9 6.5h.01" }],
  mobile: [{ t: "rect", x: 7, y: 2, w: 10, h: 20, rx: 2 }, { t: "path", d: "M11 18h2" }],
  rocket: [
    { t: "path", d: "M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2" },
    { t: "path", d: "M9 12a13 13 0 0 1 11-9 13 13 0 0 1-9 11z" },
    { t: "path", d: "M9 12l3 3" },
  ],
};

// Line icon that draws its strokes as `progress` goes 0 → 1.
export const Icon: React.FC<{
  name: IconName;
  size: number;
  progress?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ name, size, progress = 1, color = sa.colors.cyan, strokeWidth = 1.8 }) => {
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

// Dark glass disc with a glowing cyan ring holding an icon.
export const IconBadge: React.FC<{ name: IconName; size: number; progress?: number; glow?: number }> = ({
  name,
  size,
  progress = 1,
  glow = 1,
}) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at 30% 25%, rgba(47,128,255,0.45), rgba(8,16,33,0.9) 70%)",
      border: `1.5px solid rgba(92,200,255,${0.35 + 0.5 * glow})`,
      boxShadow: `0 0 ${26 * glow}px rgba(92,200,255,${0.35 * glow}), inset 0 1px 0 rgba(255,255,255,0.2)`,
    }}
  >
    <Icon name={name} size={size * 0.5} progress={progress} />
  </div>
);
