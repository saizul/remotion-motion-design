import { getLength, getPointAtLength } from "@remotion/paths";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN, EASE_IN_OUT, tween } from "../anim";
import { IconBadge, type IconName } from "../components/Icons";
import { ParticleField } from "../components/ParticleField";
import { um } from "../theme";

const WORLD_H = 2700;
const NODES: { x: number; y: number; icon: IconName; label: string; side: 1 | -1 }[] = [
  { x: 280, y: 2280, icon: "book", label: "Learn", side: 1 },
  { x: 800, y: 1700, icon: "star", label: "Develop\nSkills", side: -1 },
  { x: 280, y: 1120, icon: "cap", label: "Gain\nQualification", side: 1 },
  { x: 800, y: 540, icon: "trend", label: "Progress\nYour Career", side: -1 },
];

// Path segments: bottom edge → node 0 → node 1 → node 2 → node 3.
const SEGMENTS = [
  `M540 ${WORLD_H} C 540 2500, 280 2480, 280 2280`,
  "M280 2280 C 280 1990, 800 1990, 800 1700",
  "M800 1700 C 800 1410, 280 1410, 280 1120",
  "M280 1120 C 280 830, 800 830, 800 540",
];
const PATH = SEGMENTS.map((s, i) => (i === 0 ? s : s.replace(/^M[\d. ]+/, " "))).join("");
const TOTAL = getLength(PATH);
const NODE_AT = SEGMENTS.map((_, i) =>
  SEGMENTS.slice(0, i + 1).reduce((sum, s) => sum + getLength(s), 0) / TOTAL,
);
const ARRIVE = [16, 40, 64, 88];

export const S6Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = um.scenes.journey + um.overlap;
  const progress = tween(frame, [0, ...ARRIVE], [0, ...NODE_AT], EASE_IN_OUT);
  const head = getPointAtLength(PATH, progress * TOTAL) ?? { x: 540, y: WORLD_H };
  // Camera follows the glowing head, then pulls back for the full journey.
  const follow = 1060 - head.y;
  const overview = tween(frame, [92, 116], [0, 1], EASE_IN_OUT);
  const scale = 1 - overview * 0.36;
  const camY = follow * (1 - overview) + (960 - (WORLD_H / 2 + 60) * scale) * overview;
  const flash = tween(frame, [len - 16, len], [0, 1], EASE_IN);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${um.colors.bgDeep} 0%, #0A1C45 55%, ${um.colors.bgDeep} 100%)`,
        overflow: "hidden",
      }}
    >
      <ParticleField seed="s6" count={80} opacity={0.7} speed={1.4} />
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: WORLD_H,
            transformOrigin: "50% 0",
            transform: `translateY(${camY}px) rotateX(${14 * (1 - overview)}deg) scale(${scale})`,
          }}
        >
          <svg width={1080} height={WORLD_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <linearGradient id="pathGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor={um.colors.blue} />
                <stop offset="1" stopColor={um.colors.goldLight} />
              </linearGradient>
              <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
            </defs>
            <path d={PATH} fill="none" stroke="rgba(157,187,255,0.18)" strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" />
            <path d={PATH} fill="none" stroke="url(#pathGrad)" strokeWidth={26} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} filter="url(#pathGlow)" opacity={0.9} />
            <path d={PATH} fill="none" stroke="url(#pathGrad)" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
            <circle cx={head.x} cy={head.y} r={16} fill="#FFF6DA" style={{ filter: "drop-shadow(0 0 24px #EBD394) drop-shadow(0 0 50px #EBD394)" }} opacity={frame < ARRIVE[3] + 6 ? 1 : 0} />
          </svg>
          {NODES.map((n, i) => {
            const on = spring({ frame: frame - ARRIVE[i], fps, config: { damping: 12 } });
            const ring = tween(frame, [ARRIVE[i], ARRIVE[i] + 24], [0, 1]);
            return (
              <div key={n.label}>
                <div
                  style={{
                    position: "absolute",
                    left: n.x - 110,
                    top: n.y - 110,
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    border: `3px solid ${um.colors.goldLight}`,
                    transform: `scale(${0.5 + ring * 1.1})`,
                    opacity: ring > 0 && ring < 1 ? 1 - ring : 0,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: n.x - 75,
                    top: n.y - 75,
                    opacity: 0.3 + on * 0.7,
                    transform: `scale(${0.8 + on * 0.2})`,
                  }}
                >
                  <IconBadge name={n.icon} size={150} progress={tween(frame, [ARRIVE[i], ARRIVE[i] + 18], [0, 1])} glow={on} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: n.y - 95,
                    ...(n.side === 1 ? { left: n.x + 110 } : { right: 1080 - n.x + 110, textAlign: "right" as const }),
                    opacity: on,
                    transform: `translateX(${(1 - on) * 60 * n.side}px)`,
                  }}
                >
                  <div style={{ fontFamily: um.fonts.body, fontSize: 28, fontWeight: 600, letterSpacing: 6, color: um.colors.goldLight }}>
                    STEP 0{i + 1}
                  </div>
                  <div
                    style={{
                      fontFamily: um.fonts.display,
                      fontSize: 76,
                      fontWeight: 800,
                      lineHeight: 1.02,
                      letterSpacing: -2,
                      color: um.colors.white,
                      whiteSpace: "pre-line",
                      marginTop: 6,
                    }}
                  >
                    {n.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* Final milestone blooms into light → healthcare scene */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 35%, rgba(255,246,222,${0.9 * flash}) 0%, rgba(235,211,148,${0.5 * flash}) 30%, transparent ${30 + flash * 60}%)`,
        }}
      />
    </AbsoluteFill>
  );
};
