import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, EASE_OUT, tween } from "../anim";
import { Cursor } from "../components/Fx";
import { Glass } from "../components/Glass";
import { Icon } from "../components/Icons";
import { Backdrop, Dust } from "../components/Space";
import { sa } from "../theme";
import { TypedList } from "./common";

const MORPH: [number, number] = [120, 150];

// A block that starts as a dashed wireframe and fills into a designed element.
const Block: React.FC<{ x: number; y: number; w: number; h: number; m: number; fill: string; r?: number }> = ({ x, y, w, h, m, fill, r = 10 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: r,
      border: `1.5px dashed rgba(201,209,220,${0.5 * (1 - m)})`,
      background: fill,
      opacity: 0.15 + 0.85 * m,
    }}
  />
);

// Website layout used by both desktop and mobile frames (m = wireframe → designed).
const Site: React.FC<{ w: number; m: number; mobile?: boolean }> = ({ w, m, mobile }) => {
  const pad = mobile ? 14 : 28;
  const inner = w - pad * 2;
  const heroH = mobile ? 150 : 210;
  return (
    <div style={{ position: "relative", width: w, height: "100%" }}>
      <Block x={pad} y={18} w={mobile ? 60 : 110} h={16} m={m} fill={sa.colors.white} r={4} />
      {!mobile ? [0, 1, 2].map((i) => <Block key={i} x={w - pad - 70 * (i + 1)} y={20} w={50} h={10} m={m} fill={sa.colors.muted} r={3} />) : null}
      <Block x={pad} y={52} w={inner} h={heroH} m={m} fill="linear-gradient(120deg, #0B2A66, #2F80FF 60%, #5CC8FF)" r={14} />
      <Block x={pad + 24} y={52 + heroH * 0.3} w={inner * 0.5} h={mobile ? 14 : 22} m={m} fill="#FFFFFF" r={4} />
      <Block x={pad + 24} y={52 + heroH * 0.3 + (mobile ? 24 : 36)} w={inner * 0.35} h={mobile ? 10 : 14} m={m} fill="rgba(255,255,255,0.7)" r={4} />
      <Block x={pad + 24} y={52 + heroH * 0.68} w={mobile ? 80 : 130} h={mobile ? 22 : 34} m={m} fill={sa.colors.red} r={20} />
      {(mobile ? [0, 1] : [0, 1, 2]).map((i) => {
        const cw = mobile ? inner : (inner - 40) / 3;
        return (
          <Block
            key={i}
            x={mobile ? pad : pad + i * (cw + 20)}
            y={52 + heroH + 24 + (mobile ? i * 96 : 0)}
            w={cw}
            h={mobile ? 80 : 150}
            m={m}
            fill="linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))"
            r={12}
          />
        );
      })}
    </div>
  );
};

const Window: React.FC<{ w: number; h: number; children: React.ReactNode; loading?: number }> = ({ w, h, children, loading = 0 }) => (
  <Glass width={w} height={h} radius={18} outline={1} glow={0.8}>
    <div style={{ height: 40, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />
      ))}
      <div style={{ marginLeft: 18, flex: 1, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.08)" }} />
    </div>
    <div style={{ position: "absolute", top: 40, left: 0, height: 3, width: `${loading * 100}%`, background: sa.colors.cyan, boxShadow: `0 0 12px ${sa.colors.cyan}`, opacity: loading < 1 ? 1 : 0 }} />
    <div style={{ position: "absolute", top: 40, left: 0, right: 0, bottom: 0 }}>{children}</div>
  </Glass>
);

// Web lab: windows fly in, wireframes turn into a finished responsive site, a speed gauge climbs.
export const S04Web: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (d: number) => spring({ frame: frame - d, fps, config: { damping: 16 } });
  const m = tween(frame, MORPH, [0, 1], EASE_IN_OUT);
  const score = Math.round(tween(frame, [180, 240], [12, 98], EASE_OUT));
  const gaugeP = tween(frame, [180, 240], [0.12, 0.98], EASE_OUT);
  const arc = 2 * Math.PI * 70 * 0.75;
  return (
    <AbsoluteFill>
      <Backdrop grid focusX={62} tint="#0B1C44" />
      <Dust seed="s4" count={70} opacity={0.8} />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: 700, top: 150, opacity: pop(0), transform: `translateY(${(1 - pop(0)) * 200}px) rotateY(${-10 + Math.sin(frame * 0.015) * 3}deg)` }}>
          <Window w={880} h={560} loading={tween(frame, [90, 120], [0, 1])}>
            <Site w={880} m={m} />
          </Window>
        </div>
        <div style={{ position: "absolute", left: 1520, top: 330, opacity: pop(12), transform: `translateX(${(1 - pop(12)) * 300}px) rotateY(${-18 + Math.sin(frame * 0.02) * 3}deg)` }}>
          <Glass width={250} height={500} radius={36} outline={1} glow={0.8}>
            <div style={{ position: "absolute", top: 14, left: "50%", marginLeft: -30, width: 60, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.25)" }} />
            <div style={{ position: "absolute", inset: "30px 0 0 0" }}>
              <Site w={250} m={tween(frame, [150, 175], [0, 1], EASE_IN_OUT)} mobile />
            </div>
          </Glass>
        </div>
        <div style={{ position: "absolute", left: 560, top: 740, opacity: pop(24), transform: `translateY(${(1 - pop(24)) * 200}px) rotateY(8deg)` }}>
          <Glass width={330} height={210} radius={20} outline={1}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, height: "100%", padding: "0 22px" }}>
              <svg width={170} height={170} viewBox="-85 -85 170 170">
                <circle r={70} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={12} strokeDasharray={`${arc} 999`} transform="rotate(135)" strokeLinecap="round" />
                <circle
                  r={70}
                  fill="none"
                  stroke={score > 89 ? "#34D399" : sa.colors.cyan}
                  strokeWidth={12}
                  strokeDasharray={`${arc * gaugeP} 999`}
                  transform="rotate(135)"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 8px rgba(52,211,153,0.8))" }}
                />
                <text textAnchor="middle" dy={16} fill="#FFFFFF" fontSize={46} fontWeight={800} fontFamily={sa.fonts.display}>
                  {score}
                </text>
              </svg>
              <Icon name="gauge" size={56} progress={tween(frame, [30, 50], [0, 1])} />
            </div>
          </Glass>
        </div>
      </AbsoluteFill>
      <Cursor
        path={[
          { f: 40, x: 1500, y: 900 },
          { f: 78, x: 1300, y: 330 },
          { f: 140, x: 1300, y: 330 },
          { f: 158, x: 1640, y: 600 },
          { f: 205, x: 1640, y: 600 },
          { f: 228, x: 720, y: 840 },
        ]}
        clicks={[80, 160, 230]}
      />
      <TypedList ids={["web0", "web1", "web2", "web3", "web4"]} x={90} y={200} size={40} gap={1.7} />
    </AbsoluteFill>
  );
};
