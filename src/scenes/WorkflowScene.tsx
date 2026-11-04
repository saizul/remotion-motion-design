import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const NODES = [
  { label: "New Lead", color: theme.colors.accent },
  { label: "AI Qualifies", color: theme.colors.primary },
  { label: "CRM + Reply", color: theme.colors.success },
];

const NODE_H = 200;
const GAP = 180;

// Vertical n8n-style flow: nodes pop in, connectors draw, a data pulse travels down.
export const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const totalH = NODES.length * NODE_H + (NODES.length - 1) * GAP;
  const pulseY = interpolate(frame, [45, 95], [0, totalH - NODE_H], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const doneIn = spring({ frame: frame - 95, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: exit }}>
      <div style={{ position: "relative", width: 760, height: totalH }}>
        {NODES.slice(0, -1).map((_, i) => {
          const draw = interpolate(frame, [15 + i * 12, 35 + i * 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 380 - 4,
                top: (i + 1) * NODE_H + i * GAP,
                width: 8,
                height: GAP * draw,
                borderRadius: 4,
                background: `linear-gradient(${NODES[i].color}, ${NODES[i + 1].color})`,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 380 - 22,
            top: NODE_H / 2 + pulseY - 22,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: theme.colors.text,
            boxShadow: `0 0 40px 12px ${theme.colors.accent}`,
            opacity: frame >= 45 && frame <= 100 ? 1 : 0,
          }}
        />
        {NODES.map((n, i) => {
          const p = spring({ frame: frame - i * 12, fps, config: { damping: 12 } });
          return (
            <div
              key={n.label}
              style={{
                position: "absolute",
                top: i * (NODE_H + GAP),
                width: 760,
                height: NODE_H,
                borderRadius: 40,
                background: theme.colors.bgAlt,
                border: `4px solid ${n.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 70,
                fontWeight: 800,
                transform: `scale(${p})`,
              }}
            >
              {n.label}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 90,
          fontSize: 64,
          fontWeight: 600,
          color: theme.colors.success,
          opacity: doneIn,
          transform: `scale(${0.8 + doneIn * 0.2})`,
        }}
      >
        ✓ Done in 3 seconds
      </div>
    </AbsoluteFill>
  );
};
