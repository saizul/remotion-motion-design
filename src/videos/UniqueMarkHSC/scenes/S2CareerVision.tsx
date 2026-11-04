import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../anim";
import { LightSweep } from "../components/Atmosphere";
import { Footage } from "../components/Footage";
import { ParticleField } from "../components/ParticleField";
import { Diploma3D } from "../components/three/Diploma3D";
import { StudioLights } from "../components/three/Studio";
import { um } from "../theme";

// Masked line that rises into place.
const Line: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 22 });
  return (
    <div style={{ overflow: "hidden", paddingBottom: 8 }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)`, opacity: p, ...style }}>{children}</div>
    </div>
  );
};

export const S2CareerVision: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = um.scenes.vision + um.overlap;
  const env = tween(frame, [10, 60], [0, 1], EASE_IN_OUT);
  const dip = spring({ frame: frame - 14, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: um.colors.bgDeep }}>
      <Footage src="um/clip-walk.mp4" duration={len} objectPosition="54% 30%" zoom={[1.18, 1.32]} trimBefore={10} />
      {/* Futuristic education environment builds over the footage */}
      <AbsoluteFill style={{ opacity: env, mixBlendMode: "screen" }}>
        <div
          style={{
            position: "absolute",
            left: -900,
            right: -900,
            bottom: -200,
            height: 900,
            transform: "perspective(900px) rotateX(70deg)",
            transformOrigin: "bottom",
            backgroundImage:
              "linear-gradient(rgba(61,123,255,0.5) 2px, transparent 2px), linear-gradient(90deg, rgba(61,123,255,0.5) 2px, transparent 2px)",
            backgroundSize: "120px 120px",
            backgroundPosition: `0 ${frame * 5}px`,
            maskImage: "linear-gradient(to top, #000 10%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to top, #000 10%, transparent 90%)",
          }}
        />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - (380 + i * 120),
              top: 700 - (380 + i * 120),
              width: (380 + i * 120) * 2,
              height: (380 + i * 120) * 2,
              borderRadius: "50%",
              border: `2px ${i === 1 ? "dashed" : "solid"} rgba(157,187,255,${0.35 - i * 0.08})`,
              transform: `rotate(${frame * (0.4 - i * 0.25)}deg) scale(${0.9 + env * 0.1})`,
            }}
          />
        ))}
      </AbsoluteFill>
      <ParticleField seed="s2" count={60} opacity={0.7} />
      <div style={{ position: "absolute", left: 520, top: 800, width: 600, height: 600, transform: `scale(${dip})` }}>
        <ThreeCanvas width={600} height={600} camera={{ fov: 35, position: [0, 0, 8] }}>
          <StudioLights envIntensity={0.7} />
          <Diploma3D scale={1.55} />
        </ThreeCanvas>
      </div>
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 80px 380px" }}>
        <Line delay={8}>
          <div style={{ fontFamily: um.fonts.display, fontSize: 64, fontWeight: 500, color: um.colors.white }}>
            Build your future in
          </div>
        </Line>
        <Line delay={18}>
          <div
            style={{
              fontFamily: um.fonts.display,
              fontSize: 118,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3,
              backgroundImage: um.goldGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Health &amp;
          </div>
        </Line>
        <Line delay={26}>
          <div
            style={{
              fontFamily: um.fonts.display,
              fontSize: 118,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3,
              color: um.colors.white,
            }}
          >
            Social Care
          </div>
        </Line>
      </AbsoluteFill>
      <LightSweep progress={tween(frame, [len - 26, len], [0, 1], EASE_IN_OUT)} />
    </AbsoluteFill>
  );
};
