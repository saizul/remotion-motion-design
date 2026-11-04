import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, EASE_OUT, tween } from "../anim";
import { Clip } from "../components/Clip";
import { IconBadge } from "../components/Icons";
import { BrightBackdrop } from "../components/Light";
import { Particles } from "../components/Particles";
import { TypeText } from "../components/TypeText";
import { TYPE_CUES } from "../typing";
import { OpenBook, SpeechBubble } from "../components/three/Objects";
import { DaylightStudio } from "../components/three/Studio";
import { b1 } from "../theme";

const BARS = 44;

// Glowing sound wave rising out of the book.
const SoundWave: React.FC<{ appear: number }> = ({ appear }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 140, top: 1175, width: 800, height: 150, display: "flex", alignItems: "center", gap: 7 }}>
      {new Array(BARS).fill(0).map((_, i) => {
        const env = Math.sin((i / (BARS - 1)) * Math.PI);
        const h =
          20 +
          env *
            110 *
            Math.abs(Math.sin(frame * 0.18 + i * 0.55) * 0.6 + Math.sin(frame * 0.07 + i * 1.3 + random(`w${i}`) * 3) * 0.4);
        const t = i / (BARS - 1);
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: h * appear,
              borderRadius: 6,
              background: t < 0.5 ? `linear-gradient(${b1.colors.blue}, ${b1.colors.navy})` : `linear-gradient(${b1.colors.redLight}, ${b1.colors.red})`,
              boxShadow: `0 0 14px ${t < 0.5 ? "rgba(47,111,228,0.45)" : "rgba(200,16,46,0.4)"}`,
              opacity: 0.35 + env * 0.65,
            }}
          />
        );
      })}
    </div>
  );
};

export const S2Course: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = b1.scenes.course + b1.overlap;
  const frameIn = spring({ frame: frame - 2, fps, config: { damping: 18 } });
  const open = tween(frame, [6, 40], [0, 1], EASE_OUT);
  const wave = tween(frame, [30, 50], [0, 1]);
  const badge = (d: number) => spring({ frame: frame - d, fps, config: { damping: 11 } });
  // Bubbles float up out of the book.
  const rise = (d: number) => tween(frame, [d, d + 40], [0, 1], EASE_OUT);

  return (
    <AbsoluteFill>
      <BrightBackdrop focusY={30} />
      <Particles seed="b1s2" count={50} opacity={0.5} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 130,
            width: 940,
            height: 600,
            borderRadius: 44,
            overflow: "hidden",
            border: "8px solid #FFFFFF",
            boxShadow: "0 40px 90px rgba(1,33,105,0.25)",
            opacity: frameIn,
            transform: `translateY(${(1 - frameIn) * 120}px) rotateX(${(1 - frameIn) * 18}deg) rotateY(${Math.sin(frame * 0.02) * 3}deg)`,
          }}
        >
          <Clip clip="b" duration={len} zoom={[1.04, 1.12]} objectPosition="55% 12%" />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 30, top: 90, transform: `scale(${badge(22)})` }}>
        <IconBadge name="headphones" size={130} progress={tween(frame, [24, 44], [0, 1])} />
      </div>
      <div style={{ position: "absolute", right: 30, top: 640, transform: `scale(${badge(30)})` }}>
        <IconBadge name="mic" size={130} progress={tween(frame, [32, 52], [0, 1])} />
      </div>
      <div style={{ position: "absolute", left: 80, top: 790, right: 80 }}>
        <TypeText cue={TYPE_CUES.courseTitle} highlight={["Speaking", "Course"]} fontSize={98} lineHeight={1.05} />
        <div style={{ marginTop: 20 }}>
          <TypeText cue={TYPE_CUES.courseSub} font={b1.fonts.body} fontSize={40} weight={500} lineHeight={1.3} letterSpacing={0} color={b1.colors.muted} />
        </div>
      </div>
      <SoundWave appear={wave} />
      <div style={{ position: "absolute", left: 0, top: 1150, width: 1080, height: 620 }}>
        <ThreeCanvas width={1080} height={620} camera={{ fov: 35, position: [0, 0, 12] }}>
          <DaylightStudio />
          <OpenBook position={[0, -1.3, 0]} scale={1.35} open={open} />
          <SpeechBubble position={[-2.4, -0.6 + rise(34) * 1.8, 1]} scale={0.45 * rise(34)} color="blue" phase={0} />
          <SpeechBubble position={[2.3, -0.6 + rise(44) * 1.5, 1]} scale={0.42 * rise(44)} color="red" phase={1.5} />
          <SpeechBubble position={[0.9, -0.6 + rise(56) * 2.3, -1]} scale={0.35 * rise(56)} color="white" phase={2.5} />
        </ThreeCanvas>
      </div>
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: tween(frame, [len - 14, len], [0, 0.4], EASE_IN_OUT) }} />
    </AbsoluteFill>
  );
};
