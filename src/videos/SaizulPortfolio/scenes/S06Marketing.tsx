import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT, tween } from "../anim";
import { PulseRing } from "../components/Fx";
import { Glass } from "../components/Glass";
import { Icon } from "../components/Icons";
import { Backdrop, Dust } from "../components/Space";
import { sa } from "../theme";
import { TypedList } from "./common";

const PANEL_W = 520;
const PANEL_H = 380;
const TOASTS = [80, 115, 150, 185];

// Lead funnel with particles flowing through the stages.
const Funnel: React.FC = () => {
  const frame = useCurrentFrame();
  const stages = [1, 0.78, 0.56, 0.36];
  return (
    <svg width={PANEL_W} height={PANEL_H}>
      {stages.map((w, i) => (
        <rect key={i} x={(PANEL_W - 420 * w) / 2} y={40 + i * 78} width={420 * w} height={62} rx={12} fill={`rgba(47,128,255,${0.18 + i * 0.12})`} stroke={sa.colors.cyan} strokeOpacity={0.5} />
      ))}
      {new Array(26).fill(0).map((_, i) => {
        const t = ((frame * 0.012 + random(`f${i}`)) % 1);
        const lane = (random(`fl${i}`) - 0.5) * 380 * (1 - t * 0.7);
        return <circle key={i} cx={PANEL_W / 2 + lane} cy={40 + t * 300} r={4} fill="#FFFFFF" opacity={t < 0.95 ? 0.9 : 0} style={{ filter: "drop-shadow(0 0 5px #5CC8FF)" }} />;
      })}
    </svg>
  );
};

// Audience radar sweep lighting up target dots.
const Radar: React.FC = () => {
  const frame = useCurrentFrame();
  const a = (frame * 3) % 360;
  return (
    <svg width={PANEL_W} height={PANEL_H} viewBox={`${-PANEL_W / 2} ${-PANEL_H / 2} ${PANEL_W} ${PANEL_H}`}>
      {[60, 110, 160].map((r) => (
        <circle key={r} r={r} fill="none" stroke={sa.colors.cyan} strokeOpacity={0.25} />
      ))}
      <path d={`M0 0 L${160 * Math.cos(((a - 30) * Math.PI) / 180)} ${160 * Math.sin(((a - 30) * Math.PI) / 180)} A160 160 0 0 1 ${160 * Math.cos((a * Math.PI) / 180)} ${160 * Math.sin((a * Math.PI) / 180)} Z`} fill="rgba(92,200,255,0.25)" />
      {new Array(14).fill(0).map((_, i) => {
        const da = random(`ra${i}`) * 360;
        const dr = 30 + random(`rr${i}`) * 125;
        const since = ((a - da + 360) % 360) / 360;
        return <circle key={i} cx={dr * Math.cos((da * Math.PI) / 180)} cy={dr * Math.sin((da * Math.PI) / 180)} r={6} fill={i % 4 === 0 ? sa.colors.red : "#FFFFFF"} opacity={Math.max(0.15, 1 - since * 2)} />;
      })}
    </svg>
  );
};

// Marketing command centre: funnel, radar, launch button with lead notifications, conversion growth.
export const S06Marketing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (d: number) => spring({ frame: frame - d, fps, config: { damping: 16 } });
  const conv = tween(frame, [120, 190], [0, 1], EASE_OUT);
  const pts = [0.2, 0.26, 0.24, 0.38, 0.46, 0.58, 0.72, 0.9];
  const panel = (i: number, children: React.ReactNode) => (
    <div
      style={{
        position: "absolute",
        left: 780 + (i % 2) * (PANEL_W + 40),
        top: 110 + Math.floor(i / 2) * (PANEL_H + 40),
        opacity: pop(i * 10),
        transform: `perspective(1600px) translateZ(${(1 - pop(i * 10)) * -400}px) rotateY(${(i % 2 ? -1 : 1) * 4}deg)`,
      }}
    >
      <Glass width={PANEL_W} height={PANEL_H} radius={22} outline={tween(frame, [i * 10, i * 10 + 30], [0, 1])}>
        {children}
      </Glass>
    </div>
  );
  return (
    <AbsoluteFill>
      <Backdrop focusX={65} tint="#0B1C46" grid />
      <Dust seed="s6" count={60} opacity={0.7} />
      {panel(0, <Funnel />)}
      {panel(1, <Radar />)}
      {panel(
        2,
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div style={{ position: "absolute", left: 60, top: PANEL_H / 2 - 70 }}>
            <div style={{ position: "absolute", left: 70, top: 70 }}>
              <PulseRing progress={tween(frame, [42, 70], [0, 1])} size={320} />
            </div>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                background: "radial-gradient(circle at 35% 30%, #5CC8FF, #2F80FF 60%, #0B2A66)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(92,200,255,0.7)",
                transform: `scale(${frame >= 40 && frame < 46 ? 0.9 : 1})`,
              }}
            >
              <Icon name="rocket" size={64} color="#FFFFFF" strokeWidth={2} />
            </div>
          </div>
          {TOASTS.map((t, k) => {
            const p = spring({ frame: frame - t, fps, config: { damping: 14 } });
            return (
              <div key={t} style={{ position: "absolute", right: 24, top: 24 + k * 84, opacity: p, transform: `translateX(${(1 - p) * 120}px)` }}>
                <Glass width={250} height={70} radius={16} outline={0} sheen={false}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, height: "100%", padding: "0 14px" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 21, background: "rgba(52,211,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="user" size={24} color="#7BE3A8" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 10, width: "80%", borderRadius: 5, background: "rgba(255,255,255,0.7)" }} />
                      <div style={{ marginTop: 8, height: 7, width: "50%", borderRadius: 4, background: "rgba(92,200,255,0.6)" }} />
                    </div>
                    <Icon name="check" size={26} color="#7BE3A8" strokeWidth={2.5} />
                  </div>
                </Glass>
              </div>
            );
          })}
        </div>,
      )}
      {panel(
        3,
        <svg width={PANEL_W} height={PANEL_H}>
          <defs>
            <linearGradient id="convFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5CC8FF" stopOpacity="0.5" />
              <stop offset="1" stopColor="#5CC8FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1={30} x2={PANEL_W - 30} y1={70 + g * 75} y2={70 + g * 75} stroke="rgba(255,255,255,0.07)" />
          ))}
          <path
            d={`M30 ${PANEL_H - 40} ${pts.map((p, i) => `L${30 + i * 65} ${PANEL_H - 40 - 260 * p * conv}`).join(" ")} L${30 + 7 * 65} ${PANEL_H - 40} Z`}
            fill="url(#convFill)"
          />
          <polyline points={pts.map((p, i) => `${30 + i * 65},${PANEL_H - 40 - 260 * p * conv}`).join(" ")} fill="none" stroke="#FFFFFF" strokeWidth={4} style={{ filter: "drop-shadow(0 0 8px #5CC8FF)" }} />
          <circle cx={30 + 7 * 65} cy={PANEL_H - 40 - 260 * 0.9 * conv} r={9} fill={sa.colors.cyan} opacity={conv} />
        </svg>,
      )}
      <TypedList ids={["mkt0", "mkt1", "mkt2", "mkt3"]} x={90} y={300} size={42} gap={1.8} />
    </AbsoluteFill>
  );
};
