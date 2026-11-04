import { um } from "../theme";

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
  | "star";

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
};

// Line icon that draws its strokes as `progress` goes 0 → 1.
export const Icon: React.FC<{
  name: IconName;
  size: number;
  progress?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ name, size, progress = 1, color = um.colors.goldLight, strokeWidth = 1.8 }) => {
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

// Gold-ringed glass disc holding an icon.
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
      background: "radial-gradient(circle at 30% 25%, rgba(61,123,255,0.55), rgba(7,20,51,0.9) 70%)",
      border: `2px solid rgba(235,211,148,${0.35 + 0.55 * glow})`,
      boxShadow: `0 0 ${30 * glow}px rgba(235,211,148,${0.35 * glow}), inset 0 1px 0 rgba(255,255,255,0.3)`,
    }}
  >
    <Icon name={name} size={size * 0.48} progress={progress} />
  </div>
);
