import { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { um } from "../theme";

type Props = {
  count?: number;
  seed?: string;
  // "forward": particles stream toward the camera; "drift": float upward.
  mode?: "drift" | "forward";
  speed?: number;
  opacity?: number;
  goldRatio?: number;
};

export const ParticleField: React.FC<Props> = ({
  count = 90,
  seed = "p",
  mode = "drift",
  speed = 1,
  opacity = 1,
  goldRatio = 0.35,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const particles = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`${seed}x${i}`) * 2 - 1,
        y: random(`${seed}y${i}`) * 2 - 1,
        z: random(`${seed}z${i}`),
        r: 1.2 + random(`${seed}r${i}`) * 2.6,
        gold: random(`${seed}g${i}`) < goldRatio,
        ph: random(`${seed}ph${i}`) * Math.PI * 2,
      })),
    [count, seed, goldRatio],
  );

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <svg width={width} height={height}>
        <defs>
          <radialGradient id={`pb-${seed}`}>
            <stop offset="0" stopColor="#E4EDFF" stopOpacity="1" />
            <stop offset="0.35" stopColor={um.colors.blue} stopOpacity="0.75" />
            <stop offset="1" stopColor={um.colors.blue} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`pg-${seed}`}>
            <stop offset="0" stopColor="#FFF6DA" stopOpacity="1" />
            <stop offset="0.35" stopColor={um.colors.goldLight} stopOpacity="0.75" />
            <stop offset="1" stopColor={um.colors.gold} stopOpacity="0" />
          </radialGradient>
        </defs>
        {particles.map((p, i) => {
          let sx: number;
          let sy: number;
          let size: number;
          let a: number;
          if (mode === "forward") {
            const z = (((p.z - frame * 0.006 * speed) % 1) + 1) % 1 * 0.95 + 0.05;
            sx = width / 2 + (p.x * width * 0.55) / (z * 2.2);
            sy = height / 2 + (p.y * height * 0.55) / (z * 2.2);
            size = p.r * (0.55 / z);
            a = interpolate(z, [0.05, 0.18, 0.8, 1], [0, 1, 0.7, 0]);
          } else {
            const t = frame * speed;
            const range = height * 1.2;
            sx = width / 2 + p.x * width * 0.6 + Math.sin(t * 0.02 + p.ph) * 30;
            const raw = ((p.y + 1) / 2) * range - t * (0.5 + p.z * 1.1);
            sy = (((raw % range) + range) % range) - height * 0.1;
            size = p.r * (0.5 + p.z);
            a = (0.3 + 0.7 * p.z) * (0.6 + 0.4 * Math.sin(t * 0.08 + p.ph));
          }
          return (
            <circle
              key={i}
              cx={sx}
              cy={sy}
              r={Math.min(size * 3, 40)}
              fill={`url(#${p.gold ? "pg" : "pb"}-${seed})`}
              opacity={a}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
