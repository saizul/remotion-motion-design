import { useCurrentFrame } from "remotion";
import { sa } from "../theme";

// Rotating dashed energy rings around a point.
export const EnergyRings: React.FC<{ size: number; intensity?: number; speed?: number }> = ({ size, intensity = 1, speed = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ overflow: "visible", position: "absolute", left: -size / 2, top: -size / 2 }}>
      {[
        { r: 70, sw: 1.2, dash: "2 6", sp: 0.4, o: 0.9 },
        { r: 82, sw: 0.8, dash: "30 12 4 12", sp: -0.25, o: 0.7 },
        { r: 95, sw: 2, dash: "60 140", sp: 0.7, o: 0.8 },
      ].map((c, i) => (
        <circle
          key={i}
          r={c.r}
          fill="none"
          stroke={i === 2 ? sa.colors.blue : sa.colors.cyan}
          strokeWidth={c.sw}
          strokeDasharray={c.dash}
          transform={`rotate(${frame * c.sp * speed * 2})`}
          opacity={c.o * intensity}
          style={{ filter: `drop-shadow(0 0 4px ${sa.colors.cyan})` }}
        />
      ))}
    </svg>
  );
};

// Expanding shock ring (progress 0 → 1).
export const PulseRing: React.FC<{ progress: number; size: number; color?: string }> = ({ progress, size, color = sa.colors.cyan }) => {
  if (progress <= 0 || progress >= 1) return null;
  const s = size * (0.2 + progress);
  return (
    <div
      style={{
        position: "absolute",
        left: -s / 2,
        top: -s / 2,
        width: s,
        height: s,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        boxShadow: `0 0 30px ${color}, inset 0 0 30px ${color}`,
        opacity: 1 - progress,
      }}
    />
  );
};

// A line from a → b that draws in, with a light pulse travelling along it.
export const FlowLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  draw: number;
  pulseSpeed?: number;
  phase?: number;
  color?: string;
  width?: number;
}> = ({ x1, y1, x2, y2, draw, pulseSpeed = 0.025, phase = 0, color = sa.colors.cyan, width = 2 }) => {
  const frame = useCurrentFrame();
  if (draw <= 0) return null;
  const ex = x1 + (x2 - x1) * draw;
  const ey = y1 + (y2 - y1) * draw;
  const t = (frame * pulseSpeed + phase) % 1;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeOpacity={0.45} strokeWidth={width} />
      {draw >= 1 ? (
        <circle cx={x1 + (x2 - x1) * t} cy={y1 + (y2 - y1) * t} r={width * 2.4} fill="#FFFFFF" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      ) : null}
    </g>
  );
};

// Mouse pointer that glides between points and ripples on click frames.
export const Cursor: React.FC<{ path: { f: number; x: number; y: number }[]; clicks: number[] }> = ({ path, clicks }) => {
  const frame = useCurrentFrame();
  let x = path[0].x;
  let y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = (frame - a.f) / Math.max(1, b.f - a.f);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      x = a.x + (b.x - a.x) * e;
      y = a.y + (b.y - a.y) * e;
    } else if (frame > b.f) {
      x = b.x;
      y = b.y;
    }
  }
  const click = clicks.map((c) => frame - c).find((d) => d >= 0 && d < 14);
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      {click !== undefined ? (
        <div
          style={{
            position: "absolute",
            left: -30 - click * 2,
            top: -30 - click * 2,
            width: 60 + click * 4,
            height: 60 + click * 4,
            borderRadius: "50%",
            border: `2px solid ${sa.colors.cyan}`,
            opacity: 1 - click / 14,
          }}
        />
      ) : null}
      <svg width={34} height={34} viewBox="0 0 24 24" style={{ transform: `scale(${click !== undefined && click < 4 ? 0.85 : 1})`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))" }}>
        <path d="M4 2l16 9-7 2-3 7z" fill="#FFFFFF" stroke="#0B1426" strokeWidth={1.2} />
      </svg>
    </div>
  );
};
