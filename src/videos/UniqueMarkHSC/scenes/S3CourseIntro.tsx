import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../anim";
import { Bokeh } from "../components/Atmosphere";
import { GlassCard } from "../components/GlassCard";
import { IconBadge, type IconName } from "../components/Icons";
import { ParticleField } from "../components/ParticleField";
import { um } from "../theme";

const FLOATERS: { icon: IconName; x: number; y: number; d: number; s: number }[] = [
  { icon: "book", x: 110, y: 330, d: 0.6, s: 120 },
  { icon: "cap", x: 830, y: 270, d: 0.9, s: 140 },
  { icon: "heart", x: 880, y: 1330, d: 0.7, s: 120 },
  { icon: "cross", x: 90, y: 1420, d: 1, s: 110 },
  { icon: "star", x: 520, y: 180, d: 0.4, s: 90 },
];

export const S3CourseIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = um.scenes.course + um.overlap;
  const rise = spring({ frame: frame - 2, fps, config: { damping: 18, mass: 1.1 } });
  const outline = tween(frame, [12, 50], [0, 1], EASE_IN_OUT);
  const content = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 }, durationInFrames: 18 });
  // Morph: card collapses into a disc that becomes the badge in the next scene.
  const morph = tween(frame, [len - 26, len], [0, 1], EASE_IN_OUT);
  const w = 880 - morph * 360;
  const h = 660 - morph * 140;
  const radius = 44 + morph * 260;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 45% at 50% 62%, #12306E 0%, ${um.colors.bg} 50%, ${um.colors.bgDeep} 100%)`,
        perspective: 1600,
      }}
    >
      {/* 3D floor grid moving toward camera */}
      <div
        style={{
          position: "absolute",
          left: -1000,
          right: -1000,
          top: 1080,
          height: 1300,
          transform: "perspective(800px) rotateX(74deg)",
          transformOrigin: "top",
          backgroundImage:
            "linear-gradient(rgba(61,123,255,0.45) 2px, transparent 2px), linear-gradient(90deg, rgba(61,123,255,0.45) 2px, transparent 2px)",
          backgroundSize: "140px 140px",
          backgroundPosition: `0 ${frame * 3}px`,
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1030,
          height: 110,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(235,211,148,0.55) 0%, transparent 70%)",
          filter: "blur(20px)",
          opacity: rise,
        }}
      />
      <Bokeh seed="s3" opacity={0.35} />
      {FLOATERS.map((f, i) => {
        const p = spring({ frame: frame - 6 - i * 4, fps, config: { damping: 16 } });
        return (
          <div
            key={f.icon}
            style={{
              position: "absolute",
              left: f.x - f.s / 2 + Math.sin(frame * 0.03 + i) * 16 * f.d,
              top: f.y - f.s / 2 - frame * 0.6 * f.d,
              transform: `scale(${p * (0.7 + f.d * 0.3)})`,
              filter: `blur(${(1 - f.d) * 4}px)`,
              opacity: 0.55 + f.d * 0.45,
            }}
          >
            <IconBadge name={f.icon} size={f.s} progress={tween(frame, [10 + i * 4, 40 + i * 4], [0, 1])} />
          </div>
        );
      })}
      <ParticleField seed="s3" count={70} opacity={0.8} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600 }}>
        <div
          style={{
            transformOrigin: "50% 100%",
            transform: `translateY(${(1 - rise) * 520 - 40}px) rotateX(${(1 - rise) * 70}deg) scale(${1 - morph * 0.1})`,
            opacity: Math.min(1, rise * 1.5),
          }}
        >
          <GlassCard width={w} height={h} radius={radius} outline={outline}>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 70px",
                opacity: 1 - morph * 1.6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: content(14) }}>
                <Img src={staticFile("um/logo-mark-white.png")} style={{ height: 46 }} />
                <div
                  style={{
                    fontFamily: um.fonts.body,
                    fontSize: 28,
                    fontWeight: 600,
                    letterSpacing: 6,
                    color: um.colors.goldLight,
                  }}
                >
                  UNIQUE MARK
                </div>
              </div>
              <div
                style={{
                  height: 2,
                  margin: "34px 0 38px",
                  background: `linear-gradient(90deg, ${um.colors.gold}, transparent)`,
                  transformOrigin: "left",
                  transform: `scaleX(${content(20)})`,
                }}
              />
              <div
                style={{
                  fontFamily: um.fonts.display,
                  fontSize: 76,
                  fontWeight: 700,
                  letterSpacing: -1,
                  backgroundImage: um.goldGradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  opacity: content(22),
                  transform: `translateY(${(1 - content(22)) * 30}px)`,
                }}
              >
                Level 3 Diploma
              </div>
              <div
                style={{
                  fontFamily: um.fonts.display,
                  fontSize: 96,
                  fontWeight: 800,
                  lineHeight: 1.02,
                  letterSpacing: -3,
                  color: um.colors.white,
                  marginTop: 10,
                  opacity: content(30),
                  transform: `translateY(${(1 - content(30)) * 30}px)`,
                }}
              >
                Health &amp;
                <br />
                Social Care
              </div>
            </div>
          </GlassCard>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
