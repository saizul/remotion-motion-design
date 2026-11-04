import { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { b1 } from "../theme";

const PALETTE = [b1.colors.navy, b1.colors.red, b1.colors.blue, b1.colors.sky];

// Light-theme particle field: small crisp dots in brand colors plus soft motes.
export const Particles: React.FC<{
  count?: number;
  seed?: string;
  mode?: "drift" | "forward";
  speed?: number;
  opacity?: number;
}> = ({ count = 70, seed = "p", mode = "drift", speed = 1, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ps = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`${seed}x${i}`) * 2 - 1,
        y: random(`${seed}y${i}`) * 2 - 1,
        z: random(`${seed}z${i}`),
        r: 2 + random(`${seed}r${i}`) * 4,
        c: PALETTE[Math.floor(random(`${seed}c${i}`) * PALETTE.length)],
        ph: random(`${seed}p${i}`) * Math.PI * 2,
      })),
    [count, seed],
  );
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <svg width={width} height={height}>
        {ps.map((p, i) => {
          let sx: number;
          let sy: number;
          let size: number;
          let a: number;
          if (mode === "forward") {
            const z = ((((p.z - frame * 0.005 * speed) % 1) + 1) % 1) * 0.95 + 0.05;
            sx = width / 2 + (p.x * width * 0.55) / (z * 2.2);
            sy = height / 2 + (p.y * height * 0.55) / (z * 2.2);
            size = p.r * (0.45 / z);
            a = interpolate(z, [0.05, 0.2, 0.8, 1], [0, 0.8, 0.6, 0]);
          } else {
            const t = frame * speed;
            const range = height * 1.2;
            sx = width / 2 + p.x * width * 0.6 + Math.sin(t * 0.02 + p.ph) * 30;
            const raw = ((p.y + 1) / 2) * range - t * (0.4 + p.z);
            sy = (((raw % range) + range) % range) - height * 0.1;
            size = p.r * (0.5 + p.z);
            a = (0.25 + 0.5 * p.z) * (0.7 + 0.3 * Math.sin(t * 0.08 + p.ph));
          }
          return <circle key={i} cx={sx} cy={sy} r={Math.min(size, 26)} fill={p.c} opacity={a} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
