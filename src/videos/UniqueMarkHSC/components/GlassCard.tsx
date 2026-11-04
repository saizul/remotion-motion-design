import { useCurrentFrame } from "remotion";
import { um } from "../theme";

type Props = {
  width: number;
  height: number;
  radius?: number;
  // 0 → 1: gold outline drawing itself around the card.
  outline?: number;
  sheen?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

// Glassmorphism panel with a self-drawing gold border and moving sheen.
export const GlassCard: React.FC<Props> = ({
  width,
  height,
  radius = 40,
  outline = 1,
  sheen = true,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const sheenX = ((frame * 1.2) % 260) - 80;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(140deg, rgba(255,255,255,0.16) 0%, rgba(157,187,255,0.07) 45%, rgba(255,255,255,0.04) 100%)",
        border: "1px solid rgba(255,255,255,0.16)",
        backdropFilter: "blur(26px) saturate(150%)",
        WebkitBackdropFilter: "blur(26px) saturate(150%)",
        boxShadow:
          "0 40px 120px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -20px 60px rgba(61,123,255,0.08)",
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
            width: "35%",
            background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.10), transparent)",
            transform: "skewX(-18deg)",
          }}
        />
      ) : null}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="cardGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={um.colors.goldLight} />
            <stop offset="0.5" stopColor={um.colors.gold} />
            <stop offset="1" stopColor="#FFF1C7" />
          </linearGradient>
        </defs>
        {outline > 0 ? (
          <rect
            x={1.5}
            y={1.5}
            width={Math.max(width - 3, 0)}
            height={Math.max(height - 3, 0)}
            rx={Math.max(radius - 1.5, 0)}
            fill="none"
            stroke="url(#cardGold)"
            strokeWidth={3}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - outline}
            style={{ filter: "drop-shadow(0 0 8px rgba(235,211,148,0.7))" }}
          />
        ) : null}
      </svg>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
};
