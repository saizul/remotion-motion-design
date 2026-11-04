import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../anim";
import { LogoPlate } from "../components/Logo";
import { Backdrop, Dust } from "../components/Space";
import { sa } from "../theme";
import worldDots from "../worldDots.json";
import { TypedList } from "./common";

const MAP_W = 1560;
const MAP_H = (MAP_W * 140) / 360;
const px = (lon: number) => ((lon + 180) / 360) * MAP_W;
const py = (lat: number) => ((80 - lat) / 140) * MAP_H;

// Unlabelled collaboration hubs: [lat, lon]
const HUBS: [number, number][] = [
  [52.5, -1.9],
  [23.8, 90.4],
  [40.7, -74],
  [25.2, 55.3],
  [43.7, -79.4],
  [1.35, 103.8],
  [-33.9, 151.2],
];
const HUB_AT = HUBS.map((_, i) => 40 + i * 12);
const ARCS: [number, number][] = [
  [0, 2],
  [0, 3],
  [1, 3],
  [1, 5],
  [0, 4],
  [5, 6],
  [1, 0],
];

// Dotted world map lights up, hubs activate, arcs of data connect them, logo hubs float above.
export const S09Global: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweep = tween(frame, [0, 44], [0, MAP_W + 60], EASE_IN_OUT);
  return (
    <AbsoluteFill>
      <Backdrop tint="#0A1C46" focusY={42} />
      <Dust seed="s9" count={70} opacity={0.7} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", left: (1920 - MAP_W) / 2, top: 150, transform: `rotateX(${22 - frame * 0.02}deg)`, transformOrigin: "50% 60%" }}>
          <svg width={MAP_W} height={MAP_H} style={{ overflow: "visible" }}>
            {worldDots.dots.map(([lon, lat], i) => {
              const x = px(lon);
              return <circle key={i} cx={x} cy={py(lat)} r={3.4} fill={sa.colors.blue} opacity={x < sweep ? 0.55 : 0} />;
            })}
            {ARCS.map(([a, b], k) => {
              const A = HUBS[a];
              const B = HUBS[b];
              const x1 = px(A[1]);
              const y1 = py(A[0]);
              const x2 = px(B[1]);
              const y2 = py(B[0]);
              const cx = (x1 + x2) / 2;
              const cy = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.28 - 30;
              const draw = tween(frame, [52 + k * 14, 80 + k * 14], [0, 1]);
              const t = (frame * 0.02 + k * 0.23) % 1;
              const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
              const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
              return (
                <g key={k}>
                  <path
                    d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}
                    fill="none"
                    stroke={sa.colors.cyan}
                    strokeWidth={2.2}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - draw}
                    style={{ filter: `drop-shadow(0 0 6px ${sa.colors.cyan})` }}
                  />
                  {draw >= 1 ? <circle cx={bx} cy={by} r={5} fill="#FFFFFF" style={{ filter: `drop-shadow(0 0 8px ${sa.colors.cyan})` }} /> : null}
                </g>
              );
            })}
            {HUBS.map(([lat, lon], i) => {
              const p = spring({ frame: frame - HUB_AT[i], fps, config: { damping: 12 } });
              const ring = ((frame - HUB_AT[i]) % 40) / 40;
              return (
                <g key={i} transform={`translate(${px(lon)} ${py(lat)})`} opacity={p}>
                  <circle r={8 + ring * 30} fill="none" stroke={sa.colors.cyan} opacity={frame > HUB_AT[i] ? 1 - ring : 0} />
                  <circle r={9 * p} fill="#FFFFFF" style={{ filter: `drop-shadow(0 0 10px ${sa.colors.cyan})` }} />
                </g>
              );
            })}
          </svg>
          {[0, 1, 2].map((i) => {
            const [lat, lon] = HUBS[i];
            const p = spring({ frame: frame - 150 - i * 6, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{ position: "absolute", left: px(lon) - 80, top: py(lat) - 150 + Math.sin(frame * 0.05 + i) * 6, opacity: p, transform: `scale(${p})` }}>
                <LogoPlate width={160} energy={0.6} glow={0.8} />
                <div style={{ position: "absolute", left: 79, top: 70, width: 2, height: 70, background: `linear-gradient(${sa.colors.cyan}, transparent)` }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <TypedList ids={["glb0", "glb1", "glb2"]} x={100} y={820} size={40} gap={1.4} />
    </AbsoluteFill>
  );
};
