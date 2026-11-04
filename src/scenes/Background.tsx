import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

// Slowly drifting gradient glows shared by every scene.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 450], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          left: -300 + drift * 200,
          top: -200 + drift * 150,
          background: `radial-gradient(circle, ${theme.colors.primary}55 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          right: -350 + drift * 150,
          bottom: -250 - drift * 100,
          background: `radial-gradient(circle, ${theme.colors.accent}40 0%, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};
