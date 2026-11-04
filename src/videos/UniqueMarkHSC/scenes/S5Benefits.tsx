import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN, EASE_IN_OUT, tween } from "../anim";
import { Bokeh } from "../components/Atmosphere";
import { GlassCard } from "../components/GlassCard";
import { IconBadge, type IconName } from "../components/Icons";
import { ParticleField } from "../components/ParticleField";
import { um } from "../theme";

const CARDS: { icon: IconName; title: string }[] = [
  { icon: "unlock", title: "No Previous\nQualifications Required" },
  { icon: "coursework", title: "Coursework\nBased Learning" },
  { icon: "tutor", title: "Dedicated\nTutor Support" },
  { icon: "clock", title: "Flexible\nLearning Options" },
];

const CARD_W = 900;
const CARD_H = 250;
const GAP = 44;
const TOP = 470;
const cardY = (i: number) => TOP + i * (CARD_H + GAP);
const APPEAR = [6, 26, 46, 66];

export const S5Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = um.scenes.benefits + um.overlap;
  // Camera visits each card as it appears, then pulls back to reveal all four.
  const focusY = tween(frame, [0, 26, 46, 66, 96], [cardY(0), cardY(1), cardY(2), cardY(3), 960 - CARD_H / 2], EASE_IN_OUT);
  const zoom = tween(frame, [0, 70, 96], [1.14, 1.1, 1], EASE_IN_OUT);
  const camY = 960 - (focusY + CARD_H / 2);
  const merge = tween(frame, [len - 30, len - 4], [0, 1], EASE_IN);
  const eyebrow = spring({ frame: frame - 70, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 60% at 50% 40%, #0E2A66 0%, ${um.colors.bg} 50%, ${um.colors.bgDeep} 100%)`,
        overflow: "hidden",
      }}
    >
      <Bokeh seed="s5" opacity={0.4} />
      <ParticleField seed="s5" count={70} opacity={0.7} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateY(${camY * zoom}px) scale(${zoom})`,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: TOP - 130,
              width: 1080,
              textAlign: "center",
              fontFamily: um.fonts.body,
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: 8,
              color: um.colors.goldLight,
              opacity: eyebrow * (1 - merge),
            }}
          >
            WHY LEARN WITH UNIQUE MARK
          </div>
          {/* Central line the cards collapse into */}
          <div
            style={{
              position: "absolute",
              left: 537,
              top: cardY(0),
              width: 6,
              height: cardY(3) + CARD_H - cardY(0),
              borderRadius: 3,
              background: `linear-gradient(${um.colors.goldLight}, ${um.colors.blue})`,
              boxShadow: `0 0 24px ${um.colors.goldLight}`,
              transformOrigin: "bottom",
              transform: `scaleY(${merge})`,
            }}
          />
          {CARDS.map((c, i) => {
            const p = spring({ frame: frame - APPEAR[i], fps, config: { damping: 15, mass: 0.9 } });
            const side = i % 2 === 0 ? -1 : 1;
            const iconP = tween(frame, [APPEAR[i] + 6, APPEAR[i] + 28], [0, 1]);
            const active = tween(frame, [APPEAR[i], APPEAR[i] + 10, APPEAR[i] + 30], [0, 1, 0.35]);
            return (
              <div
                key={c.title}
                style={{
                  position: "absolute",
                  left: (1080 - CARD_W) / 2,
                  top: cardY(i),
                  opacity: Math.min(1, p * 1.4),
                  transform: [
                    `translateZ(${(1 - p) * -700 + (i % 2) * -60}px)`,
                    `rotateY(${side * (1 - p) * 35 + side * 6}deg)`,
                    `rotateX(${(1 - p) * 25}deg)`,
                    `scale(${1 - merge * 0.94}, ${1 - merge * 0.9})`,
                  ].join(" "),
                }}
              >
                <GlassCard width={CARD_W} height={CARD_H} radius={36} outline={tween(frame, [APPEAR[i] + 4, APPEAR[i] + 34], [0, 1])}>
                  <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 50px", gap: 44 }}>
                    <div style={{ transform: `scale(${0.9 + active * 0.15})` }}>
                      <IconBadge name={c.icon} size={140} progress={iconP} glow={0.4 + active * 0.6} />
                    </div>
                    <div
                      style={{
                        fontFamily: um.fonts.display,
                        fontSize: 58,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: -1,
                        color: um.colors.white,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {c.title}
                    </div>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
