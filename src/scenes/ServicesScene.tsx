import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const SERVICES = [
  { icon: "⚡", title: "n8n Automation", sub: "Workflows that run 24/7" },
  { icon: "🤖", title: "AI Agents", sub: "LLMs that do real work" },
  { icon: "📈", title: "Meta Ads", sub: "Campaigns that convert" },
];

export const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 90, gap: 50, opacity: exit }}>
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: -2,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 40}px)`,
        }}
      >
        Let <span style={{ color: theme.colors.primary }}>AI</span> handle it.
      </div>
      {SERVICES.map((s, i) => {
        const p = spring({ frame: frame - 15 - i * 12, fps, config: { damping: 12 } });
        return (
          <div
            key={s.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              padding: "44px 50px",
              borderRadius: 36,
              background: theme.colors.bgAlt,
              border: `2px solid ${theme.colors.primary}55`,
              boxShadow: `0 20px 60px ${theme.colors.primary}22`,
              opacity: p,
              transform: `translateX(${(1 - p) * -300}px) scale(${0.9 + p * 0.1})`,
            }}
          >
            <div style={{ fontSize: 96 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 64, fontWeight: 800 }}>{s.title}</div>
              <div style={{ fontSize: 40, color: theme.colors.muted, marginTop: 6 }}>{s.sub}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
