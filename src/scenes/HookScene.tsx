import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const LINES = ["Still doing", "repetitive work", "manually?"];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", padding: 100, opacity: exit }}
    >
      {LINES.map((line, i) => {
        const s = spring({ frame: frame - i * 8, fps, config: { damping: 14 } });
        const isKey = i === 2;
        return (
          <div
            key={line}
            style={{
              fontSize: isKey ? 150 : 110,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -3,
              color: isKey ? theme.colors.accent : theme.colors.text,
              transform: `translateY(${(1 - s) * 80}px)`,
              opacity: s,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
