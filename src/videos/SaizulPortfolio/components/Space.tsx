import { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { sa } from "../theme";

// Deep-space backdrop with a soft blue key light and optional perspective floor grid.
export const Backdrop: React.FC<{ focusX?: number; focusY?: number; grid?: boolean; tint?: string }> = ({
  focusX = 50,
  focusY = 45,
  grid = false,
  tint = "#0B1B3D",
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 60% at ${focusX}% ${focusY}%, ${tint} 0%, ${sa.colors.bg2} 40%, ${sa.colors.bg} 100%)`,
        overflow: "hidden",
      }}
    >
      {grid ? (
        <div
          style={{
            position: "absolute",
            left: -1200,
            right: -1200,
            top: 640,
            height: 900,
            transform: "perspective(700px) rotateX(72deg)",
            transformOrigin: "top",
            backgroundImage:
              "linear-gradient(rgba(47,128,255,0.35) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(47,128,255,0.35) 1.5px, transparent 1.5px)",
            backgroundSize: "110px 110px",
            backgroundPosition: `0 ${frame * 1.5}px`,
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 25%, #000 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 25%, #000 60%, transparent 100%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// Floating digital dust: silver + blue motes with depth; "forward" streams toward the camera.
export const Dust: React.FC<{ count?: number; seed?: string; mode?: "drift" | "forward"; speed?: number; opacity?: number }> = ({
  count = 120,
  seed = "d",
  mode = "drift",
  speed = 1,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const W = 1920;
  const H = 1080;
  const ps = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`${seed}x${i}`) * 2 - 1,
        y: random(`${seed}y${i}`) * 2 - 1,
        z: random(`${seed}z${i}`),
        r: 0.8 + random(`${seed}r${i}`) * 2.2,
        blue: random(`${seed}c${i}`) < 0.45,
        ph: random(`${seed}p${i}`) * Math.PI * 2,
      })),
    [count, seed],
  );
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <svg width={W} height={H}>
        <defs>
          <radialGradient id={`dS-${seed}`}>
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.4" stopColor={sa.colors.silver} stopOpacity="0.7" />
            <stop offset="1" stopColor={sa.colors.silver} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`dB-${seed}`}>
            <stop offset="0" stopColor="#E6F4FF" />
            <stop offset="0.4" stopColor={sa.colors.cyan} stopOpacity="0.7" />
            <stop offset="1" stopColor={sa.colors.blue} stopOpacity="0" />
          </radialGradient>
        </defs>
        {ps.map((p, i) => {
          let sx: number;
          let sy: number;
          let size: number;
          let a: number;
          if (mode === "forward") {
            const z = ((((p.z - frame * 0.004 * speed) % 1) + 1) % 1) * 0.95 + 0.05;
            sx = W / 2 + (p.x * W * 0.5) / (z * 2);
            sy = H / 2 + (p.y * H * 0.5) / (z * 2);
            size = p.r * (0.5 / z);
            a = interpolate(z, [0.05, 0.2, 0.8, 1], [0, 1, 0.7, 0]);
          } else {
            const t = frame * speed;
            sx = (((p.x + 1) / 2) * W + Math.sin(t * 0.015 + p.ph) * 40 + t * 0.2 * (p.z - 0.5)) % W;
            const range = H * 1.2;
            const raw = ((p.y + 1) / 2) * range - t * (0.25 + p.z * 0.6);
            sy = (((raw % range) + range) % range) - H * 0.1;
            size = p.r * (0.6 + p.z);
            a = (0.25 + 0.75 * p.z) * (0.55 + 0.45 * Math.sin(t * 0.07 + p.ph));
          }
          return <circle key={i} cx={sx} cy={sy} r={Math.min(size * 3, 30)} fill={`url(#${p.blue ? "dB" : "dS"}-${seed})`} opacity={a} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{ pointerEvents: "none", background: "radial-gradient(ellipse 80% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }}
  />
);

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="saGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={frame % 10} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#saGrain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Horizontal light sweep for transitions (progress 0 → 1).
export const Sweep: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress <= 0 || progress >= 1) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: `${-60 + progress * 200}%`,
          width: "40%",
          height: "160%",
          transform: "rotate(14deg)",
          background: "linear-gradient(90deg, transparent, rgba(92,200,255,0.35), rgba(255,255,255,0.8), rgba(92,200,255,0.35), transparent)",
          filter: "blur(30px)",
        }}
      />
    </AbsoluteFill>
  );
};
