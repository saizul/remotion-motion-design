import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { tween } from "../../UniqueMarkHSC/anim";
import { GlassCard } from "../../B1TestBirmingham/components/GlassCard";
import { IconBadge, type IconName } from "../../B1TestBirmingham/components/Icons";
import { BanglaType } from "../components/BanglaType";
import { type TypeCue } from "../typing";

// Feature card: slides in from the right, icon draws, Bengali text types.
export const FeatureCard: React.FC<{ icon: IconName; c: TypeCue; y: number; red?: boolean }> = ({ icon, c, y, red }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = c.start - 6;
  const p = spring({ frame: frame - appear, fps, config: { damping: 16 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: y,
        opacity: Math.min(1, p * 1.5),
        transform: `perspective(1600px) translateX(${(1 - p) * 500}px) rotateY(${(1 - p) * -40}deg)`,
      }}
    >
      <GlassCard width={940} height={150} radius={75} outline={tween(frame, [appear + 4, appear + 30], [0, 1])}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, height: "100%", padding: "0 24px" }}>
          <IconBadge name={icon} size={110} progress={tween(frame, [appear + 4, appear + 22], [0, 1])} ring={red ? "#C8102E" : "#012169"} />
          <BanglaType cue={c} fontSize={52} weight={700} />
        </div>
      </GlassCard>
    </div>
  );
};
