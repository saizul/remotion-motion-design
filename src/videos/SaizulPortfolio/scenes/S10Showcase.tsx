import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../anim";
import { PulseRing } from "../components/Fx";
import { Glass } from "../components/Glass";
import { Icon, type IconName } from "../components/Icons";
import { HoloPortrait } from "../components/Portrait";
import { Backdrop, Dust } from "../components/Space";
import { sa } from "../theme";
import { TypedList } from "./common";

const ORBIT: { icon: IconName; kind: "bars" | "line" | "nodes" | "site" | "rank" | "flow" }[] = [
  { icon: "browser", kind: "site" },
  { icon: "bot", kind: "nodes" },
  { icon: "chart", kind: "bars" },
  { icon: "workflow", kind: "flow" },
  { icon: "megaphone", kind: "line" },
  { icon: "search", kind: "rank" },
];

const Mini: React.FC<{ kind: (typeof ORBIT)[number]["kind"] }> = ({ kind }) => {
  const frame = useCurrentFrame();
  if (kind === "bars")
    return (
      <svg width={120} height={60}>
        {[0.4, 0.6, 0.5, 0.8, 1].map((b, i) => (
          <rect key={i} x={i * 24} y={60 - 55 * b * (0.8 + 0.2 * Math.sin(frame * 0.1 + i))} width={16} height={55 * b} rx={3} fill={i === 4 ? sa.colors.cyan : "rgba(47,128,255,0.7)"} />
        ))}
      </svg>
    );
  if (kind === "line")
    return (
      <svg width={120} height={60}>
        <polyline points="0,55 25,45 50,48 75,25 100,15 120,5" fill="none" stroke="#FFFFFF" strokeWidth={3} />
      </svg>
    );
  if (kind === "nodes")
    return (
      <svg width={120} height={60}>
        {[[20, 30], [60, 12], [60, 48], [100, 30]].map(([x, y], i, a) => (
          <g key={i}>
            {i > 0 ? <line x1={a[0][0]} y1={a[0][1]} x2={x} y2={y} stroke={sa.colors.cyan} /> : null}
            <circle cx={x} cy={y} r={7} fill={i === Math.floor(frame / 10) % 4 ? "#FFFFFF" : sa.colors.blue} />
          </g>
        ))}
      </svg>
    );
  if (kind === "rank")
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[1, 0.7, 0.5].map((w, i) => (
          <div key={i} style={{ width: 120 * w, height: 12, borderRadius: 6, background: i === 0 ? sa.colors.cyan : "rgba(255,255,255,0.25)" }} />
        ))}
      </div>
    );
  if (kind === "flow")
    return (
      <svg width={120} height={60}>
        <rect x={0} y={20} width={30} height={20} rx={4} fill="rgba(47,128,255,0.7)" />
        <rect x={45} y={20} width={30} height={20} rx={4} fill="rgba(47,128,255,0.7)" />
        <rect x={90} y={20} width={30} height={20} rx={4} fill={sa.colors.cyan} />
        <circle cx={30 + ((frame * 2) % 60)} cy={30} r={4} fill="#FFFFFF" />
      </svg>
    );
  return (
    <div style={{ width: 120, height: 60, borderRadius: 8, background: "linear-gradient(120deg, #0B2A66, #2F80FF 60%, #5CC8FF)" }} />
  );
};

// Everything built so far orbits around Saizul: websites, AI, dashboards, automation, marketing, SEO.
export const S10Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = tween(frame, [0, 26], [0, 1], EASE_IN_OUT);
  const energy = tween(frame, [20, 190], [0.3, 1]);
  const flash = tween(frame, [190, 206], [1, 0]);
  const panels = ORBIT.map((o, i) => {
    const a = frame * 0.012 + (i / ORBIT.length) * Math.PI * 2;
    const depth = Math.sin(a);
    const p = spring({ frame: frame - (30 + i * 15), fps, config: { damping: 15 } });
    return { ...o, i, x: 1150 + Math.cos(a) * 560, y: 600 + depth * 120, depth, p };
  });
  const renderPanel = (q: (typeof panels)[number]) => (
    <div
      key={q.i}
      style={{
        position: "absolute",
        left: q.x,
        top: q.y,
        opacity: q.p * (0.55 + 0.45 * ((q.depth + 1) / 2)),
        transform: `translate(-50%, -50%) scale(${(0.72 + 0.3 * ((q.depth + 1) / 2)) * q.p})`,
        filter: q.depth < 0 ? `blur(${-q.depth * 2.5}px)` : undefined,
      }}
    >
      <Glass width={240} height={150} radius={20} outline={q.p} glow={energy}>
        <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <Icon name={q.icon} size={34} />
          <Mini kind={q.kind} />
        </div>
      </Glass>
    </div>
  );
  return (
    <AbsoluteFill>
      <Backdrop focusX={60} tint="#0C2256" grid />
      <Dust seed="s10" count={120} opacity={0.6 + energy * 0.4} speed={1 + energy} />
      {panels.filter((q) => q.depth < 0).map(renderPanel)}
      <div style={{ position: "absolute", left: 1150 - 440, top: 110 }}>
        <div
          style={{
            position: "absolute",
            inset: 60,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(47,128,255,${0.35 * energy}), transparent 65%)`,
            filter: "blur(30px)",
          }}
        />
        <HoloPortrait src="saizul/cutout-casual.png" width={880} height={970} reveal={reveal} orbit={1.4} />
      </div>
      {panels.filter((q) => q.depth >= 0).map(renderPanel)}
      <div style={{ position: "absolute", left: 1150, top: 560 }}>
        <PulseRing progress={tween(frame, [190, 230], [0, 1])} size={2200} />
      </div>
      <AbsoluteFill style={{ background: `rgba(160,210,255,${0.35 * flash * (frame >= 190 ? 1 : 0)})` }} />
      <TypedList ids={["show0", "show1", "show2"]} x={100} y={130} size={68} gap={1.35} />
    </AbsoluteFill>
  );
};
