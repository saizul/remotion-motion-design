import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { um } from "../theme";

// Large, soft out-of-focus light orbs for depth-of-field feel.
export const Bokeh: React.FC<{ seed?: string; count?: number; opacity?: number }> = ({
  seed = "b",
  count = 7,
  opacity = 0.35,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const size = 160 + random(`${seed}s${i}`) * 320;
        const x = random(`${seed}x${i}`) * 1080;
        const y = random(`${seed}y${i}`) * 1920;
        const gold = random(`${seed}g${i}`) < 0.4;
        const drift = Math.sin(frame * 0.015 + i) * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - size / 2 + drift,
              top: y - size / 2 - frame * (0.3 + i * 0.05),
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${gold ? um.colors.goldLight : um.colors.blue}66 0%, transparent 70%)`,
              filter: "blur(18px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.6 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 60% at 50% 48%, transparent 55%, rgba(1,4,12,${strength}) 100%)`,
    }}
  />
);

// Animated film grain for a cinematic finish.
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 12} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Diagonal light band that sweeps across the frame (progress 0 → 1).
export const LightSweep: React.FC<{ progress: number; intensity?: number; angle?: number }> = ({
  progress,
  intensity = 1,
  angle = 20,
}) => {
  if (progress <= 0 || progress >= 1) return null;
  const x = -80 + progress * 260;
  const flash = Math.sin(progress * Math.PI);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: `${x - 40}%`,
          width: "70%",
          height: "160%",
          transform: `rotate(${angle}deg)`,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(157,187,255,0.25) 30%, rgba(255,244,214,0.95) 50%, rgba(235,211,148,0.35) 65%, transparent 100%)",
          filter: "blur(30px)",
          opacity: intensity,
        }}
      />
      <AbsoluteFill style={{ background: `rgba(255,246,222,${0.25 * flash * intensity})` }} />
    </AbsoluteFill>
  );
};

// Soft volumetric rays rotating behind a hero object.
export const LightRays: React.FC<{ x: number; y: number; opacity?: number }> = ({
  x,
  y,
  opacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x - 1100,
        top: y - 1100,
        width: 2200,
        height: 2200,
        borderRadius: "50%",
        opacity,
        transform: `rotate(${frame * 0.25}deg)`,
        background: `repeating-conic-gradient(from 0deg, rgba(235,211,148,0.16) 0deg 4deg, transparent 4deg 14deg, rgba(61,123,255,0.14) 14deg 17deg, transparent 17deg 30deg)`,
        maskImage: "radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 25%, transparent 60%)",
        WebkitMaskImage: "radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 25%, transparent 60%)",
        filter: "blur(6px)",
      }}
    />
  );
};
