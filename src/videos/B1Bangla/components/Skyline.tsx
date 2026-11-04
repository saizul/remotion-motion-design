import { random, useCurrentFrame } from "remotion";
import { bn } from "../theme";

type Layer = "far" | "mid" | "near";

// Birmingham-style skyline (clock tower, dome, glass towers) drawn in brand navy,
// in three depth layers so the camera can parallax through it.
const Tower: React.FC<{ x: number; base: number; w: number; h: number; kind: number; fill: string; windows: boolean; seed: string }> = ({
  x,
  base,
  w,
  h,
  kind,
  fill,
  windows,
  seed,
}) => {
  const top = base - h;
  const body = <rect x={x} y={top} width={w} height={h} fill={fill} />;
  if (kind === 0) {
    // Clock tower
    return (
      <g>
        {body}
        <rect x={x + w * 0.15} y={top - 70} width={w * 0.7} height={70} fill={fill} />
        <polygon points={`${x + w * 0.1},${top - 70} ${x + w / 2},${top - 150} ${x + w * 0.9},${top - 70}`} fill={fill} />
        <circle cx={x + w / 2} cy={top - 35} r={w * 0.2} fill="#FFFFFF" opacity={0.85} />
      </g>
    );
  }
  if (kind === 1) {
    // Dome
    return (
      <g>
        {body}
        <ellipse cx={x + w / 2} cy={top} rx={w * 0.45} ry={w * 0.42} fill={fill} />
        <rect x={x + w / 2 - 4} y={top - w * 0.42 - 40} width={8} height={40} fill={fill} />
      </g>
    );
  }
  return (
    <g>
      {body}
      {windows
        ? new Array(Math.floor(h / 26)).fill(0).map((_, r) => (
            <rect key={r} x={x + 6} y={top + 10 + r * 26} width={w - 12} height={6} fill="#FFFFFF" opacity={random(`${seed}${r}`) < 0.5 ? 0.35 : 0.12} />
          ))
        : null}
    </g>
  );
};

export const Skyline: React.FC<{ layer: Layer; base?: number; drift?: number; opacity?: number }> = ({ layer, base = 1560, drift = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const cfg = {
    far: { fill: "rgba(27,58,140,0.18)", scale: 0.8, count: 16, win: false },
    mid: { fill: "rgba(1,33,105,0.38)", scale: 1, count: 12, win: true },
    near: { fill: bn.colors.navy, scale: 1.25, count: 9, win: true },
  }[layer];
  const items = new Array(cfg.count).fill(0).map((_, i) => {
    const w = (60 + random(`${layer}w${i}`) * 70) * cfg.scale;
    const kind = i === Math.floor(cfg.count * 0.35) ? 0 : i === Math.floor(cfg.count * 0.7) ? 1 : 2;
    return { i, w, h: (140 + random(`${layer}h${i}`) * (layer === "near" ? 200 : 380)) * cfg.scale, kind };
  });
  let x = -60;
  return (
    <svg width={1300} height={1920} style={{ position: "absolute", left: -110 + drift * frame, top: 0, opacity, overflow: "visible" }}>
      {items.map((it) => {
        const node = <Tower key={it.i} x={x} base={base} w={it.w} h={it.h} kind={it.kind} fill={cfg.fill} windows={cfg.win} seed={`${layer}${it.i}`} />;
        x += it.w + 8 * cfg.scale;
        return node;
      })}
      <rect x={-200} y={base} width={1800} height={1920 - base} fill={cfg.fill} />
    </svg>
  );
};
