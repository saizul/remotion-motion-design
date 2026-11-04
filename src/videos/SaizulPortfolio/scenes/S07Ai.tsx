import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT, tween } from "../anim";
import { EnergyRings, FlowLine, PulseRing } from "../components/Fx";
import { Glass } from "../components/Glass";
import { IconBadge, type IconName } from "../components/Icons";
import { LogoPlate } from "../components/Logo";
import { Backdrop, Dust } from "../components/Space";
import { TypeText } from "../components/TypeText";
import { sa } from "../theme";
import { cue } from "../typing";

const CX = 1180;
const CY = 500;
const NODE_ICONS: IconName[] = ["bot", "workflow", "headset", "settings", "database", "users", "target", "headset", "pen", "coursework", "cpu"];
const nodePos = (k: number) => {
  const a = -Math.PI / 2 + (k / NODE_ICONS.length) * Math.PI * 2;
  return { x: CX + Math.cos(a) * 590, y: CY + Math.sin(a) * 350 };
};
const nodeAt = (k: number) => cue(`aiNode${k}` as "aiNode0").start - 4;

// Logo becomes a holographic AI core; eleven capability nodes activate and wire into a neural web.
export const S07Ai: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const power = tween(frame, [0, 40], [0, 1], EASE_OUT);
  const web = tween(frame, [300, 340], [0, 1]);
  const beat = [330, 360, 390].map((b) => tween(frame, [b, b + 30], [0, 1]));
  return (
    <AbsoluteFill>
      <Backdrop focusX={61} focusY={46} tint="#0B2150" />
      <Dust seed="s7" count={160} mode="forward" speed={0.5} opacity={0.8} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {NODE_ICONS.map((_, k) => {
          const n = nodePos(k);
          return <FlowLine key={`c${k}`} x1={CX} y1={CY} x2={n.x} y2={n.y} draw={tween(frame, [nodeAt(k) - 8, nodeAt(k) + 4], [0, 1])} phase={k * 0.19} />;
        })}
        {NODE_ICONS.map((_, k) => {
          const a = nodePos(k);
          const b = nodePos((k + 1) % NODE_ICONS.length);
          const c = nodePos((k + 3) % NODE_ICONS.length);
          return (
            <g key={`w${k}`}>
              <FlowLine x1={a.x} y1={a.y} x2={b.x} y2={b.y} draw={web} phase={k * 0.31} color={sa.colors.blue} width={1.5} pulseSpeed={0.018} />
              <FlowLine x1={a.x} y1={a.y} x2={c.x} y2={c.y} draw={web} phase={k * 0.13} color={sa.colors.blue} width={1} pulseSpeed={0.012} />
            </g>
          );
        })}
      </svg>
      {/* AI core */}
      <div style={{ position: "absolute", left: CX, top: CY }}>
        <div
          style={{
            position: "absolute",
            left: -260,
            top: -260,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(92,200,255,${0.45 * power + 0.15 * Math.sin(frame * 0.15)}) 0%, rgba(47,128,255,0.15) 45%, transparent 70%)`,
          }}
        />
        <EnergyRings size={560 * (0.6 + 0.4 * power)} intensity={power} speed={1.4} />
        {beat.map((b, i) => (
          <PulseRing key={i} progress={b} size={1400} />
        ))}
        <PulseRing progress={tween(frame, [30, 60], [0, 1])} size={900} color="#FFFFFF" />
        <div style={{ position: "absolute", left: -170, top: -70, transform: `scale(${0.6 + 0.4 * power})`, filter: `brightness(${1 + 0.3 * Math.max(0, Math.sin(frame * 0.15))})` }}>
          <LogoPlate width={340} energy={power} glow={1.4} />
        </div>
      </div>
      {NODE_ICONS.map((icon, k) => {
        const n = nodePos(k);
        const p = spring({ frame: frame - nodeAt(k), fps, config: { damping: 13 } });
        const c = cue(`aiNode${k}` as "aiNode0");
        return (
          <div key={k} style={{ position: "absolute", left: n.x, top: n.y, opacity: p, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * p})` }}>
            <Glass width={290} height={64} radius={32} outline={p} glow={p}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, height: "100%", padding: "0 10px" }}>
                <IconBadge name={icon} size={46} progress={p} />
                <TypeText cue={c} fontSize={22} weight={600} letterSpacing={0} />
              </div>
            </Glass>
          </div>
        );
      })}
      {/* Terminal log */}
      <div style={{ position: "absolute", left: 50, top: 730, opacity: tween(frame, [44, 58], [0, 1]) }}>
        <Glass width={470} height={300} radius={16} outline={tween(frame, [44, 80], [0, 1])}>
          <div style={{ height: 34, display: "flex", alignItems: "center", gap: 7, padding: "0 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => (
              <div key={col} style={{ width: 10, height: 10, borderRadius: 5, background: col }} />
            ))}
          </div>
          <div style={{ padding: "14px 20px" }}>
            {(["ai0", "ai1", "ai2", "ai3", "ai4"] as const).map((id) => {
              const c = cue(id);
              return (
                <div key={id} style={{ display: "flex", gap: 12, height: 48, alignItems: "center", opacity: frame >= c.start - 2 ? 1 : 0 }}>
                  <span style={{ fontFamily: sa.fonts.mono, fontSize: 28, color: "#34D399" }}>&gt;</span>
                  <TypeText cue={c} fontSize={28} weight={500} font={sa.fonts.mono} letterSpacing={0} caretColor="#34D399" />
                </div>
              );
            })}
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};
