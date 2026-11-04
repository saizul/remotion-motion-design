import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../anim";
import { Clip } from "../components/Clip";
import { GlassCard } from "../components/GlassCard";
import { Icon, IconBadge, type IconName } from "../components/Icons";
import { BrightBackdrop } from "../components/Light";
import { Particles } from "../components/Particles";
import { TypeText } from "../components/TypeText";
import { TYPE_CUES } from "../typing";
import { Book, GradCap } from "../components/three/Objects";
import { DaylightStudio } from "../components/three/Studio";
import { b1 } from "../theme";

// Each card slides in, then its text types (cue starts ~6 frames after the card lands).
const FEATURES: { icon: IconName; cue: (typeof TYPE_CUES)["feature1"] }[] = [
  { icon: "calendar", cue: TYPE_CUES.feature1 },
  { icon: "clock", cue: TYPE_CUES.feature2 },
  { icon: "book", cue: TYPE_CUES.feature3 },
];
const APPEAR = FEATURES.map((f) => f.cue.start - 6);

// Small floating widget: rising progress bars.
const ChartWidget: React.FC<{ appear: number }> = ({ appear }) => {
  const frame = useCurrentFrame();
  return (
    <GlassCard width={250} height={190} radius={26} outline={0} sheen={false}>
      <div style={{ padding: "22px 24px", display: "flex", alignItems: "flex-end", gap: 16, height: "100%", boxSizing: "border-box" }}>
        {[0.35, 0.55, 0.75, 1].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h * 100 * tween(frame, [10 + i * 6, 40 + i * 6], [0, 1]) * appear}%`,
              borderRadius: 8,
              background: i === 3 ? b1.colors.red : b1.colors.navySoft,
            }}
          />
        ))}
      </div>
    </GlassCard>
  );
};

// Small floating certificate card.
const CertificateWidget: React.FC = () => (
  <GlassCard width={250} height={190} radius={26} outline={0} sheen={false}>
    <div style={{ padding: 24, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name="trophy" size={44} color={b1.colors.red} />
        <div style={{ height: 12, flex: 1, borderRadius: 6, background: b1.colors.navy }} />
      </div>
      {[1, 0.8, 0.6].map((w, i) => (
        <div key={i} style={{ height: 10, width: `${w * 100}%`, borderRadius: 5, background: "#C9D6EE" }} />
      ))}
      <div style={{ marginTop: "auto", alignSelf: "flex-end", width: 44, height: 44, borderRadius: 22, background: b1.colors.red }} />
    </div>
  </GlassCard>
);

export const S3Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = b1.scenes.features + b1.overlap;
  const w = (d: number) => spring({ frame: frame - d, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill>
      <BrightBackdrop focusY={70} />
      <AbsoluteFill
        style={{
          height: 1120,
          maskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
        }}
      >
        <Clip clip="c" duration={len} zoom={[1.1, 1.02]} pan={[-20, 20]} />
      </AbsoluteFill>
      <ThreeCanvas width={1080} height={1920} camera={{ fov: 45, position: [0, 0, 15] }}>
        <DaylightStudio />
        <Book position={[-3.3, 3.2, -2]} rotation={[0.3, 0.8, 0.2]} scale={0.7} cover="red" phase={0.5} />
        <GradCap position={[3.2, 0.6, -1]} scale={0.6} phase={1.8} />
        <Book position={[3.4, -5.6, -2]} rotation={[-0.2, -0.6, 0.3]} scale={0.8} cover="navy" phase={2.6} />
      </ThreeCanvas>
      <Particles seed="b1s3" count={40} opacity={0.5} />
      <div style={{ position: "absolute", left: 40, top: 150 + Math.sin(frame * 0.05) * 10, transform: `scale(${w(8)}) rotate(-4deg)` }}>
        <CertificateWidget />
      </div>
      <div style={{ position: "absolute", right: 40, top: 420 + Math.sin(frame * 0.05 + 2) * 10, transform: `scale(${w(14)}) rotate(4deg)` }}>
        <ChartWidget appear={w(14)} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 920,
          width: 1080,
          textAlign: "center",
        }}
      >
        <TypeText cue={TYPE_CUES.featuresEyebrow} font={b1.fonts.body} fontSize={30} weight={600} letterSpacing={8} color={b1.colors.red} align="center" caret={false} />
      </div>
      <AbsoluteFill style={{ perspective: 1600 }}>
        {FEATURES.map((f, i) => {
          const p = spring({ frame: frame - APPEAR[i], fps, config: { damping: 16 } });
          return (
            <div
              key={f.cue.text}
              style={{
                position: "absolute",
                left: 80,
                top: 990 + i * 170,
                opacity: Math.min(1, p * 1.5),
                transform: `translateX(${(1 - p) * 500}px) rotateY(${(1 - p) * -40}deg)`,
              }}
            >
              <GlassCard width={920} height={146} radius={30} outline={tween(frame, [APPEAR[i] + 4, APPEAR[i] + 30], [0, 1], EASE_IN_OUT)}>
                <div style={{ display: "flex", alignItems: "center", gap: 34, height: "100%", padding: "0 32px" }}>
                  <IconBadge name={f.icon} size={100} progress={tween(frame, [APPEAR[i] + 6, APPEAR[i] + 26], [0, 1])} />
                  <TypeText cue={f.cue} highlight={["10"]} fontSize={50} weight={700} letterSpacing={-0.5} />
                </div>
              </GlassCard>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
