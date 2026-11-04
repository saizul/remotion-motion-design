import { useCurrentFrame } from "remotion";
import { sa } from "../theme";

type Props = {
  width: number;
  height: number;
  radius?: number;
  outline?: number; // 0 → 1 cyan border draws itself
  glow?: number;
  sheen?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

// Dark frosted-glass panel with a self-drawing cyan edge.
export const Glass: React.FC<Props> = ({ width, height, radius = 22, outline = 1, glow = 0.5, sheen = true, style, children }) => {
  const frame = useCurrentFrame();
  const sx = ((frame * 1.1) % 280) - 90;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(92,200,255,0.05) 50%, rgba(255,255,255,0.03) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 ${40 * glow}px rgba(47,128,255,${0.25 * glow}), inset 0 1px 0 rgba(255,255,255,0.18)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {sheen ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sx}%`,
            width: "30%",
            background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.07), transparent)",
            transform: "skewX(-18deg)",
          }}
        />
      ) : null}
      {outline > 0 ? (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <rect
            x={1}
            y={1}
            width={Math.max(width - 2, 0)}
            height={Math.max(height - 2, 0)}
            rx={Math.max(radius - 1, 0)}
            fill="none"
            stroke={sa.colors.cyan}
            strokeOpacity={0.75}
            strokeWidth={1.8}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - outline}
            style={{ filter: "drop-shadow(0 0 6px rgba(92,200,255,0.8))" }}
          />
        </svg>
      ) : null}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
};
