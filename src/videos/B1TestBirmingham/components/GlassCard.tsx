import { useCurrentFrame } from "remotion";
import { b1 } from "../theme";

type Props = {
  width: number;
  height: number;
  radius?: number;
  outline?: number; // 0 → 1: brand-red border draws itself
  sheen?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

// Frosted white glass panel for a bright scene.
export const GlassCard: React.FC<Props> = ({ width, height, radius = 32, outline = 1, sheen = true, style, children }) => {
  const frame = useCurrentFrame();
  const sheenX = ((frame * 1.2) % 260) - 80;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(140deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 100%)",
        border: "1px solid rgba(255,255,255,0.95)",
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        boxShadow: "0 30px 80px rgba(1,33,105,0.18), 0 6px 18px rgba(1,33,105,0.08), inset 0 1px 0 #FFFFFF",
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
            left: `${sheenX}%`,
            width: "30%",
            background: "linear-gradient(100deg, transparent, rgba(191,214,255,0.35), transparent)",
            transform: "skewX(-18deg)",
          }}
        />
      ) : null}
      {outline > 0 ? (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <rect
            x={1.5}
            y={1.5}
            width={Math.max(width - 3, 0)}
            height={Math.max(height - 3, 0)}
            rx={Math.max(radius - 1.5, 0)}
            fill="none"
            stroke={b1.colors.red}
            strokeWidth={3}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - outline}
          />
        </svg>
      ) : null}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
};
