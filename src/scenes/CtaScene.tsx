import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nameIn = spring({ frame, fps, config: { damping: 14 } });
  const roleIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const btnIn = spring({ frame: frame - 22, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", gap: 40 }}>
      <div
        style={{
          fontSize: 140,
          fontWeight: 800,
          letterSpacing: -4,
          transform: `scale(${0.7 + nameIn * 0.3})`,
          opacity: nameIn,
        }}
      >
        Saizul Amin
      </div>
      <div style={{ fontSize: 52, color: theme.colors.muted, opacity: roleIn }}>
        AI Automation Engineer
      </div>
      <div
        style={{
          marginTop: 60,
          padding: "36px 80px",
          borderRadius: 999,
          fontSize: 60,
          fontWeight: 800,
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          transform: `scale(${btnIn})`,
        }}
      >
        saizul.com
      </div>
    </AbsoluteFill>
  );
};
