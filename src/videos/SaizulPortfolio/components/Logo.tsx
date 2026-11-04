import { useMemo } from "react";
import { Img, random, staticFile, useCurrentFrame } from "remotion";
import { EASE_IN_OUT } from "../anim";
import logoPoints from "../logoPoints.json";
import { sa } from "../theme";

export const LOGO_ASPECT = logoPoints.aspect;

// The official logo, untouched, on a frosted white glass plate so its black
// lettering stays legible on dark scenes. Blue energy runs along the edge.
export const LogoPlate: React.FC<{ width: number; energy?: number; glow?: number; opacity?: number }> = ({
  width,
  energy = 1,
  glow = 1,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const logoW = width * 0.84;
  const h = logoW / LOGO_ASPECT + width * 0.14;
  const r = h * 0.18;
  return (
    <div style={{ position: "relative", width, height: h, opacity }}>
      <div
        style={{
          position: "absolute",
          inset: -width * 0.08,
          borderRadius: r * 2,
          background: `radial-gradient(ellipse at center, rgba(92,200,255,${0.35 * glow}) 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          background: "linear-gradient(150deg, rgba(255,255,255,0.97) 0%, rgba(236,242,250,0.93) 55%, rgba(214,226,242,0.9) 100%)",
          boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 ${60 * glow}px rgba(92,200,255,${0.45 * glow}), inset 0 2px 0 #fff`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Img src={staticFile("saizul/logo.png")} style={{ width: logoW }} />
        {/* Glass reflection */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${((frame * 0.9) % 260) - 80}%`,
            width: "25%",
            background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)",
            transform: "skewX(-20deg)",
          }}
        />
      </div>
      {energy > 0 ? (
        <svg width={width} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {[0, 1].map((k) => (
            <rect
              key={k}
              x={-4}
              y={-4}
              width={width + 8}
              height={h + 8}
              rx={r + 4}
              fill="none"
              stroke={k ? sa.colors.blue : sa.colors.cyan}
              strokeWidth={k ? 6 : 2.5}
              pathLength={100}
              strokeDasharray="14 36"
              strokeDashoffset={-(frame * 0.8 + k * 25)}
              opacity={energy * (k ? 0.5 : 1)}
              style={{ filter: `drop-shadow(0 0 ${k ? 14 : 8}px ${sa.colors.cyan})` }}
            />
          ))}
        </svg>
      ) : null}
    </div>
  );
};

// Silver particles fly in from 3D space and assemble the logo's shape (progress 0 → 1).
export const ParticleLogo: React.FC<{ width: number; progress: number; opacity?: number; seed?: string }> = ({
  width,
  progress,
  opacity = 1,
  seed = "pl",
}) => {
  const h = width / LOGO_ASPECT;
  const pts = useMemo(
    () =>
      logoPoints.points.map(([x, y, c], i) => {
        const th = random(`${seed}t${i}`) * Math.PI * 2;
        const ph = Math.acos(2 * random(`${seed}p${i}`) - 1);
        const rad = 700 + random(`${seed}r${i}`) * 900;
        return {
          tx: x * width,
          ty: y * h,
          sx: width / 2 + Math.sin(ph) * Math.cos(th) * rad,
          sy: h / 2 + Math.sin(ph) * Math.sin(th) * rad * 0.6,
          sz: Math.cos(ph) * 900,
          delay: random(`${seed}d${i}`) * 0.35,
          c: c as number,
        };
      }),
    [width, h, seed],
  );
  const f = 1100;
  return (
    <svg width={width} height={h} style={{ overflow: "visible", opacity }}>
      {pts.map((p, i) => {
        const local = Math.min(1, Math.max(0, (progress - p.delay) / (1 - 0.35)));
        const t = EASE_IN_OUT(local);
        const z = p.sz * (1 - t);
        const k = f / (f + z);
        const x = width / 2 + (p.sx + (p.tx - p.sx) * t - width / 2) * k;
        const y = h / 2 + (p.sy + (p.ty - p.sy) * t - h / 2) * k;
        const color = p.c === 1 ? sa.colors.red : p.c === 2 ? "#9AA4B2" : "#E9EEF5";
        return <circle key={i} cx={x} cy={y} r={2.3 * k + (1 - t) * 1.5} fill={color} opacity={0.35 + 0.65 * t} />;
      })}
    </svg>
  );
};
