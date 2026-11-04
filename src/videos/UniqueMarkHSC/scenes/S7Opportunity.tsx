import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, impactShake, tween } from "../anim";
import { GlassCard } from "../components/GlassCard";
import { Icon, IconBadge } from "../components/Icons";
import { Footage } from "../components/Footage";
import { ParticleField } from "../components/ParticleField";
import { um } from "../theme";

const WORDS = [
  { text: "Learn.", at: 10, gold: false },
  { text: "Grow.", at: 36, gold: false },
  { text: "Move Forward.", at: 62, gold: true },
];
const SWITCH = 56;

const Chip: React.FC<{ delay: number; x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({
  delay,
  x,
  y,
  w,
  h,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + Math.sin((frame + delay * 3) * 0.05) * 8,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + p * 0.1})`,
      }}
    >
      <GlassCard width={w} height={h} radius={28} outline={0} sheen={false}>
        {children}
      </GlassCard>
    </div>
  );
};

export const S7Opportunity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = um.scenes.opportunity + um.overlap;
  const shake = WORDS.reduce((s, w) => s + impactShake(frame, w.at, 9), 0);
  const second = tween(frame, [SWITCH, SWITCH + 12], [0, 1], EASE_IN_OUT);
  const progress = tween(frame, [30, 80], [0, 0.68], EASE_IN_OUT);
  const fadeOut = tween(frame, [len - 20, len], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: um.colors.bgDeep }}>
      <Footage src="um/clip-class.mp4" duration={len} objectPosition="38% 40%" zoom={[1.08, 1.2]} pan={[20, -20]} shakeX={shake} shakeY={shake * 0.5} />
      <AbsoluteFill style={{ opacity: second }}>
        <Sequence from={SWITCH} layout="none">
          <Footage src="um/clip-care.mp4" duration={len - SWITCH} objectPosition="62% 35%" zoom={[1.12, 1.22]} trimBefore={20} shakeX={shake} shakeY={shake * 0.5} />
        </Sequence>
      </AbsoluteFill>
      <ParticleField seed="s7" count={50} opacity={0.6} />

      {/* Digital learning interface */}
      <Chip delay={8} x={70} y={250} w={470} h={130}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: "100%", padding: "0 26px" }}>
          <IconBadge name="tutor" size={84} />
          <div style={{ fontFamily: um.fonts.body, color: um.colors.white }}>
            <div style={{ fontSize: 32, fontWeight: 600 }}>Your Tutor</div>
            <div style={{ fontSize: 24, color: "#7BE3A8", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: "#34D399", boxShadow: "0 0 10px #34D399" }} />
              Available to help
            </div>
          </div>
        </div>
      </Chip>
      <Chip delay={20} x={520} y={430} w={490} h={150}>
        <div style={{ padding: "26px 30px", fontFamily: um.fonts.body, color: um.colors.white }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 600 }}>
            <span>Course Progress</span>
            <span style={{ color: um.colors.goldLight }}>{Math.round(progress * 100)}%</span>
          </div>
          <div style={{ marginTop: 22, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.15)" }}>
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                borderRadius: 7,
                background: um.goldGradient,
                boxShadow: "0 0 16px rgba(235,211,148,0.7)",
              }}
            />
          </div>
        </div>
      </Chip>
      <Chip delay={34} x={70} y={620} w={500} h={110}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, height: "100%", padding: "0 26px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: "rgba(52,211,153,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="check" size={32} color="#7BE3A8" strokeWidth={3} progress={tween(frame, [40, 56], [0, 1])} />
          </div>
          <div style={{ fontFamily: um.fonts.body, fontSize: 30, fontWeight: 600, color: um.colors.white }}>
            Assignment submitted
          </div>
        </div>
      </Chip>

      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 80px 400px" }}>
        {WORDS.map((w) => {
          const p = spring({ frame: frame - w.at, fps, config: { stiffness: 260, damping: 18, mass: 0.7 } });
          return (
            <div
              key={w.text}
              style={{
                fontFamily: um.fonts.display,
                fontSize: w.gold ? 124 : 150,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: -4,
                opacity: Math.min(1, p * 2),
                transform: `scale(${2.1 - p * 1.1})`,
                transformOrigin: "left center",
                filter: `blur(${(1 - Math.min(1, p)) * 12}px)`,
                ...(w.gold
                  ? {
                      backgroundImage: um.goldGradient,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }
                  : { color: um.colors.white }),
                textShadow: w.gold ? undefined : "0 8px 40px rgba(0,0,0,0.5)",
              }}
            >
              {w.text}
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: um.colors.bgDeep, opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
