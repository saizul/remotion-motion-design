import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT, tween } from "../anim";
import { EnergyRings, FlowLine, PulseRing } from "../components/Fx";
import { Glass } from "../components/Glass";
import { IconBadge, type IconName } from "../components/Icons";
import { LogoPlate } from "../components/Logo";
import { Backdrop, Dust } from "../components/Space";
import { TypeText } from "../components/TypeText";
import { cue } from "../typing";

const CX = 960;
const CY = 520;
const ICONS: IconName[] = ["browser", "megaphone", "search", "workflow", "users", "chart", "settings"];
const FROM = [
  [-300, 100],
  [2200, -100],
  [-300, 900],
  [2200, 700],
  [960, -300],
  [300, 1300],
  [1700, 1300],
];

// Every discipline flies in, links to the logo and each other, then the whole ecosystem syncs.
export const S08Systems: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spin = tween(frame, [170, 240], [0, 0.35], EASE_OUT);
  const pos = (k: number) => {
    const a = -Math.PI / 2 + (k / ICONS.length) * Math.PI * 2 + spin;
    return { x: CX + Math.cos(a) * 640, y: CY + Math.sin(a) * 350 };
  };
  const sync = tween(frame, [170, 176], [0, 1]);
  return (
    <AbsoluteFill>
      <Backdrop tint="#0B1E48" grid />
      <Dust seed="s8" count={90} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {ICONS.map((_, k) => {
          const p = pos(k);
          const q = pos((k + 1) % ICONS.length);
          return (
            <g key={k}>
              <FlowLine x1={CX} y1={CY} x2={p.x} y2={p.y} draw={tween(frame, [90 + k * 10, 100 + k * 10], [0, 1])} phase={k * 0.2} />
              <FlowLine x1={p.x} y1={p.y} x2={q.x} y2={q.y} draw={tween(frame, [160, 175], [0, 1])} phase={k * 0.3} width={1.5} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: CX, top: CY }}>
        <EnergyRings size={520} intensity={0.6 + sync * 0.4} />
        <PulseRing progress={tween(frame, [170, 210], [0, 1])} size={1900} />
        <div style={{ position: "absolute", left: -200, top: -84 }}>
          <LogoPlate width={400} glow={1 + sync * 0.6} />
        </div>
      </div>
      {ICONS.map((icon, k) => {
        const arrive = 10 + k * 10;
        const t = spring({ frame: frame - arrive, fps, config: { damping: 18 } });
        const target = pos(k);
        const x = FROM[k][0] + (target.x - FROM[k][0]) * t;
        const y = FROM[k][1] + (target.y - FROM[k][1]) * t;
        return (
          <div key={icon} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity: Math.min(1, t * 1.5) }}>
            <Glass width={270} height={96} radius={24} outline={t} glow={0.6 + sync * 0.6}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, height: "100%", padding: "0 16px" }}>
                <IconBadge name={icon} size={60} progress={t} />
                <TypeText cue={cue(`sys${k}` as "sys0")} fontSize={30} weight={700} />
              </div>
            </Glass>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
