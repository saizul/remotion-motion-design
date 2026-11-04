import { AbsoluteFill, useCurrentFrame } from "remotion";
import { b1 } from "../theme";

// Bright studio backdrop: white core, sky-blue falloff, soft window beams.
export const BrightBackdrop: React.FC<{ beams?: boolean; focusY?: number }> = ({ beams = true, focusY = 45 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 85% 60% at 50% ${focusY}%, #FFFFFF 0%, ${b1.colors.bg} 45%, #DCE7F7 100%)`,
        overflow: "hidden",
      }}
    >
      {beams
        ? [0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: -300,
                left: -200 + i * 360 + Math.sin(frame * 0.01 + i) * 30,
                width: 160,
                height: 2600,
                transform: "rotate(18deg)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0))",
                filter: "blur(24px)",
                opacity: 0.7,
              }}
            />
          ))
        : null}
    </AbsoluteFill>
  );
};

// Brand ribbons (navy/red swoosh) along the bottom edge.
export const BrandRibbon: React.FC<{ progress?: number; y?: number }> = ({ progress = 1, y = 1700 }) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame * 0.04) * 20;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <g style={{ transform: `translateX(${(1 - progress) * -1200}px)` }}>
        <path d={`M-40 ${y + 90} C 300 ${y - 40 + wave}, 700 ${y + 160 - wave}, 1120 ${y + 20} L1120 1960 L-40 1960 Z`} fill={b1.colors.navy} />
        <path
          d={`M-40 ${y + 60} C 300 ${y - 70 + wave}, 700 ${y + 130 - wave}, 1120 ${y - 10}`}
          stroke={b1.colors.red}
          strokeWidth={26}
          fill="none"
        />
        <path
          d={`M-40 ${y + 30} C 300 ${y - 100 + wave}, 700 ${y + 100 - wave}, 1120 ${y - 40}`}
          stroke="#FFFFFF"
          strokeWidth={10}
          fill="none"
          opacity={0.9}
        />
      </g>
    </svg>
  );
};

// Fast diagonal light streaks for the hero finish.
export const LightStreaks: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const frame = useCurrentFrame() - start;
  if (frame < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const t = ((frame * (14 + i * 3) + i * 400) % 2600) - 800;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 200 + i * 330,
              left: t,
              width: 520,
              height: i % 2 ? 4 : 7,
              borderRadius: 4,
              transform: "rotate(-24deg)",
              background: `linear-gradient(90deg, transparent, ${i % 2 ? b1.colors.red : b1.colors.blue}, transparent)`,
              filter: "blur(1px)",
              opacity: 0.55,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Sweep: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress <= 0 || progress >= 1) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: `${-80 + progress * 240}%`,
          width: "60%",
          height: "160%",
          transform: "rotate(18deg)",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
          filter: "blur(30px)",
        }}
      />
      <AbsoluteFill style={{ background: `rgba(255,255,255,${0.35 * Math.sin(progress * Math.PI)})` }} />
    </AbsoluteFill>
  );
};
